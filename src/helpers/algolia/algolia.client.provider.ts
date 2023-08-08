import { AlgoliaClient } from './algolia.client';
import { ConfigService } from '@nestjs/config';

export const createAlgoliaClient = (configService: ConfigService) => {
  const applicationID = configService.get('algolia.app_id');
  const adminAPIKey = configService.get('algolia.api_key');
  const indexName = configService.get('algolia.index_name');
  return new AlgoliaClient(applicationID, adminAPIKey, indexName);
};
