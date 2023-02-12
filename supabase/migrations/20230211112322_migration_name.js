/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

//https://app.diagrams.net/#G16d92aWLsPwZiQt4vTEqGfERDxKfwUQXF

exports.up = function (knex) {
  return knex.schema
    .createTable("profiles", (table) => {
      table
        .uuid("id")
        .references("id")
        .inTable("auth.users")
        .primary()
        .onDelete("CASCADE");
      table.string("name", 18).notNullable();
    })
    .createTable("projects", (table) => {
      table.string("id", 35).notNullable().primary();
      table.string("project_name", 50).notNullable().unique();
      table.string("project_objective", 256);
      table.string("background", 512);
      table.integer("is_deleted").notNullable().defaultTo(0);
      table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    })
    .createTable("users", (table) => {
      table.string("id", 35).notNullable().primary();
      table.string("user_name", 50).notNullable().unique();
      table.integer("is_deleted").notNullable().defaultTo(0);
      table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    })
    .createTable("lots", (table) => {
      table.string("id", 35).notNullable().primary();
      table.string("lot_number", 32).notNullable().unique();
      table.string("project_id", 35).references("id").inTable("projects");
      table
        .timestamp("production_date")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.string("standard_lot_number");
      table.string("user_id").references("id").inTable("users");
      table.string("lot_objective", 256);
      table.string("details", 256);
      table.integer("is_deleted").notNullable().defaultTo(0);
      table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    })
    .createTable("processes", (table) => {
      table.string("id", 35).notNullable().primary();
      table.string("lot_id").references("id").inTable("lots");
      table.integer("process_order").notNullable().checkPositive();
      table.string("process_name", 24);
      table.string("container", 24);
      table.integer("is_deleted").notNullable().defaultTo(0);
    })
    .createTable("operation_types", (table) => {
      table.string("id", 35).notNullable().primary();
      table.string("operation_type_name", 12).notNullable().unique();
      table.string("details", 256);
      table.integer("is_deleted").notNullable().defaultTo(0);
    })
    .createTable("operations", (table) => {
      table.string("id", 35).notNullable().primary();
      table.string("process_id", 35).references("id").inTable("processes");
      table.integer("operation_order").notNullable().checkPositive();
      table
        .string("operation_type_id")
        .references("id")
        .inTable("operation_types");
      table.decimal("value", null);
      table.string("details", 256);
      table.string("processed_material").references("id").inTable("processes");
      table.integer("is_deleted").notNullable().defaultTo(0);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema.dropTable("profiles");
};

/*
    
*/

/*
.createTable("diff_operations", (table) => {
      table.string("id", 35).notNullable().primary();
      table.string("lot_id", 35).references("id").inTable("lots");
      table.string("diff_type", 1).checkIn(["+", "-"]);
      table.integer("operation_order").notNullable().checkPositive();
      table
        .string("operation_type_id")
        .references("id")
        .inTable("operation_types");
      table.decimal("value", null);
      table.string("processed_material").references("id").inTable("processes");
      table.integer("is_deleted").notNullable().defaultTo(0);
    })
    .createTable("diff_results", (table) => {
      table.string("id", 35).notNullable().primary();
      table.string("lot_id", 35).references("id").inTable("lots");
      table.string("test_method_id").references("id").inTable("test");
      table.decimal("value_diff", null);
      table.string("standard_lot_id").references("id").inTable("lots");
      table.integer("is_deleted").notNullable().defaultTo(0);
    })
    .createTable("test", (table) => {
      table.string("id", 35).notNullable().primary();
      table.string("lot_id", 35).references("id").inTable("lots");
      table.string("test_method_id").references("id").inTable("test");
      table.timestamp("test_date").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    });
*/
