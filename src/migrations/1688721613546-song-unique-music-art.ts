import { MigrationInterface, QueryRunner } from 'typeorm';

export class SongUniqueMusicArt1688721613546 implements MigrationInterface {
  name = 'SongUniqueMusicArt1688721613546';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song" ADD CONSTRAINT "UQ_efc187abc66a3abce284b21ebdd" UNIQUE ("music_id", "art_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song" DROP CONSTRAINT "UQ_efc187abc66a3abce284b21ebdd"`,
    );
  }
}
