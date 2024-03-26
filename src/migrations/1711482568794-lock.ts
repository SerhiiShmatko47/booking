import { MigrationInterface, QueryRunner } from 'typeorm'

export class Lock1711482568794 implements MigrationInterface {
    name = 'Lock1711482568794'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "apartments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sequenceNumber" integer NOT NULL, "isOccupied" boolean NOT NULL, "type" character varying NOT NULL, "leaseStartDate" date, "leaseEndDate" date, "currentOwnerId" uuid, CONSTRAINT "PK_f6058e85d6d715dbe22b72fe722" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `ALTER TABLE "apartments" ADD CONSTRAINT "FK_bea2b6b30c2a83656b2ad852c84" FOREIGN KEY ("currentOwnerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "apartments" DROP CONSTRAINT "FK_bea2b6b30c2a83656b2ad852c84"`,
        )
        await queryRunner.query(`DROP TABLE "apartments"`)
    }
}
