const crypto = require("crypto");
const userUuid = crypto.randomUUID();

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("auth.users").del();
  await knex("profiles").del();
  await knex("auth.users").insert({
    id: userUuid,
    email: "jun.ohbayashi@arsaga.jp",
    raw_user_meta_data: JSON.stringify({ name: "hoge" }),
  });
  //await knex("profiles").insert({ id: uuid1, name: "hoge" });
};
