const crypto = require("crypto");
const uuid1 = crypto.randomUUID();
const uuid2 = crypto.randomUUID();

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("auth.users").del();

  //inserts seed entries
  await knex("auth.users").insert({
    id: uuid1,
    email: "nohohohoo@gmail.como",
    confirmed_at: new Date(),
    raw_user_meta_data: JSON.stringify({ name: "hoge" }),
  });
  await knex("tenants").insert({
    id: uuid2,
    tenant_name: "hoge",
    production_date: new Date(),
    standard_lot_number: "standard_lot_number",
    profile_id: uuid1,
    lot_objective: "lot_objective",
    details: "details",
  });
};
