import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { setShowSearch, getCartCount, token, setToken, setCartItems } =
    useContext(ShopContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setShowUserMenu(false);
  };

  const handleSearchClick = () => {
    navigate("/collection");
    setShowSearch(true);
  };

  return (
    <div className="w-full flex items-center justify-between py-4 px-4 sm:px-8 font-medium relative border-b border-gray-200">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 sm:w-36" />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex gap-6 text-sm text-gray-700">
        {["/", "/collection", "/about", "/contact"].map((path, index) => (
          <NavLink
            key={index}
            to={path}
            className="flex flex-col items-center gap-1"
          >
            <p>{path === "/" ? "HOME" : path.replace("/", "").toUpperCase()}</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        ))}
      </ul>

      {/* Right Side */}
      <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
        {/* Admin Panel Button - shown only in desktop */}
        <a
          href="https://forever-admin-alpha-snowy.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-block"
        >
         <button
  className="text-sm md:text-base text-gray-600 border border-gray-300 rounded-full px-3 md:px-6 py-1.5 transition duration-200 hover:bg-gray-100 whitespace-nowra"
>
  Admin Panel
</button>

        </a>

        {/* Search Icon */}
        <img
          onClick={handleSearchClick}
          src={assets.search_icon}
          alt="Search"
          className="w-5 cursor-pointer"
        />

        {/* Profile */}
        <div className="relative">
          <img
            onClick={() =>
              token ? setShowUserMenu(!showUserMenu) : navigate("/login")
            }
            src={assets.profile_icon}
            alt="Profile"
            className="w-5 cursor-pointer"
          />
          {token && showUserMenu && (
            <div className="absolute right-0 top-8 z-10">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
                <p onClick={() => setShowUserMenu(false)} className="cursor-pointer hover:text-black">
                  My Profile
                </p>
                <p
                  onClick={() => {
                    navigate("/orders");
                    setShowUserMenu(false);
                  }}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} alt="Cart" className="w-5 min-w-5" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer lg:hidden"
          alt="Menu"
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 left-0 z-50 bg-white transition-all duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        } transform`}
      >
        <div className="flex flex-col text-gray-700 h-full">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 p-4 cursor-pointer border-b border-gray-200"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="Back" />
            <p className="text-sm">Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-200 hover:bg-gray-100 transition" to="/">HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-200 hover:bg-gray-100 transition" to="/collection">COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-200 hover:bg-gray-100 transition" to="/about">ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-200 hover:bg-gray-100 transition" to="/contact">CONTACT</NavLink>
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;
