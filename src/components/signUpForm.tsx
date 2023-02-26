import React, { FormEvent, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

type Props = {
  switchSignupLogin: () => void;
};

export const SignUpForm = ({ switchSignupLogin }: Props) => {
  const [buttonDisable, setButtonDisable] = useState(false);
  const supabaseClient = useSupabaseClient();
  return (
    <div>
      <button type="button" onClick={switchSignupLogin}>
        ログインはこちら
      </button>
      <h1>ユーザー登録</h1>
      <form
        method="post"
        onSubmit={async (event: React.SyntheticEvent) => {
          event.preventDefault();
          const target = event.target as typeof event.target & {
            userName: { value: string };
            tenantName: { value: string };
            email: { value: string };
            password: { value: string };
          };
          setButtonDisable(true);
          const result = await supabaseClient.auth.signUp({
            email: target.email.value,
            password: target.password.value,
            options: {
              data: {
                user_name: target.userName.value,
                tenant_name: target.tenantName.value,
              },
            },
          });
          setButtonDisable(false);
          if (!result.error) {
            switchSignupLogin();
            alert("メール送ったで");
          } else {
            alert(result.error.message);
          }
        }}
      >
        <div>
          <label htmlFor="tenantName">
            テナント名:
            <input id="tenantName" name="tenantName" type="text" />
          </label>
        </div>
        <div>
          <label htmlFor="userName">
            ユーザー名:
            <input id="userName" name="userName" type="text" />
          </label>
        </div>
        <div>
          <label htmlFor="email">
            メールアドレス:
            <input
              id="email"
              name="email"
              autoComplete="username"
              type="email"
            />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            パスワード:
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </label>
        </div>
        <input type="submit" disabled={buttonDisable} />
      </form>
    </div>
  );
};
