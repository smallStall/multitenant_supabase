/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const basicDefault = (table) => {
  table.boolean("is_deleted").notNullable().defaultTo(false);
  table.timestamps(true, true);
};

const tenantSecurityPolicy = (tableName, isTenantsTable) => `
CREATE POLICY tenant_policy_${tableName} ON ${tableName}
USING (${
  isTenantsTable ? "id" : "tenant_id"
} = current_setting('app.tenant')::uuid)
`;

const enableRLS = (tableName) => `
ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY
`;

const enableTenantRLS = (tableName, knex, isTenantsTable) => {
  return new Promise((resolve) => {
    knex.raw(tenantSecurityPolicy(tableName, isTenantsTable)).then(() => {
      knex.raw(enableRLS(tableName)).then(() => {
        resolve();
      });
    });
  });
};

exports.up = function (knex) {
  return knex.schema
    .createTable("tenants", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("tenant_name", 40).notNullable();
      table.uuid("customer_id");
      basicDefault(table, knex);
    })
    .createTable("profiles", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table
        .uuid("user_id")
        .notNullable()
        .references("id")
        .inTable("auth.users");
      table.string("user_name", 18).notNullable();
      table
        .enu("role", ["manager", "general", "beginer"])
        .notNullable()
        .defaultTo("beginer");
      table.uuid("tenant_id").notNullable().references("id").inTable("tenants");
      basicDefault(table, knex);
    })
    .createTable("todos", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("todo_name", 24).notNullable();
      table.boolean("is_done").notNullable().defaultTo(false);
      table
        .uuid("profile_id")
        .notNullable()
        .references("id")
        .inTable("profiles");
      table.uuid("tenant_id").notNullable().references("id").inTable("tenants");
      basicDefault(table, knex);
    })
    .then(() => enableTenantRLS("tenants", knex, true))
    .then(() => enableTenantRLS("profiles", knex))
    .then(() => enableTenantRLS("todos", knex));
};

const tenantDefault = (table, knex) => {
  table.uuid("tenant_id").references("id").inTable("tenants");
  table.uuid("profile_id").references("id").inTable("profiles");
  basicDefault(table, knex);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema
    .dropTable("todos")
    .dropTable("profiles")
    .dropTable("tenants");
};

/*
exports.down = function (knex) {
  return knex.schema
    .dropTable("operations")
    .dropTable("operation_types")
    .dropTable("processes")
    .dropTable("lots")
    .dropTable("projects")
    .dropTable("profiles");
};
*/

/*
    .createTable("projects", (table) => {
      table.uuid("id").primary();
      table.string("project_name", 50).notNullable().unique();
      table.string("project_objective", 256);
      table.string("background", 512);
      table.uuid("tenant_id").references("id").inTable("tenants");
      basicDefault(table, knex);
    })
.createTable("lots", (table) => {
      table.uuid("id").primary();
      table.string("lot_number", 32).notNullable().unique();
      table.uuid("project_id", 35).references("id").inTable("projects");
      table
        .timestamp("production_date")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.string("standard_lot_number");
      table.string("lot_objective", 256);
      table.string("details", 256);
      tenantDefault(table, knex);
    })
    .createTable("processes", (table) => {
      table.uuid("id").primary();
      table.uuid("lot_id").references("id").inTable("lots");
      table.integer("process_order").notNullable().checkPositive();
      table.string("process_name", 24);
      table.string("container", 24);
      tenantDefault(table, knex);
    })
    .createTable("operation_types", (table) => {
      table.uuid("id").primary();
      table.string("operation_type_name", 12).notNullable().unique();
      table.string("details", 256);
      tenantDefault(table, knex);
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
      tenantDefault(table, knex);
    });    
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

/*
CREATE POLICY tenant_policy ON banks
  FOR ALL -- CRUD 全てに適用
  TO app  -- アプリケーションがDBに接続するときのユーザ(=ロール)が`app`
  USING(tenant_id IN (
    SELECT tenant_id
    FROM teams
    WHERE teams.user_id = current_setting('app.userID') AND teams.id = current_setting('app.teamsId')
  ));
基本は teamsに所属していて、かつtenantも同じものを取得する
管理ユーザーは自動的に全teamsに管理権限で入れるようにテーブルにトリガーを仕掛ける
*/

/*
https://stackoverflow.com/questions/36728899/knex-js-auto-update-trigger
*/
