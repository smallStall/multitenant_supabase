const crypto = require("crypto");
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
  //ユーザーログイン用の暗号化されたパスワードを取得
  const crypts = await knex.raw("SELECT crypt('password', gen_salt('bf', 4));");
  //https://github.com/supabase/supabase/discussions/9251
  await knex("auth.users").insert({
    id: crypto.randomUUID(),
    instance_id: "00000000-0000-0000-0000-000000000000",
    email: "nohoho@gmail.como",
    encrypted_password: crypts.rows[0].crypt,
    role: "authenticated",
    aud: "authenticated",
    email_confirmed_at: knex.fn.now(),
    confirmation_token: "",
    email_change: "",
    email_change_token_new: "",
    recovery_token: "",
    created_at: knex.fn.now(),
    updated_at: knex.fn.now(),
    raw_app_meta_data: JSON.stringify({
      provider: "email",
      providers: ["email"],
    }),

    raw_user_meta_data: JSON.stringify({
      user_name: "nohoho",
      tenant_name: "tenant_nohoho",
    }),
  });
  await knex("auth.users").insert({
    id: crypto.randomUUID(),
    email: "hogehoge@gmail.como",
    encrypted_password: crypts.rows[0].crypt,
    role: "authenticated",
    email_confirmed_at: knex.fn.now(),
    raw_user_meta_data: JSON.stringify({
      user_name: "hoge",
      tenant_name: "nohoho",
    }),
  });

  const nohoho = await knex("profiles")
    .select("*")
    .where({ user_name: "nohoho" });
  await knex("auth.users").insert({
    id: crypto.randomUUID(),
    email: "momomo@gmail.como",
    encrypted_password: crypts.rows[0].crypt,
    role: "authenticated",
    email_confirmed_at: knex.fn.now(),
    raw_user_meta_data: JSON.stringify({
      user_name: "momomo",
      tenant_id: nohoho[0].tenant_id,
    }),
  });

  const profs = await knex("profiles").select("*");

  for (let i = 0; i < profs.length; i++) {
    for (let j = 0; j < 2; j++) {
      await knex("todos").insert({
        tenant_id: profs[i].tenant_id,
        profile_id: profs[i].id,
        todo_name: profs[i].user_name + "さんのtodo" + i,
      });
    }
  }
};
