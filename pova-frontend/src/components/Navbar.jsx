import React from "react";
import { Link } from "react-router-dom";

const primaryNavLinks = [
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
];

const secondaryNavLinks = [
  {
    title: "Search",
    path: "/search",
  },
  {
    title: "Edit",
    path: "/edit",
  },
  {
    title: "Contact",
    path: "/contact us",
  },
  {
    title: "En",
    path: "/en",
  }
]

export default function Navigation() {
  return (
    <div className="nav">
    <nav className="site-navigation">
      <span className="menu-title"></span>

      {/* Left section: First list of links */}
      <ul className="primaryNavLinks">
        { primaryNavLinks.map((link, index) => (
          <li key={index}>
            <Link to={link.path}>{link.title}</Link>
          </li>
        ))}
      </ul>

      {/* center section: logo */}
      <span className="logo-brand">POVA</span>

      {/* Right Section: Second list of links */}
      <ul className="secondaryNavLinks">
        { secondaryNavLinks.map((link, index) => (
          <li key={index}>
            <Link to={link.path}>{link.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
    </div>
  );
}
