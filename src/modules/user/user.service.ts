import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { sha256 } from 'js-sha256';
import * as nacl from 'tweetnacl';
import * as borsh from 'borsh';
import { edsa } from '../../common/constants';
import { getRpcPostArguments } from '../../helpers/rpc/rpc-call-arguments';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ServiceResult } from '../../helpers/response/result';
import { AddWalletDto } from './dto/add-wallet.dto';
import {
  BadRequest,
  NotFound,
  ServerError,
} from '../../helpers/response/errors';
import { isNearWallet } from '../../utils/near-wallet-validation';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  public async addWallet(dto: AddWalletDto): Promise<ServiceResult<UserDto>> {
    try {
      if (!isNearWallet(dto.wallet_address)) {
        return new BadRequest<UserDto>(
          `Wallet ${dto.wallet_address} not valid`,
        );
      }

      const user = await this.userRepository.findOneBy({ id: dto.id });

      if (!user) {
        return new NotFound('User not found!');
      }

      if (user.wallet_address) {
        return new BadRequest('Wallet already added!');
      }

      user.wallet_address = dto.wallet_address;

      await this.userRepository.save(user);

      const updated_user = await this.userRepository.findOneBy({ id: dto.id });

      return new ServiceResult<UserDto>(UserDto.fromEntity(updated_user));
    } catch (error) {
      this.logger.error('UserService - addWallet', error);
      return new ServerError<UserDto>(`Can't add wallet`);
    }
  }

  private async nearValidate(
    username: string,
    signedJsonString: string,
  ): Promise<boolean> {
    try {
      // Parameters:
      //   username: the NEAR accountId (e.g. test.near)
      //   signedJsonString: a json.stringify of the object {"signature", "publicKey"},
      //             where "signature" is the signature obtained after signing
      //             the user's username (e.g. test.near), and "publicKey" is
      //             the user's public key
      let { signature, publicKey } = JSON.parse(signedJsonString);

      // We expect the user to sign a message composed by its USERNAME
      const msg = Uint8Array.from(sha256.array(username));
      signature = Uint8Array.from(Object.values(signature));
      publicKey = Uint8Array.from(Object.values(publicKey.data));

      // check that the signature was created using the counterpart private key
      const valid_signature = nacl.sign.detached.verify(
        msg,
        signature,
        publicKey,
      );

      // and that the publicKey is from this USERNAME
      const pK_of_account = await this.nearValidatePublicKeyByAccountId(
        username,
        publicKey,
      );

      if (!valid_signature || !pK_of_account) return null;

      return true;
    } catch (error) {
      this.logger.error('UserService - nearValidate', error);
      return false;
    }
  }

  private async nearValidatePublicKeyByAccountId(
    accountId: string,
    pkArray: string | Uint8Array,
  ): Promise<boolean> {
    try {
      const currentPublicKey = edsa + borsh.baseEncode(pkArray);
      const { url, payload, config } = getRpcPostArguments(
        accountId,
        this.configService.get('MODE'),
      );
      const result = await firstValueFrom(
        this.httpService.post(url, payload, config),
      );

      const data = result.data;

      if (!data || !data.result || !data.result.keys) return false;

      for (const key in data.result.keys) {
        if (data.result.keys[key].public_key === currentPublicKey) return true;
      }

      return false;
    } catch (error) {
      this.logger.error(
        'UserService - nearValidatePublicKeyByAccountId',
        error,
      );
      return false;
    }
  }
}
