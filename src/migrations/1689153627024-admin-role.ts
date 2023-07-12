import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminRole1689153627024 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TYPE "public"."user_roles_enum" ADD VALUE 'admin'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Empty down
  }
}
