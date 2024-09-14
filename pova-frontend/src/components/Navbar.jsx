import React, {useState} from "react";
import { Link } from "react-router-dom";
import { SearchOutline } from "react-ionicons";

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
  const [searchOpen, setSearchOpen] = useState(false)

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

        {/* Search icon */}
        <SearchOutline
          height="20px"
          width="20px"
          style={{ cursor: "pointer" }}
          onClick={() => setSearchOpen(!searchOpen)} />

      {/* Right Section: Second list of links */}
      <ul className="secondaryNavLinks">
        { secondaryNavLinks.map((link, index) => (
          <li key={index}>
            <Link to={link.path}>{link.title}</Link>
          </li>
        ))}
      </ul>
    </nav>

    {/* Conditionally render the search bar if is true */}
    {searchOpen && (
      <div className="search-bar">
        <input
        type="text"
        placeholder="Search.."
        className="search-input"
        style={{ marginTop: "10px", padding: "5px", width: "200px" }}
        />
        </div>
    )}
    </div>
  );
}
