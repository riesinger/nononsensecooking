import { Outlet } from "@remix-run/react";

function AuthLayout() {
  return (
    <div>
      <h1>Auth Layout</h1>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
