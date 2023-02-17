/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

//https://app.diagrams.net/#G16d92aWLsPwZiQt4vTEqGfERDxKfwUQXF

exports.up = function (knex) {
  return knex.schema
    .createTable("profiles", (table) => {
      table.uuid("id").references("id").inTable("auth.users").primary();
      table.string("name", 18).notNullable();
      table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    })
    .createTable("projects", (table) => {
      table.uuid("id").primary();
      table.string("project_name", 50).notNullable().unique();
      table.string("project_objective", 256);
      table.string("background", 512);
      table.boolean("is_deleted").notNullable().defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    })
    .createTable("projects_profiles", (table) => {
      table.uuid("id").notNullable.primary();
      table.uuid("string");
    })
    .createTable("lots", (table) => {
      table.uuid("id").primary();
      table.string("lot_number", 32).notNullable().unique();
      table.uuid("project_id", 35).references("id").inTable("projects");
      table
        .timestamp("production_date")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.string("standard_lot_number");
      table.uuid("profile_id").references("id").inTable("profiles");
      table.string("lot_objective", 256);
      table.string("details", 256);
      table.boolean("is_deleted").notNullable().defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    })
    .createTable("processes", (table) => {
      table.uuid("id").primary();
      table.uuid("lot_id").references("id").inTable("lots");
      table.integer("process_order").notNullable().checkPositive();
      table.string("process_name", 24);
      table.string("container", 24);
      table.boolean("is_deleted").notNullable().defaultTo(false);
    })
    .createTable("operation_types", (table) => {
      table.uuid("id").primary();
      table.string("operation_type_name", 12).notNullable().unique();
      table.string("details", 256);
      table.boolean("is_deleted").notNullable().defaultTo(false);
    })
    .createTable("operations", (table) => {
      table.uuid("id").primary();
      table.uuid("process_id", 35).references("id").inTable("processes");
      table.integer("operation_order").notNullable().checkPositive();
      table
        .uuid("operation_type_id")
        .references("id")
        .inTable("operation_types");
      table.decimal("value", null);
      table.string("details", 256);
      table.uuid("processed_material").references("id").inTable("processes");
      table.boolean("is_deleted").notNullable().defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema
    .dropTable("operations")
    .dropTable("operation_types")
    .dropTable("processes")
    .dropTable("lots")
    .dropTable("projects")
    .dropTable("profiles");
};

/*
    
*/

/*
.createTable("diff_operations", (table) => {
      table.uuid("id").primary();
      table.string("lot_id", 35).references("id").inTable("lots");
      table.string("diff_type", 1).checkIn(["+", "-"]);
      table.integer("operation_order").notNullable().checkPositive();
      table
        .string("operation_type_id")
        .references("id")
        .inTable("operation_types");
      table.decimal("value", null);
      table.string("processed_material").references("id").inTable("processes");
      table.boolean("is_deleted").notNullable().defaultTo(false);
    })
    .createTable("diff_results", (table) => {
      table.uuid("id").primary();
      table.string("lot_id", 35).references("id").inTable("lots");
      table.string("test_method_id").references("id").inTable("test");
      table.decimal("value_diff", null);
      table.string("standard_lot_id").references("id").inTable("lots");
      table.boolean("is_deleted").notNullable().defaultTo(false);
    })
    .createTable("test", (table) => {
      table.uuid("id").primary();
      table.string("lot_id", 35).references("id").inTable("lots");
      table.string("test_method_id").references("id").inTable("test");
      table.timestamp("test_date").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    });
*/
