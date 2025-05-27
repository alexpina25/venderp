import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center">
      <SignIn path="/auth/sign-in" routing="path" />
    </div>
  );
}