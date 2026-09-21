import React from 'react'
import { FaSquarePlus } from 'react-icons/fa6'
import { FaListAlt, FaBoxOpen } from 'react-icons/fa'
import { MdFactCheck } from 'react-icons/md'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BiLogOut } from 'react-icons/bi'

const Sidebar = () => {
  const navigate = useNavigate()

  const navItems = [
    { path: "/admin", label: "Add Item", icon: <FaSquarePlus /> },
    { path: "/admin/added-items", label: "Added Items", icon: <FaBoxOpen /> },
    { path: "/admin/orders", label: "Orders", icon: <MdFactCheck /> },
  ]

  return (
    <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row">
      <div className="max-sm:flexCenter max-xs:pb-3 bg-white pb-3 m-2 sm:min-w-[20%] sm:min-h-[97vh] rounded-xl">
        <div className="flex flex-col gap-y-6 max-sm:items-center sm:flex-col pt-4 sm:pt-14">
          
          {/* Logo */}
          <Link 
            to={'/admin'}
            className="bold-20 md:bold-24 uppercase font-paci lg:pl-[15%]"
          >
            My Ts <span className="text-secondary bold-28">.</span>
          </Link>

          {/* Nav Links */}
          <div className="flex flex-col gap-4 mt-6">
            {navItems.map((link) => (
              <NavLink 
                to={link.path} 
                key={link.label}
                end={link.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-md 
                  ${isActive ? "bg-secondary text-white" : "hover:bg-gray-100"}`
                }
              >
                {link.icon}
                <div className='hidden sm:flex'>{link.label}</div>
              </NavLink>
            ))}
          </div>

          {/* Logout */}
          <div className="mt-auto">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded-md"
            >
              <BiLogOut className="text-lg" />
              <span className="hidden sm:flex">Logout</span>
            </button>
          </div>

        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default Sidebar
