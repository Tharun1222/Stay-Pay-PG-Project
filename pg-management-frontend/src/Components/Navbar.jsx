import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, House } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = !!sessionStorage.getItem("adminToken");

  const links = [
    ["/", "Home"],
    ["/nearby", "Nearby PG"],
    ["/facilities", "Facilities"],
    ["/rooms", "Rooms"],
    ["/enquiry", "Enquiry"],
    ["/food-trial", "Food Trial"]
  ];

  const close = () => setOpen(false);

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
    close();
    navigate("/admin-login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={close}>
        <House size={25} />
        Stay  &<span className="brand-highlight">Pay</span>
      </Link>

      <button
        className="mobile-menu"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>

      <nav className={`nav-links ${open ? "open" : ""}`}>
        {links.map(([path, name]) => (
          <NavLink
            key={path}
            to={path}
            onClick={close}
            end={path === "/"}
          >
            {name}
          </NavLink>
        ))}

        {isAdmin ? (
          <>
            <NavLink to="/admin-dashboard" onClick={close}>
              Dashboard
            </NavLink>
            <button className="admin-link" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/admin-login"
            className="admin-link"
            onClick={close}
          >
            Admin Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}