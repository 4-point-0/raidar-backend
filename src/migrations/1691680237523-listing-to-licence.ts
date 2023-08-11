import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListingToLicence1691680237523 implements MigrationInterface {
  name = 'ListingToLicence1691680237523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE listing RENAME TO licence`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE licence RENAME TO listing`);
  }
}
