import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListingToLicence1691680237523 implements MigrationInterface {
  name = 'ListingToLicence1691680237523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE listing RENAME TO licence`);
    await queryRunner.query(`ALTER TABLE licence DROP COLUMN price`);
    await queryRunner.query(
      `ALTER TABLE song ADD COLUMN price decimal(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE song DROP COLUMN price`);
    await queryRunner.query(
      `ALTER TABLE licence ADD COLUMN price decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE licence RENAME TO listing`);
  }
}
