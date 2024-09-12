import React from "react";
import { Link } from "react-router-dom";
const navLinks = [
  {
    title: "Homepage",
    path: "/",
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Categories",
    path: "/categories",
  },
  {
    title: "Pages",
    path: "/pages",
  },
  {
    title: "Contact",
    path: "/contact us",
  },
];

export default function Navigation() {
  return (
    <nav className="site-navigation">
      <span>POVA</span>
      <ul>
        {navLinks.map((link, index) => (
          <li key={index}>
            <Link to={link.path}>{link.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
