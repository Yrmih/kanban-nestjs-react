import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintToColumnsTitle1680000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE columns
      ADD CONSTRAINT unique_title UNIQUE (title)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE columns
      DROP CONSTRAINT unique_title
    `);
  }
}
