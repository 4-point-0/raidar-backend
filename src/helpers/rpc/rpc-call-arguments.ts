import { AxiosPostDto } from './dto/axios-post.dto';
import { getRpc } from './rpc-helper';

export const getRpcPostArguments = (
  accountId: string,
  NODE_ENV: string,
): AxiosPostDto => {
  return {
    url: getRpc(NODE_ENV),
    payload: {
      jsonrpc: '2.0',
      method: 'query',
      params: [`access_key/${accountId}`, ''],
      id: 1,
    },
    config: {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    },
  };
};
