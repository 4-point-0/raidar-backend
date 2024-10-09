import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BN } from 'bn.js';
import * as nearAPI from 'near-api-js';

/* It's a service that connects to the NEAR blockchain and provides methods for interacting with the NFT contract */
@Injectable()
export class NearProviderService {
  private readonly logger = new Logger(NearProviderService.name);

  // NEAR network ID (e.g. localnet, betanet, testnet, mainnet). For us it's testnet or mainnet
  private networkId: string;

  // NEAR account ID of the contract that will have NFTs
  private nftContractAccountId: string;

  // NEAR account ID of the account that will pay to mint NFTs
  private masterAccountId: string;

  // NEAR account private key of the account that will pay to mint NFTs
  private masterAccountPrivateKey: string;

  // NEAR config
  private config: nearAPI.ConnectConfig;

  // NEAR instance
  private near: nearAPI.Near | null;

  // NEAR account instance of the master account that will call contract to mint NFTs
  private masterAccount: nearAPI.Account | null;

  // NEAR key store
  private keyStore = new nearAPI.keyStores.InMemoryKeyStore();

  // Boatload of gas to pay for minting/burning NFTs (300 Tgas). We don't care about this gas because NEAR will refund unused gas
  private gas = new BN('300000000000000');

  /**
   * We're creating a constructor function that takes in a configService object as a parameter using dependecy injection. We're
   * then setting the networkId, nftContractAccountId, masterAccountId, and masterAccountPrivateKey to
   * the values that we get from the configService object
   * @param {ConfigService} configService - This is a service that we'll use to get the configuration
   * values from the .env file.
   */
  constructor(private readonly configService: ConfigService) {
    this.networkId = this.configService.get('near.network_id');
    this.nftContractAccountId = this.configService.get(
      'near.nft_contract_account_id',
    );
    this.masterAccountId = this.configService.get('near.master_account_id');
    this.masterAccountPrivateKey = this.configService.get(
      'near.master_account_private_key',
    );

    this.near = null;
    this.masterAccount = null;
  }

  async onModuleInit() {
    await this.init();
  }

  /**
   * It connects to the NEAR blockchain and sets up the master account
   */
  private async init() {
    if (this.near && this.masterAccount) return;

    this.config = {
      networkId: this.networkId,
      nodeUrl: `https://rpc.${this.networkId}.near.org`,
      walletUrl: `https://wallet.${this.networkId}.near.org`,
      helperUrl: `https://helper.${this.networkId}.near.org`,
    };

    const masterAccountKeyPair = nearAPI.KeyPair.fromString(
      this.masterAccountPrivateKey,
    );

    await this.keyStore.setKey(
      this.config.networkId,
      this.masterAccountId,
      masterAccountKeyPair,
    );

    this.near = await nearAPI.connect({
      ...this.config,
      keyStore: this.keyStore,
    });

    this.masterAccount = await this.near.account(this.masterAccountId);
  }

  /**
   * It buys NFT by tokenId for given accountId
   * @param {string} tokenId - The token ID of the NFT you want to buy.
   * @param {string} accountId - The account ID of the account that wants to buy.
   * @returns A boolean value.
   */
  async buyForUser(tokenId: string, accountId: string): Promise<boolean> {
    try {
      await this.masterAccount.functionCall({
        contractId: this.nftContractAccountId,
        methodName: 'buy_for_user',
        args: {
          tokenId: tokenId,
          accountId: accountId,
        },
        gas: this.gas,
        attachedDeposit: '0' as any,
      });

      return true;
    } catch (error) {
      this.logger.error('Error executing contract function call: ', error);
    }

    return false;
  }

  async createAccount(accountId: string): Promise<boolean> {
    try {
      const keyPair = nearAPI.KeyPair.fromRandom('ed25519');
      await this.keyStore.setKey(this.config.networkId, accountId, keyPair);

      const account = await this.masterAccount.createAccount(
        accountId,
        keyPair.getPublicKey(),
        new BN(nearAPI.utils.format.parseNearAmount('0.1')),
      );

      return !!account;
    } catch (error) {
      this.logger.error('Error creating NEAR account: ', error);
      return false;
    }
  }

  async fundWithNear(accountId: string, nearAmount = '0.02'): Promise<boolean> {
    try {
      await this.masterAccount.sendMoney(
        accountId,
        nearAPI.utils.format.parseNearAmount(nearAmount) as any,
      );
      return true;
    } catch (error) {
      this.logger.error('Error sending money: ', error);
      return false;
    }
  }

  async doesAccountNeedToBeFunded(accountId: string): Promise<boolean> {
    try {
      const account = await this.near.account(accountId);
      const accountState = await account.state();
      return accountState.amount === '0';
    } catch (error) {
      this.logger.error('Error getting account state: ', error);
      return true;
    }
  }
}
