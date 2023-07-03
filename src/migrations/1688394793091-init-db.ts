import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1688394793091 implements MigrationInterface {
    name = 'InitDb1688394793091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "listing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying(255) NOT NULL, "updated_by_id" character varying(255) NOT NULL, "tx_hash" character varying(255), "song_id" uuid, "seller_id" uuid, "buyer_id" uuid, CONSTRAINT "PK_381d45ebb8692362c156d6b87d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_roles_enum" AS ENUM('user', 'artist')`);
        await queryRunner.query(`CREATE TYPE "public"."user_provider_enum" AS ENUM('google')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "first_name" character varying(255), "last_name" character varying(255), "roles" "public"."user_roles_enum" NOT NULL DEFAULT 'user', "provider" "public"."user_provider_enum" DEFAULT 'google', "provider_id" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5e3a2b86fd9a9c22c266ae04731" UNIQUE ("provider_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying(255) NOT NULL, "updated_by_id" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "mime_type" character varying(255) NOT NULL, "url" character varying(512) NOT NULL, "key" character varying(512) NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "song" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying(255) NOT NULL, "updated_by_id" character varying(255) NOT NULL, "title" character varying(512) NOT NULL, "length" integer, "genre" character varying(512), "mood" text array NOT NULL, "tags" text array NOT NULL, "bpm" integer, "instrumental" boolean, "languages" text array, "vocal_ranges" text array, "musical_key" character varying(255), "price" numeric(10,2) NOT NULL DEFAULT '0', "recording_date" TIMESTAMP, "recording_country" character varying(512), "recording_location" character varying(512), "pka" character varying(255), "user_id" uuid, "album_id" uuid, "music_id" uuid, "art_id" uuid, CONSTRAINT "REL_19a8674be579f7704ec9c6cab6" UNIQUE ("music_id"), CONSTRAINT "REL_1ebe1ebec92f808c92e83bb24f" UNIQUE ("art_id"), CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying(255) NOT NULL, "updated_by_id" character varying(255) NOT NULL, "title" character varying(255) NOT NULL, "pka" character varying(255), "image_id" uuid, CONSTRAINT "REL_c8ae8a5ea47893a7e819c56797" UNIQUE ("image_id"), CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "fkey_constraint_name" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "art_id_fkey" FOREIGN KEY ("art_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "image_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "art_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "music_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "album_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "fkey_constraint_name"`);
        await queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "buyer_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "seller_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "song_id_fkey"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`DROP TABLE "song"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_provider_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_roles_enum"`);
        await queryRunner.query(`DROP TABLE "listing"`);
    }

}
