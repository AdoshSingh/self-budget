"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

const SigninForm = () => {
  return (
    <div>
      <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
        Signin with google
      </Button>
    </div>
  );
};

export default SigninForm;
