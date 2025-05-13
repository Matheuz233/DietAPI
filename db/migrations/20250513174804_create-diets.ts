import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("diets", (table) => {
    table.uuid("id").primary()
    table.uuid("session_id").index()
    table.text("name").notNullable()
    table.text("description").nullable()
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable()
    table.timestamp("updated_at").nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("diets")
}
