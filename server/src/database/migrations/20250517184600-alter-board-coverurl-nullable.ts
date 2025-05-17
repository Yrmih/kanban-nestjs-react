import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterBoardCoverurlNullable20250517184600 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE boards ALTER COLUMN "coverUrl" DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE boards ALTER COLUMN "coverUrl" SET NOT NULL;
    `);
  }
}
