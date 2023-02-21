const crypto = require("crypto");
const uuid1 = crypto.randomUUID();

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("todos").del();
  await knex("profiles").del();
  await knex("auth.users").del();
  await knex("tenants").del();
  //inserts seed entries
  await knex("auth.users").insert({
    id: uuid1,
    email: "nohohohoo@gmail.como",
    raw_user_meta_data: JSON.stringify({
      user_name: "hoge",
      tenant_name: "nohoho",
    }),
  });
  const profs = await knex("profiles").select("*");

  for (let i = 0; i < profs.length; i++) {
    await knex("todos").insert({
      tenant_id: profs[i].tenant_id,
      profile_id: profs[i].id,
      name: "123213",
    });
  }
};
