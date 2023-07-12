import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueCoverId1689081236565 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_UNIQUE_COVER_ID" ON "album" ("cover_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_UNIQUE_COVER_ID"`);
  }
}
