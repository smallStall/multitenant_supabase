import type { NextPage } from "next";
import { SignUpForm } from "../components/signUpForm";
import { LoginForm } from "../components/loginForm";
import { useState } from "react";

interface Props {
  count: number;
}

const Home: NextPage<Props> = () => {
  const [isSignup, setIsSignup] = useState(false);
  const switchSignupLogin = () => setIsSignup((prev) => !prev);

  if (!isSignup) return <LoginForm switchSignupLogin={switchSignupLogin} />;
  return <SignUpForm switchSignupLogin={switchSignupLogin} />;
};

export default Home;
