import { MigrationInterface, QueryRunner } from 'typeorm';

export class Contracts1700654837525 implements MigrationInterface {
  name = 'Contracts1700654837525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "contract" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying(255) NOT NULL, "updated_by_id" character varying(255) NOT NULL, "pdfUrl" character varying(2048) NOT NULL, "artist_id" uuid, "customer_id" uuid, "song_id" uuid, CONSTRAINT "PK_17c3a89f58a2997276084e706e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "FK_14b2b56438f0da9c7e313b72584" FOREIGN KEY ("artist_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "FK_abdcabff39fa6c1acbb67d69a03" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "FK_429ff0c269171303c15cd77e82c" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract" DROP CONSTRAINT "FK_429ff0c269171303c15cd77e82c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" DROP CONSTRAINT "FK_abdcabff39fa6c1acbb67d69a03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" DROP CONSTRAINT "FK_14b2b56438f0da9c7e313b72584"`,
    );
    await queryRunner.query(`DROP TABLE "contract"`);
  }
}
