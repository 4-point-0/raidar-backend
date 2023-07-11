import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlbumImageRename1689080744077 implements MigrationInterface {
  name = 'AlbumImageRename1689080744077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "image_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" RENAME COLUMN "image_id" TO "cover_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "cover_id_fkey" FOREIGN KEY ("cover_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "cover_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" RENAME COLUMN "cover_id" TO "image_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
