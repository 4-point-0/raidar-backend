import { AlgoliaClient } from './algolia.client';
import { ConfigService } from '@nestjs/config';

export const createAlgoliaClient = (
  configService: ConfigService,
  indexName: string,
) => {
  const applicationID = configService.get('algolia.app_id');
  const adminAPIKey = configService.get('algolia.api_key');
  return new AlgoliaClient(applicationID, adminAPIKey, indexName);
};
