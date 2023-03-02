// pages/protected-page.js
import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { Database } from "@/types/supabase";
import { ProfilesTodos } from "@/types/table";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient<Database>(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  const user = await supabase.auth.getUser();
  if (!user) return;
  const { error: setTenantError } = await supabase.rpc("set_tenant_id", {
    tenant_id: user.data.user?.user_metadata.tenant_id,
  });
  if (setTenantError)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const { data } = await supabase
    .from("profiles")
    .select(`user_name, todos (todo_name)`);
  const name = await supabase
    .from("profiles")
    .select(`user_name`)
    .eq(`user_id`, user.data.user?.id)
    .single();

  if (!name.data)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  return {
    props: {
      userName: name.data.user_name,
      data: data,
    },
  };
};

export default function Protected({
  userName,
  data,
}: {
  userName: string;
  data: ProfilesTodos[] | null;
}) {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  return (
    <>
      <p>
        [<Link href="/">Home</Link>]
      </p>
      <p>ようこそ{userName}さん</p>
      {data ? (
        data.map((user, index) => {
          return (
            <div key={"div" + index}>
              <p
                key={"p" + index}
              >{`${user.user_name}さんのTodoは次の通りです`}</p>
              <ul key={"ul" + index}>
                {user.todos.map((todo) => {
                  return (
                    <li
                      key={"todo" + todo.id}
                    >{`タイトル:${todo.todo_name}`}</li>
                  );
                })}
              </ul>
            </div>
          );
        })
      ) : (
        <p>なんも返ってきませんでした</p>
      )}
      <button
        onClick={async () => {
          await supabaseClient.auth.signOut();
          router.push("/");
        }}
      >
        Logout
      </button>
    </>
  );
}
