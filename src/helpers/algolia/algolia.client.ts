import { Injectable } from '@nestjs/common';
import algoliasearch from 'algoliasearch/lite';
import { ServerError } from '../response/errors';

@Injectable()
export class AlgoliaClient {
  private client;
  private index;

  constructor(applicationID: string, adminAPIKey: string, indexName: string) {
    this.client = algoliasearch(applicationID, adminAPIKey);
    this.index = this.client.initIndex(indexName);
  }

  async indexRecord(record) {
    try {
      await this.index.saveObject(record);
    } catch (error) {
      return new ServerError(`Can't index records: ${error.message}`);
    }
  }

  async indexMultipleRecords(records) {
    try {
      await this.index.saveObjects(records);
    } catch (error) {
      return new ServerError(`Can't index records: ${error.message}`);
    }
  }

  async search(query, parameters = {}) {
    try {
      const result = await this.index.search(query, parameters);
      return result;
    } catch (error) {
      return new ServerError(`Can't perform search: ${error.message}`);
    }
  }
}
