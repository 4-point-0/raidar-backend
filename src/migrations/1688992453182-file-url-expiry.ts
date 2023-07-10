import { MigrationInterface, QueryRunner } from 'typeorm';

export class FileUrlExpiry1688992453182 implements MigrationInterface {
  name = 'FileUrlExpiry1688992453182';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" ADD "url_expiry" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "url_expiry"`);
  }
}
