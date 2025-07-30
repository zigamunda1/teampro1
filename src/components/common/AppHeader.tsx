import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/auth";
import { supabase } from "../../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

function AppHeader() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearUser();
      navigate("/sign-in");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="fixed z-10 w-full bg-amber-300 h-14 flex items-center justify-between px-6">
      <div className="flex items-center justify-center gap-2">
        <Link to="/" className="text-xl font-bold text-gray-800">
          뭐먹띠
        </Link>
      </div>
      
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-gray-700 hover:bg-gray-100"
            >
              로그아웃
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/sign-in">
              <Button variant="outline" size="sm">
                로그인
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button size="sm">
                회원가입
              </Button>
            </Link>
          </div>
        )}
        
        <Button variant="ghost" size="sm" className="p-1">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}

export default AppHeader; 