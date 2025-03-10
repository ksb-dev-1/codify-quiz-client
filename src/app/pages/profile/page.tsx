import { Metadata } from "next";

// components
import Container from "@/components/shared/Container";
import Profile from "@/components/Profile";

export const metadata: Metadata = {
  title: "Profile",
  description: "User profile",
};

export default function ProfilePage() {
  return (
    <Container>
      <Profile />
    </Container>
  );
}
