import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/auth";
import { supabase } from "../../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

function AppHeader() {
  //  Zustand에서 user, clearUser 꺼내오기
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();

  //  로그아웃 핸들러
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearUser();
      navigate("/sign-in");
    } catch (err: any) {
      console.error("로그아웃 실패:", err.message);
      alert("로그아웃 중 문제가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <header className="w-full h-20 p-4 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 shadow-lg border-b border-blue-200/20 flex items-center backdrop-blur-sm relative">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="flex-1"></div>
      <p className="text-white font-bold text-[28px] tracking-wider drop-shadow-lg relative z-10 title-font">
        YOUR MENU SELECTING PARTNER
      </p>
      <div className="flex-1 flex justify-end items-center gap-6">
        {user ? (
          <>
            <span className="text-white text-lg font-medium korean-text relative z-10">
              {user.email}님
            </span>
            <button
              onClick={handleLogout}
              className="text-white hover:text-blue-200 transition-all duration-300 font-semibold py-2 px-4 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-white/20 relative z-10"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            to="/sign-in"
            className="px-3 py-1 bg-blue-500 text-white rounded relative z-10"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

export default AppHeader;