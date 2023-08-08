import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListingSoldPrice1691495666743 implements MigrationInterface {
  name = 'ListingSoldPrice1691495666743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_UNIQUE_COVER_ID"`);
    await queryRunner.query(
      `ALTER TABLE "listing" ADD "sold_price" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listing" DROP COLUMN "sold_price"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_UNIQUE_COVER_ID" ON "album" ("cover_id") `,
    );
  }
}
