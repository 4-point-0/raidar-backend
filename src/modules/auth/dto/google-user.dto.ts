import { Provider } from '../../../common/enums/enum';

export class GoogleUserDto {
  email: string;
  first_name: string;
  last_name: string;
  provider: Provider;
  provider_id: string;
}
