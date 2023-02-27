// pages/protected-page.js
import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Todos } from "@/types/table";
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
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

  const { data, error } = await supabase
    .from("profiles")
    .select(`user_name, todos (todo_name)`);
  console.error(error);
  return {
    props: {
      initialSession: session,
      user: session.user,
      data: data,
    },
  };
};

export default function Protected({
  user,
  data,
}: {
  user: User;
  data: UserTodo[] | null;
}) {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  return (
    <>
      <p>
        [<Link href="/">Home</Link>]
      </p>
      <p>ようこそ{user.user_metadata.name}さん</p>
      {data ? (
        data.map((user, index) => {
          return (
            <div key={"div" + index}>
              <p key={"p" + index}>{`${user.user_name}さんのtodo`}</p>
              <ul key={"ul" + index}>
                {user.todos.map((todo: Todos) => {
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
