import { Provider, Role } from '../../../common/enums/enum';

export class GoogleUserDto {
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  provider: Provider;
  provider_id: string;
}
