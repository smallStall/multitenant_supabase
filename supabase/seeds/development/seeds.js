const crypto = require("crypto");
const uuid1 = crypto.randomUUID();

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("auth.users").del();
  await knex("auth.users").insert({
    id: uuid1,
    raw_user_meta_data: JSON.stringify({ name: "hoge" }),
  });
  //await knex("profiles").insert({ id: uuid1, name: "hoge" });
};
