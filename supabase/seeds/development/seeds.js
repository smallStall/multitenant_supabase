const crypto = require("crypto");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const makeAuthUser = async (name, knex, tenant_id) => {
  //ユーザーログイン用の暗号化されたパスワードを取得
  const crypts = await knex.raw(
    "SELECT crypt('pass!12word', gen_salt('bf', 4));"
  );
  //https://github.com/supabase/supabase/discussions/9251
  await knex("auth.users").insert({
    id: crypto.randomUUID(),
    instance_id: "00000000-0000-0000-0000-000000000000",
    email: name + "@mail.como",
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
      user_name: name,
      tenant_name: "tenant_" + name,
      tenant_id: tenant_id,
    }),
  });
};

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("todos").del();
  await knex("profiles").del();
  await knex("auth.users").del();
  await knex("tenants").del();
  await makeAuthUser("nohoho", knex);
  await makeAuthUser("hogehoge", knex);
  const nohoho = await knex("profiles")
    .select("*")
    .where({ user_name: "nohoho" });
  await makeAuthUser("momomo", knex, nohoho[0].tenant_id); //momomoはnohohoと同じテナント
  const profs = await knex("profiles").select("*");

  for (let i = 0; i < profs.length; i++) {
    await knex("todos").insert({
      tenant_id: profs[i].tenant_id,
      profile_id: profs[i].id,
      todo_name: profs[i].user_name + "さんのtodo",
    });
  }
};
