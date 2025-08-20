import AppHeader from "@/components/common/AppHeader";
import SignIN from "@/auth/sign-in";

function SignInPage1() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader />
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <SignIN />
        </div>
      </div>
    </div>
  );
}

export default SignInPage1;