import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
type Props = {
  switchSignupLogin: () => void;
};

export const LoginForm = ({ switchSignupLogin }: Props) => {
  const [buttonDisable, setButtonDisable] = useState(false);
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(async () => {
      const user = await supabaseClient.auth.getUser();
      if (!user) return;
      const tenantId = await supabaseClient
        .from("profiles")
        .select("tenant_id")
        .eq("user_id", user.data.user?.id)
        .single();
      const { error } = await supabaseClient.rpc("set_tenant_id", {
        tenant_id: tenantId,
      });
      router.push("protected");
    });
  }, []);
  return (
    <div>
      <button type="button" onClick={switchSignupLogin}>
        新規登録はこちら
      </button>
      <h1>ログイン</h1>
      <form
        method="post"
        onSubmit={async (event: React.SyntheticEvent) => {
          event.preventDefault();
          const target = event.target as typeof event.target & {
            email: { value: string };
            password: { value: string };
          };
          supabaseClient.auth.signInWithPassword({
            email: target.email.value,
            password: target.password.value,
          });
        }}>
        <div>
          <label htmlFor="email">
            メールアドレス:
            <input id="email" name="email" autoComplete="username" type="email" />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            パスワード:
            <input id="password" type="password" name="password" autoComplete="current-password" />
          </label>
        </div>
        <input type="submit" disabled={buttonDisable} />
      </form>
    </div>
  );
};
