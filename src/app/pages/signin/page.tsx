"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Actions
import { googleSigninAction, githubSigninAction } from "@/actions/signInAction";

// Components
import Container from "@/components/shared/Container";
import GoogleSignInButton from "@/components/GoogleSigninButton";
import GitHubSignInButton from "@/components/GithubSigninButton";

// 3rd party
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <div className="h-full flex flex-col items-center justify-center">
        <div className="max-w-xl w-full flex flex-col p-8 border rounded-custom">
          <h1 className="text-2xl font-bold mb-8">Sign in to Codify</h1>
          <div className="w-full grid gap-4">{children}</div>
        </div>
      </div>
    </Container>
  );
}

export default function SigninPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && userId) router.push("/pages/questions?page=1");
  }, [status, userId, router]);

  if (status === "loading") {
    return (
      <Container>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="animate-spin w-10 h-10" />
        </div>
      </Container>
    );
  }

  return (
    <Wrapper>
      <form action={googleSigninAction}>
        <GoogleSignInButton />
      </form>
      <form action={githubSigninAction}>
        <GitHubSignInButton />
      </form>
    </Wrapper>
  );
}
