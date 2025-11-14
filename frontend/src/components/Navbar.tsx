import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X, Sun, Moon, Home, Users, Info, User, LogOut } from "lucide-react";
import "../css/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(""); // ✅ הטאב הנבחר
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user, logout } = useAuth();

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>, name: string) => {
    event.stopPropagation();
    toggleDropdown(name);
    setActiveTab(name); // ✅ רק זה יסומן
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

  const handleLinkClick = (tabName: string) => {
    setActiveTab(tabName);
    setOpenDropdown(null);
    setMobileOpen(false);
  };


  const MenuItems = () => (
    <>
      {/* עמוד ראשי */}
      <li>
        <Link
          to="/"
          onClick={() => handleLinkClick("home")}
          className={`navBtn ${activeTab === "home" ? "navBtnActive" : ""}`}
        >
          <Home size={18} />
          עמוד ראשי
        </Link>
      </li>

      {/* תורמים */}
      <li className="dropdownWrapper">
        <button
          onClick={(event) => handleButtonClick(event, "donors")}
          className={`navBtn ${activeTab === "donors" ? "navBtnActive" : ""}`}
          aria-expanded={openDropdown === "donors"}
          aria-haspopup="menu"
        >
          <Users size={18} />
          תורמים ⌄
        </button>
        {(openDropdown === "donors" || mobileOpen &&( activeTab === 'ngos' || activeTab === 'campaigns')) && (
          <ul className={mobileOpen ? 'dropdown-mobile' : 'dropdown'} role={mobileOpen ? '' : 'menu'}>
            <li>
              <Link to="/ngos" className={`dropdownLink ${activeTab === "ngos" ? "dropdownLinkActive" : "dropdownLinkInActive"}`} onClick={() => handleLinkClick("ngos")}>
                רשימת עמותות
              </Link>
            </li>
            <li>
              <Link to="/campaigns" className={`dropdownLink ${activeTab === "campaigns" ? "dropdownLinkActive" : "dropdownLinkInActive"}`} onClick={() => handleLinkClick("campaigns")}>
                רשימת קמפיינים
              </Link>
            </li>
          </ul>
        )}
      </li>

      {/* אזור אישי / עמותות */}
      <li className="dropdownWrapper">
        {user ? (
          <Link
            to={user.role === "admin" ? "/admin/dashboard" : "/ngo/home"}
            onClick={() => handleLinkClick("personal")}
            className={`navBtn ${activeTab === "personal" ? "navBtnActive" : ""}`}
          >
            אזור אישי
          </Link>
        ) : (
          <>
            <button
              onClick={(event) => handleButtonClick(event, "ngo")}
              className={`navBtn ${activeTab === "ngo" ? "navBtnActive" : ""}`}
              aria-expanded={openDropdown === "ngo"}
              aria-haspopup="menu"
            >
              עמותות ⌄
            </button>
            {(openDropdown === "ngo" || mobileOpen && (activeTab === 'ngo-register' || activeTab === 'ngo-login')) && (
              <ul className={mobileOpen?'dropdown-mobile':'dropdown'} role="menu">
                <li>
                  <Link to="/registration/ngo" 
                  className={`dropdownLink ${activeTab === "ngo-register" ? "dropdownLinkActive" : "dropdownLinkInActive"}`}
                  onClick={() => handleLinkClick("ngo-register")}>
                    הרשמה
                  </Link>
                </li>
                <li>
                  <Link to="/login/ngo" 
                  className={`dropdownLink ${activeTab === "ngo-login" ? "dropdownLinkActive" : "dropdownLinkInActive"}`}
                  onClick={() => handleLinkClick("ngo-login")}>
                    התחברות
                  </Link>
                </li>
              </ul>
            )}
          </>
        )}
      </li>

      {/* עלינו */}
      <li className="dropdownWrapper">
        <button
          onClick={(event) => handleButtonClick(event, "about")}
          className={`navBtn ${activeTab === "about" ? "navBtnActive" : ""}`}
          aria-expanded={openDropdown === "about"}
          aria-haspopup="menu"
        >
          <Info size={18} />
          עלינו ⌄
        </button>
        {(openDropdown === "about" || mobileOpen && (activeTab === "about-main" || activeTab === "about-rules")) && (
          <ul className={mobileOpen ? 'dropdown-mobile' : "dropdown"} role="menu">
            <li>
              <Link to="/about" className={`dropdownLink ${activeTab === "about-main" ? "dropdownLinkActive" : "dropdownLinkInActive"}`} onClick={() => handleLinkClick("about-main")}>
                מי אנחנו
              </Link>
            </li>
            <li>
              <Link to="/about/rules" className={`dropdownLink ${activeTab === "about-rules" ? "dropdownLinkActive" : "dropdownLinkInActive"}`} onClick={() => handleLinkClick("about-rules")}>
                תקנון
              </Link>
            </li>
          </ul>
        )}
      </li>

      {/* צור קשר */}
      <li>
        <button
          onClick={() => {
            setShowContact(true);
            setActiveTab("contact");
          }}
          className={`navBtn ${activeTab === "contact" ? "navBtnActive" : ""}`}
        >
          צור קשר
        </button>
      </li>
    </>
  );

  // ---------- שאר הקומפוננטה (nav, drawer, contactModal) נשאר אותו דבר ----------
  return (
    <>
      <nav dir="rtl" className="navbar" data-theme={darkMode ? "dark" : "light"}>
        <ul className="menu desktopOnly">
          <MenuItems />
        </ul>

        <div className="rightCluster menu">
          {user && (
            <li className="dropdownWrapper">
              <button
                onClick={(event) => handleButtonClick(event, "user")}
                className="iconBtn"
                aria-expanded={openDropdown === "user"}
                aria-haspopup="menu"
              >
                <User size={26} />
              </button>
              {openDropdown === "user" && (
                <ul className="dropdown dropdownLink-logout" role="menu">
                  <li>
                    <Link
                      to="/"
                      className="dropdownLink"
                      onClick={() => {
                        logout();
                        navigate("/");
                        setActiveTab("home");
                      }}
                    >
                      <LogOut size={18} /> התנתקות
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="iconBtn"
            aria-label="החלפת מצב תצוגה"
            title="החלפת מצב תצוגה"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          <Link to="/" className="logoLink" style={{float:mobileOpen?'left':undefined}} aria-label="דף הבית" onClick={() => handleLinkClick("home")}>
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
    </>
  );
}
