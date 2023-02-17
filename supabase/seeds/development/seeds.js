const crypto = require("crypto");
const uuid1 = crypto.randomUUID();

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
    raw_user_meta_data: JSON.stringify({ name: "hoge" }),
  });
  await knex("lots").insert({
    id: uuid1,
    lot_number: "lot_number",
    project_id: uuid1,
    production_date: new Date(),
    standard_lot_number: "standard_lot_number",
    profile_id: uuid1,
    lot_objective: "lot_objective",
    details: "details",
  });
};
