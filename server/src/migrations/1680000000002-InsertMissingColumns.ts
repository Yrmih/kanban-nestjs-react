import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertMissingColumns1680000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const defaultColumns = ['To Do', 'In Progress', 'Testing', 'Done'];

    for (const title of defaultColumns) {
      await queryRunner.query(
        `INSERT INTO columns (title)
         VALUES ($1)
         ON CONFLICT (title) DO NOTHING`,
        [title],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM columns WHERE title IN ('To Do', 'In Progress', 'Testing', 'Done')`,
    );
  }
}
