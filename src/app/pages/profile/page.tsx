import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

// components
import Container from "@/components/shared/Container";
import Profile from "@/components/Profile";

export const metadata: Metadata = {
  title: "Profile",
  description: "User profile",
};

export default async function ProfilePage() {
  // Fetch the session and extract the user ID
  const session = await auth();
  let id, name, email, image;

  if (session?.user) {
    id = session.user.id || "";
    name = session.user.name || "";
    email = session.user.email || "";
    image = session.user.image || "";
  }

  if (!id) redirect("/pages/signin");

  return (
    <Container>
      <Profile userId={id} name={name} email={email} image={image} />
    </Container>
  );
}
