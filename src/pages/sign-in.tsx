import AppHeader from "../components/common/AppHeader";
import SignIn from "../auth/sign-in";
import companyLogo from "../assets/logo.png";

function SignInPage() {
  return (
    <div>
      <AppHeader />
      <div className="container">
        <div className="w-full flex flex-col items-center justify-start sm:p-6 sm:gap-6">
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-2">
              지금 진짜 배고픈데...
            </h4>
            <div className="flex flex-col items-center justify-center">
              <img src={companyLogo} alt="logo" className="w-25 h-25" />
            </div>
          </div>
          <SignIn />
        </div>
      </div>
    </div>
  );
}

export default SignInPage;