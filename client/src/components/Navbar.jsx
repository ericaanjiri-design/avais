import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = ({ containerstyles, setMenuOpened }) => {
  const navLinks = [
    { path: '/', title: 'Home' },
    { path: '/collection', title: 'Collection' },
    { path: '/testimonial', title: 'Our Story' },
    { path: '/contact', title: 'Contact' },
  ]

  return (
    <nav className={containerstyles}>
      {navLinks.map((link) => (
        <NavLink
          key={link.title}
          to={link.path}
          onClick={() => setMenuOpened(false)}
          className={({ isActive }) =>
            `${isActive ? "active-link" : ""} px-3 py-2 uppercase text-xs font-semibold tracking-[2px] hover:text-secondary transition-colors duration-200`
          }
        >
          {link.title}
        </NavLink>
      ))}
    </nav>
  )
}

export default Navbar
