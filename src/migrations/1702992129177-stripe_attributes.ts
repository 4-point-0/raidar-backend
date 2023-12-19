import { MigrationInterface, QueryRunner } from "typeorm";

export class StripeAttributes1702992129177 implements MigrationInterface {
    name = 'StripeAttributes1702992129177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "licence" ADD "invoice_id" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "song" ADD "price_id" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "price_id"`);
        await queryRunner.query(`ALTER TABLE "licence" DROP COLUMN "invoice_id"`);
    }

}
