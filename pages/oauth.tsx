import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";

// TODO: This page needs some styling
export default function OAuth() {
  const [authError, setAuthError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_HOST);
    const redirectUrl = window.location.origin + `/oauth`;
    const params = new URL(window.location as unknown as URL).searchParams;
    const provider = JSON.parse(localStorage.getItem("provider"));

    if (provider.state !== params.get("state")) {
      setAuthError("Invalid authentication state. Please try again later");
      return;
    }

    pb.collection("users")
      .authWithOAuth2(
        provider.name,
        params.get("code"),
        provider.codeVerifier,
        redirectUrl
      )
      .then(() => {
        router.push(localStorage.getItem("returnTo") || "/");
      })
      .catch((err) => {
        console.error(err);
        setAuthError(`Failed to authenticate you with ${provider.name}`);
      });
  }, []);

  return <span>{authError === "" ? "Signing you in..." : authError}</span>;
}
