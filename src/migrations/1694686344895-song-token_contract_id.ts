import { MigrationInterface, QueryRunner } from 'typeorm';

export class SongTokenContractId1694686344895 implements MigrationInterface {
  name = 'SongTokenContractId1694686344895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song" ADD "token_contract_id" SERIAL NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song" DROP COLUMN "token_contract_id"`,
    );
  }
}
