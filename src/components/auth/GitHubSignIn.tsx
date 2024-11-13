import { Button } from "../ui/button";
import { Github } from "lucide-react";
import { signin } from "@/lib/social/client";

export const GitHubSignIn = () => {
  return (
    <Button className="w-full" onClick={signin}>
      <span>
        <Github />
      </span>
      Sign in with GitHub
    </Button>
  );
};
