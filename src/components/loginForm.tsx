import React from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
type Props = {
  switchSignupLogin: () => void;
};

export const LoginForm = ({ switchSignupLogin }: Props) => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    if (session) {
      router.push("protected");
    }
  });
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
        <input type="submit" />
      </form>
    </div>
  );
};
