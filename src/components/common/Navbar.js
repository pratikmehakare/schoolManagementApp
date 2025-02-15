import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("user from navbar", user);
  }, [user]);

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (
      words[0].charAt(0).toUpperCase() +
      words[words.length - 1].charAt(0).toUpperCase()
    );
  };

  const getButtonConfig = () => {
    if (location.pathname === "/") {
      return { text: "Register", path: "/register" };
    }
    if (location.pathname === "/register") {
      return { text: "Login", path: "/login" };
    }
    return null;
  };

  const buttonConfig = getButtonConfig();

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex gap-2 items-center">
            <img
              src="/icon 1.png" 
              alt="Logo"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold">School of Cuvette</span>
          </div>

          <div className="flex items-center">
            {user?.name ? (
              <div className="flex items-center space-x-3">
                {/* Circle with user's initials */}
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {getInitials(user.name)}
                  </span>
                </div>
                <span className="text-sm">{user.name}</span>
              </div>
            ) : (
              buttonConfig && (
                <div className="ml-3">
                  <button
                    onClick={() => navigate(buttonConfig.path)}
                    className="text-sm text-white hover:underline"
                  >
                    {buttonConfig.text}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
