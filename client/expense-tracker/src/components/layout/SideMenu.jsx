import React, { useContext } from 'react';
import { SIDE_MENU_DATA } from '../../utils/data';
import { UserContext } from '../../context/userContext';
import { useNavigate, useLocation } from 'react-router-dom';
import CharAvatar from '../cards/CharAvatar';

const SideMenu = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation(); // 🔥 Get current route

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login"); // fixed typo: was `navigaate`
  };

  return (
    <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20'>
      {/* Profile Section */}
      <div className='flex flex-col items-center justify-center gap-3 mt-3 mb-7'>
        {user?.profileImageUrl ? (
          <img
            src={encodeURI(user.profileImageUrl)}
            alt="Profile"
            className='w-20 h-20 rounded-full object-cover border border-gray-300'
          />
        ) : (
          <CharAvatar
            fullName={user?.fullName}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        )}
        <h5 className='text-gray-950 font-medium leading-6'>
          {user?.fullName || ""}
        </h5>
      </div>

      {/* Menu Items */}
      {SIDE_MENU_DATA.map((item, index) => {
        const isActive = location.pathname.includes(item.path); // ✅ match partial path
        return (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] ${
              isActive ? "text-white bg-primary" : "text-gray-700"
            } py-3 px-6 rounded-lg mb-3 hover:bg-primary hover:text-white transition-all duration-200`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default SideMenu;
