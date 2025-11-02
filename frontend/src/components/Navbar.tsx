
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X, Sun, Moon, Home, Users, Info, User, LogOut } from "lucide-react";
import "../css/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuth();

  const handlBottonClick = (event: React.MouseEvent<HTMLButtonElement>, name: string) => {
    event.stopPropagation();
    toggleDropdown(name);
  };
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };
  const autoClose = () => {
    if (openDropdown !== null) toggleDropdown(openDropdown);
  };

  useEffect(() => {
    document.addEventListener("click", autoClose);
    return () => document.removeEventListener("click", autoClose);
  }, [openDropdown]);

  const isActive = (path: string | ((p: string) => boolean)) =>
    typeof path === "function" ? path(location.pathname) : location.pathname === path;

  const MenuItems = () => (
    <>
      <li>
        <Link
          to="/"
          className={`navBtn ${isActive("/") ? "navBtnActive" : ""}`}
        >
          <Home size={18} />
          עמוד ראשי
        </Link>
      </li>

      {/* תורמים */}
      <li className="dropdownWrapper">
        <button
          onClick={(event) => handlBottonClick(event, "donors")}
          className={`navBtn ${location.pathname.startsWith("/donors") ? "navBtnActive" : ""}`}
          aria-expanded={openDropdown === "donors"}
          aria-haspopup="menu"
        >
          <Users size={18} />
          תורמים ⌄
        </button>
        {openDropdown === "donors" && (
          <ul className="dropdown" role="menu">
            <li><Link to="/ngos" className="dropdownLink">רשימת עמותות</Link></li>
            <li><Link to="/campaigns" className="dropdownLink">רשימת קמפיינים</Link></li>
          </ul>
        )}
      </li>

      {/* עמותות */}
     <li className="dropdownWrapper">
  {user ? (
    <Link
      to={user.role === "admin" ? "/admin/dashboard" : "/ngo/home"}
      className={`navBtn ${
        location.pathname.startsWith("/ngo") || location.pathname.startsWith("/admin")
          ? "navBtnActive"
          : ""
      }`}
    >
      אזור אישי
    </Link>
  ) : (
    <>
      <button
        onClick={(event) => handlBottonClick(event, "ngo")}
        className={`navBtn ${
          location.pathname.startsWith("/ngo") ? "navBtnActive" : ""
        }`}
        aria-expanded={openDropdown === "ngo"}
        aria-haspopup="menu"
      >
        עמותות ⌄
      </button>
            {openDropdown === "ngo" && (
              <ul className="dropdown" role="menu">
                <li><Link to="/registration/ngo" className="dropdownLink">הרשמה</Link></li>
                <li><Link to="/login/ngo" className="dropdownLink">התחברות</Link></li>
              </ul>
            )}
          </>
        )}
      </li>

      {/* עלינו */}
      <li className="dropdownWrapper">
        <button
          onClick={(event) => handlBottonClick(event, "about")}
          className={`navBtn ${location.pathname.startsWith("/about") ? "navBtnActive" : ""}`}
          aria-expanded={openDropdown === "about"}
          aria-haspopup="menu"
        >
          <Info size={18} />
          עלינו ⌄
        </button>
        {openDropdown === "about" && (
          <ul className="dropdown" role="menu">
            <li><Link to="/about" className="dropdownLink">מי אנחנו</Link></li>
            <li><Link to="/about/rules" className="dropdownLink">תקנון</Link></li>
          </ul>
        )}
      </li>
    </>
  );

  return (
    <>
      <nav
        dir="rtl"
        className="navbar"
        data-theme={darkMode ? "dark" : "light"}
      >
        {/* תפריט דסקטופ */}
        <ul className="menu desktopOnly">
          <MenuItems />
        </ul>

        {/* צד ימין: אייקון משתמש + לוגו + מצב כהה + המבורגר */}
        <div className="rightCluster menu">
          {user && <li className="dropdownWrapper">
            <button
              onClick={(event) => handlBottonClick(event, "user")}
              className="iconBtn"
              aria-expanded={openDropdown === "user"}
              aria-haspopup="menu"
            >
              <User size={26} />
            </button>
            {openDropdown === "user" && (
              <ul className="dropdown" role="menu">
                <li><Link to="/" className="dropdownLink" onClick={() => { logout(); navigate("/"); }}><LogOut size={18} /> התנתקות</Link></li>

              </ul>
            )}
          </li>}


          

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="iconBtn"
            aria-label="החלפת מצב תצוגה"
            title="החלפת מצב תצוגה"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          
          <Link to="/" className="logoLink" aria-label="דף הבית">
            <img src="/longLogo.png" alt="לוגו" className="logo" />
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="iconBtn mobileOnly hamburgerBtn"
            aria-label="פתיחת תפריט"
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="iconBtn mobileOnly"
            aria-label="פתיחת תפריט"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button> */}
        </div>
      </nav>

      {/* תפריט מובייל */}
      {/* Mobile drawer (left) */}
      <aside
        id="mobile-drawer"
        className="drawer"
        data-open={mobileOpen ? "true" : "false"}
        data-theme={darkMode ? "dark" : "light"}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="drawerHeader">
          <span id="drawer-title" className="drawerTitle">תפריט</span>
          <button
            className="iconBtn drawerClose"
            aria-label="סגירת תפריט"
            onClick={() => setMobileOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <ul className="drawerList">
          <MenuItems />
        </ul>
      </aside>

      {/* Light scrim (click to close) */}
      <button
        type="button"
        className="scrim"
        data-open={mobileOpen ? "true" : "false"}
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
      />

      {/* <ul
        id="mobile-menu"
        className="mobileMenu"
        data-open={mobileOpen ? "true" : "false"}
        data-theme={darkMode ? "dark" : "light"}
      >
        <MenuItems />
      </ul> */}
    </>
  );
}
