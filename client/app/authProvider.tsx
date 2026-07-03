import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
    },
  },
});

const formFields = {
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: "Enter your email address",
      label: "Email",
      type: "email",
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: "Enter your password",
      label: "Password",
      type: "password",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      type: "password",
      isRequired: true,
    },
  },
};


const AuthProvider=({children}: { children: React.ReactNode })=>{
    return(
        <div className="min-h-screen">
      <Authenticator formFields={formFields}>
        {({ user }: { user?: unknown }) =>
          user ? (
            <div>{children}</div>
          ) : (
            <div className="flex min-h-screen items-center justify-center bg-surface-muted p-6 text-gray-950 dark:bg-dark-bg dark:text-white">
              <div className="surface-card animated-surface max-w-md p-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Sign in to LIST</h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Access your projects, tasks, teams, and timelines.</p>
              </div>
            </div>
          )
        }
      </Authenticator>
    </div>
    )
}

export default AuthProvider;
