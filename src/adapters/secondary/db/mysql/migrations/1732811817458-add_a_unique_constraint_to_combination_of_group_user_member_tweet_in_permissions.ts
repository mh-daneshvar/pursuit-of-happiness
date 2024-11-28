import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAUniqueConstraintToCombinationOfGroupUserMemberTweetInPermissions1732811817458
  implements MigrationInterface
{
  name =
    'AddAUniqueConstraintToCombinationOfGroupUserMemberTweetInPermissions1732811817458';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_d0cb05a257296b23e2053350b4\` ON \`permissions\` (\`permission_type\`,
                                                                                                        \`permitted_type\`,
                                                                                                        \`group_id\`,
                                                                                                        \`user_id\`,
                                                                                                        \`member_id\`,
                                                                                                        \`tweet_id\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_d0cb05a257296b23e2053350b4\` ON \`permissions\``,
    );
  }
}
