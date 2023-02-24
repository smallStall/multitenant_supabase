const crypto = require("crypto");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const makeMockUser = (index) => {};

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("todos").del();
  await knex("profiles").del();
  await knex("auth.users").del();
  await knex("tenants").del();
  //inserts seed entries
  await knex("auth.users").insert({
    id: crypto.randomUUID(),
    email: "nohoho@gmail.como",
    raw_user_meta_data: JSON.stringify({
      user_name: "nohoho",
      tenant_name: "tenant_nohoho",
    }),
  });
  await knex("auth.users").insert({
    id: crypto.randomUUID(),
    email: "arururu@gmail.como",
    raw_user_meta_data: JSON.stringify({
      user_name: "aruru",
      tenant_name: "tenant_nohoho",
    }),
  });
  await knex("auth.users").insert({
    id: crypto.randomUUID(),
    email: "hogehoge@gmail.como",
    raw_user_meta_data: JSON.stringify({
      user_name: "hoge",
      tenant_name: "nohoho",
    }),
  });

  const profs = await knex("profiles").select("*");

  for (let i = 0; i < profs.length; i++) {
    for (let j = 0; j < 2; j++) {
      await knex("todos").insert({
        tenant_id: profs[i].tenant_id,
        profile_id: profs[i].id,
        todo_name: j,
      });
    }
  }
};
