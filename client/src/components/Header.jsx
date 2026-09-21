import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { FaSearch, FaShoppingBasket } from "react-icons/fa";
import { FaBars, FaBarsStaggered } from "react-icons/fa6";
import { RiUserLine } from "react-icons/ri";
import userImg from "../assets/user.png";
import { ShopContext } from "../context/ShopContext";

const Header = () => {
  const { user, setUser, navigate,searchQuery, 
    setSearchQuery, setShowUserLogin, getCartCount, logoutUser } = useContext(ShopContext);
  const [menuOpened, setMenuOpened] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  const isHomepage = location.pathname === "/";
  const isCollectionPage = location.pathname.endsWith("/collection");

  const toggleMenu = () => setMenuOpened((prev) => !prev);

  useEffect(()=>{
    if(searchQuery.length > 0 && !isCollectionPage){
      navigate('/collection')
    }
  }, [searchQuery])

  return (
    <header
      className={`${
        !isHomepage ? "bg-white/95 backdrop-blur-sm border-b border-gray-100" : ""
      } absolute top-0 left-0 right-0 max-padd-container flexBetween py-4 z-30`}
    >
      {/* Logo */}
      <Link to={"/"} className="flex flex-col leading-none font-serif tracking-widest">
        <span className="text-[24px] font-bold uppercase text-secondary tracking-[6px]">AVAIA</span>
        <span className="text-[8px] tracking-[5px] text-gold uppercase">Luxury Candles</span>
      </Link>

      {/* Navbar */}
      <Navbar
        setMenuOpened={setMenuOpened}
        containerstyles={`${
          menuOpened
            ? "flex items-start flex-col gap-y-8 fixed top-16 right-6 p-5 bg-white shadow-md w-52 ring-1 ring-slate-900/5 z-50"
            : "hidden lg:flex gap-x-5 xl:gap-x-8 md:p-1.5"
        }`}
      />

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden xl:flex">
          <div
            className={`${
              showSearch
                ? "flex rounded-full bg-white w-[333px] p-3.5 pl-6"
                : "hidden"
            } ${!isHomepage ? "bg-primary" : ""}`}
          >
            <input
              onChange={(e)=>setSearchQuery(e.target.value)}
              type="text"
              placeholder="Type here..."
              className="bg-transparent w-full outline-none text-[14px]"
            />
          </div>
          <div
            onClick={() => setShowSearch((prev) => !prev)}
            className={`cursor-pointer bg-tertiary text-white rounded-full p-2 text-sm ${
              showSearch ? "absolute top-0 right-0" : ""
            }`}
          >
            <FaSearch className="text-xl" />
          </div>
        </div>

        {/* Menu Toggle */}
        <>
          {menuOpened ? (
            <FaBarsStaggered
              onClick={toggleMenu}
              className="lg:hidden cursor-pointer text-xl"
            />
          ) : (
            <FaBars
              onClick={toggleMenu}
              className="lg:hidden cursor-pointer text-xl"
            />
          )}
        </>

        {/* Cart */}
        <div
          onClick={() => navigate("/cart")}
          className="flex gap-2 items-center cursor-pointer p-2 rounded-full bg-white relative"
        >
          <FaShoppingBasket size={27} />
          <label className="absolute bottom-8 -right-2 text-xs font-bold">
            {getCartCount()}
          </label>
        </div>

        {/* User Profile */}
        <div className="group relative">
          {user ? (
            <div className="flex gap-2 items-center cursor-pointer rounded-full bg-white p-1.5">
              <img src={userImg} alt="user" height={44} width={44} />
            </div>
          ) : (
            <button onClick={()=>setShowUserLogin(true)} className="btn-dark flexCenter gap-x-2 rounded-full px-4 py-2">
              Login
              <RiUserLine className="text-xl" />
            </button>
          )}

          {/* Dropdown */}
          {user && (
            <ul className="bg-white p-2 w-32 ring-1 ring-slate-900/5 rounded absolute right-0 top-12 hidden group-hover:flex flex-col medium-14 shadow-md z-10">
              <li
                onClick={() => navigate("/my-orders")}
                className="p-2 text-tertiary rounded-md hover:bg-primary cursor-pointer"
              >
                Orders
              </li>
              <li onClick={logoutUser} className="p-2 text-tertiary rounded-md hover:bg-primary cursor-pointer">
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
