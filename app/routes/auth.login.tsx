import { Button } from "~/components/ui/button";

import { useLoaderData } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";

export async function loader() {
  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  };
}

export default function LoginPage() {
  const { env } = useLoaderData<typeof loader>();

  async function signInWithGitHub() {
    const supabase = createBrowserClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY,
    );
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });
  }

  return <Button onClick={signInWithGitHub}>Sign in with GitHub</Button>;
}
