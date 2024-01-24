import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

function AuthError() {
  return (
    <div>
      <h1>Auth Error</h1>

      <Button asChild>
        <Link to="/auth/login">Sign in again</Link>
      </Button>
    </div>
  );
}

export default AuthError;
