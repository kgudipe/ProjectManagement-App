import React from "react";
import { Authenticator, Heading, Text, useAuthenticator, View } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import Aurora from "@/components/reactbits/Aurora";
import GradientText from "@/components/reactbits/GradientText";
import ShinyText from "@/components/reactbits/ShinyText";

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

const authComponents = {
  Header() {
    const { route } = useAuthenticator((context) => [context.route]);
    const isSignUp = route === "signUp";

    return (
      <View className="px-8 pb-2 pt-8">
        <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-primary text-sm font-black text-white shadow-lg shadow-blue-500/20">
          LI
        </div>
        <Heading level={3} className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
          {isSignUp ? "Create your workspace" : "Welcome back"}
        </Heading>
        <Text className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {isSignUp
            ? "Start managing projects, timelines, priorities, and team work in one place."
            : "Sign in to review project health, task flow, and team execution."}
        </Text>
      </View>
    );
  },
};

const AuthShell = ({ children }: { children: React.ReactNode }) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === "authenticated") {
    return <>{children}</>;
  }

  return (
    <div className="auth-page min-h-screen bg-surface-muted p-4 text-gray-950 dark:bg-dark-bg dark:text-white sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl shadow-gray-200/70 dark:border-stroke-dark dark:bg-dark-secondary dark:shadow-black/30 sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="auth-visual relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Aurora />
          <div className="relative z-10">
            <div className="animate-fade-up inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-100">
              <span className="h-2 w-2 rounded-full bg-accent-teal shadow-[0_0_12px_2px_rgba(20,184,166,0.8)]" />
              <ShinyText text="Project command center" />
            </div>
            <h1
              className="animate-fade-up mt-8 max-w-xl text-5xl font-black leading-tight tracking-tight"
              style={{ animationDelay: "0.1s" }}
            >
              <GradientText>Plan work, move priorities, and keep teams aligned.</GradientText>
            </h1>
            <p
              className="animate-fade-up mt-5 max-w-lg text-base leading-7 text-blue-100/90"
              style={{ animationDelay: "0.2s" }}
            >
              A focused workspace for boards, timelines, priorities, search, teams, and project delivery.
            </p>
          </div>
          <div className="relative z-10 grid gap-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["24", "Active tasks"],
                ["8", "Projects"],
                ["5", "Teams"],
              ].map(([value, label], i) => (
                <div
                  key={label}
                  className="animate-fade-up rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur transition-colors duration-300 hover:border-white/30 hover:bg-white/15"
                  style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                >
                  <div className="text-2xl font-black">{value}</div>
                  <div className="mt-1 text-xs text-blue-100/80">{label}</div>
                </div>
              ))}
            </div>
            <div
              className="animate-fade-up rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur"
              style={{ animationDelay: "0.55s" }}
            >
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-semibold">Sprint readiness</span>
                <span className="text-blue-100/80">82%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[82%] rounded-full bg-accent-teal" />
              </div>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center bg-white p-4 dark:bg-dark-secondary sm:p-8">
          <div className="auth-card-enter w-full max-w-md">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-primary text-sm font-black text-white">
                LI
              </div>
              <div>
                <div className="text-lg font-black tracking-tight">LIST</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Project workspace</div>
              </div>
            </div>
            <Authenticator formFields={formFields} components={authComponents} />
          </div>
        </section>
      </div>
    </div>
  );
};

const AuthProvider=({children}: { children: React.ReactNode })=>{
    return(
        <Authenticator.Provider>
          <AuthShell>{children}</AuthShell>
        </Authenticator.Provider>
    )
}

export default AuthProvider;
