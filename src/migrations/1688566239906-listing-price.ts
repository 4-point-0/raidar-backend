import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListingPrice1688566239906 implements MigrationInterface {
  name = 'ListingPrice1688566239906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "listing" ADD "price" numeric(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listing" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "song" ADD "price" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
  }
}
