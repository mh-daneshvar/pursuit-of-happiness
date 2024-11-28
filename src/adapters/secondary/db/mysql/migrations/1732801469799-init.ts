import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1732801469799 implements MigrationInterface {
    name = 'Init1732801469799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`groups\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), \`deleted_at\` datetime(3) NULL, \`parent_id\` bigint NULL, \`owner_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`members\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), \`deleted_at\` datetime(3) NULL, \`group_id\` bigint NOT NULL, \`user_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`permissions\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`permission_type\` enum ('VIEW', 'EDIT') NOT NULL, \`permitted_type\` enum ('INDIVIDUAL', 'MEMBERSHIP') NOT NULL, \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), \`deleted_at\` datetime(3) NULL, \`tweet_id\` varchar(36) NOT NULL, \`group_id\` bigint NULL, \`user_id\` bigint NULL, \`member_id\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`hashtags\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`text\` varchar(511) NOT NULL, \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), \`deleted_at\` datetime(3) NULL, UNIQUE INDEX \`IDX_d8a87e5486a087a003c2922858\` (\`text\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tweets\` (\`id\` varchar(36) NOT NULL, \`content\` text NOT NULL, \`location\` text NOT NULL, \`type\` enum ('POST', 'REPLY') NOT NULL, \`category\` enum ('SPORT', 'FINANCE', 'TECH', 'NEWS') NULL, \`inherit_view_permissions\` tinyint NULL DEFAULT 0, \`inherit_edit_permissions\` tinyint NULL DEFAULT 0, \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), \`deleted_at\` datetime(3) NULL, \`parent_id\` varchar(36) NULL, \`author_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NULL, \`username\` varchar(50) NOT NULL, \`mobile_number\` varchar(15) NULL, \`email\` varchar(320) NOT NULL, \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_350c2c34c6fdd4b292ab6e7787\` (\`mobile_number\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tweets_hashtags\` (\`tweet_id\` varchar(255) NOT NULL, \`hashtag_id\` bigint NOT NULL, \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), \`deleted_at\` datetime(3) NULL, PRIMARY KEY (\`tweet_id\`, \`hashtag_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`invitations\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`link\` varchar(255) NOT NULL, \`status\` enum ('SENT', 'ACCEPTED', 'OPENED', 'REJECTED') NOT NULL DEFAULT 'SENT', \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), \`deleted_at\` datetime(3) NULL, \`inviter_id\` bigint NOT NULL, \`invitee_id\` bigint NOT NULL, \`group_id\` bigint NOT NULL, UNIQUE INDEX \`IDX_2809c6ac2281d18025e2841da1\` (\`link\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`events\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`eventable_type\` enum ('POST', 'REPLY') NOT NULL, \`eventable_id\` int NOT NULL, \`action\` enum ('WRITE', 'UPDATED', 'DELETED') NOT NULL, \`description\` json NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`actor_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` ADD \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` ADD \`deleted_at\` datetime(3) NULL`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` ADD PRIMARY KEY (\`hashtag_id\`)`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` DROP COLUMN \`tweet_id\``);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` ADD \`tweet_id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` ADD PRIMARY KEY (\`hashtag_id\`, \`tweet_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_07a2bdb3d68a4b5c3ba06cd24d\` ON \`tweets_hashtags\` (\`tweet_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_79236d1736463c7c290e4ff9fa\` ON \`tweets_hashtags\` (\`hashtag_id\`)`);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD CONSTRAINT \`FK_d768ea35a407c2ba9c0b038b613\` FOREIGN KEY (\`parent_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD CONSTRAINT \`FK_5d7af25843377def343ab0beaa8\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`members\` ADD CONSTRAINT \`FK_b9dc6083fb1fc597d2018a19e84\` FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`members\` ADD CONSTRAINT \`FK_da404b5fd9c390e25338996e2d1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD CONSTRAINT \`FK_ae3b16ee63d0b596b7f3a759a17\` FOREIGN KEY (\`tweet_id\`) REFERENCES \`tweets\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD CONSTRAINT \`FK_f34a6308df22510d840dd3ce1fc\` FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD CONSTRAINT \`FK_03f05d2567b1421a6f294d69f45\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD CONSTRAINT \`FK_f172e44a36b77077d9c7dfc3096\` FOREIGN KEY (\`member_id\`) REFERENCES \`members\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tweets\` ADD CONSTRAINT \`FK_ee2886e12f1fc7d3bf1beb9997a\` FOREIGN KEY (\`parent_id\`) REFERENCES \`tweets\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tweets\` ADD CONSTRAINT \`FK_6783f8d04acbff7ce2b2ee823f7\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` ADD CONSTRAINT \`FK_07a2bdb3d68a4b5c3ba06cd24d2\` FOREIGN KEY (\`tweet_id\`) REFERENCES \`tweets\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` ADD CONSTRAINT \`FK_79236d1736463c7c290e4ff9faa\` FOREIGN KEY (\`hashtag_id\`) REFERENCES \`hashtags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invitations\` ADD CONSTRAINT \`FK_9752bd6630e9c8a1e1b046b43e7\` FOREIGN KEY (\`inviter_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invitations\` ADD CONSTRAINT \`FK_00a9fbc86a920e5788ffcb1dc38\` FOREIGN KEY (\`invitee_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invitations\` ADD CONSTRAINT \`FK_06b302ebb4ecf4725f6278cdf42\` FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_d1bde4e07e02555eadc160c0de2\` FOREIGN KEY (\`actor_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_d1bde4e07e02555eadc160c0de2\``);
        await queryRunner.query(`ALTER TABLE \`invitations\` DROP FOREIGN KEY \`FK_06b302ebb4ecf4725f6278cdf42\``);
        await queryRunner.query(`ALTER TABLE \`invitations\` DROP FOREIGN KEY \`FK_00a9fbc86a920e5788ffcb1dc38\``);
        await queryRunner.query(`ALTER TABLE \`invitations\` DROP FOREIGN KEY \`FK_9752bd6630e9c8a1e1b046b43e7\``);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` DROP FOREIGN KEY \`FK_79236d1736463c7c290e4ff9faa\``);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` DROP FOREIGN KEY \`FK_07a2bdb3d68a4b5c3ba06cd24d2\``);
        await queryRunner.query(`ALTER TABLE \`tweets\` DROP FOREIGN KEY \`FK_6783f8d04acbff7ce2b2ee823f7\``);
        await queryRunner.query(`ALTER TABLE \`tweets\` DROP FOREIGN KEY \`FK_ee2886e12f1fc7d3bf1beb9997a\``);
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP FOREIGN KEY \`FK_f172e44a36b77077d9c7dfc3096\``);
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP FOREIGN KEY \`FK_03f05d2567b1421a6f294d69f45\``);
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP FOREIGN KEY \`FK_f34a6308df22510d840dd3ce1fc\``);
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP FOREIGN KEY \`FK_ae3b16ee63d0b596b7f3a759a17\``);
        await queryRunner.query(`ALTER TABLE \`members\` DROP FOREIGN KEY \`FK_da404b5fd9c390e25338996e2d1\``);
        await queryRunner.query(`ALTER TABLE \`members\` DROP FOREIGN KEY \`FK_b9dc6083fb1fc597d2018a19e84\``);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP FOREIGN KEY \`FK_5d7af25843377def343ab0beaa8\``);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP FOREIGN KEY \`FK_d768ea35a407c2ba9c0b038b613\``);
        await queryRunner.query(`DROP INDEX \`IDX_79236d1736463c7c290e4ff9fa\` ON \`tweets_hashtags\``);
        await queryRunner.query(`DROP INDEX \`IDX_07a2bdb3d68a4b5c3ba06cd24d\` ON \`tweets_hashtags\``);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` ADD PRIMARY KEY (\`hashtag_id\`)`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` DROP COLUMN \`tweet_id\``);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` ADD \`tweet_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` ADD PRIMARY KEY (\`tweet_id\`, \`hashtag_id\`)`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` ADD \`deleted_at\` datetime(3) NULL`);
        await queryRunner.query(`ALTER TABLE \`tweets_hashtags\` ADD \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`DROP TABLE \`events\``);
        await queryRunner.query(`DROP INDEX \`IDX_2809c6ac2281d18025e2841da1\` ON \`invitations\``);
        await queryRunner.query(`DROP TABLE \`invitations\``);
        await queryRunner.query(`DROP TABLE \`tweets_hashtags\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_350c2c34c6fdd4b292ab6e7787\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`tweets\``);
        await queryRunner.query(`DROP INDEX \`IDX_d8a87e5486a087a003c2922858\` ON \`hashtags\``);
        await queryRunner.query(`DROP TABLE \`hashtags\``);
        await queryRunner.query(`DROP TABLE \`permissions\``);
        await queryRunner.query(`DROP TABLE \`members\``);
        await queryRunner.query(`DROP TABLE \`groups\``);
    }

}
