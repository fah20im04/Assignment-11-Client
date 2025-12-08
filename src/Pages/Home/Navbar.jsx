import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../Contexts/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { user, logOut } = useContext(AuthContext);

  const handleLogout = () => {
    logOut();
    setProfileDropdownOpen(false);
  };

  return (
    <nav className=" bg-green-200 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 h-16">
            <img className="h-16" src={logo} alt="" />
            <span className="text-2xl font-bold text-primary">
              CivicConnect
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-neutral-900 hover:text-primary font-medium"
            >
              Home
            </Link>

            <Link
              to="/all-issues"
              className="text-neutral-900 hover:text-primary font-medium"
            >
              All Issues
            </Link>
            <Link
              to="/my-issues"
              className="text-neutral-900 hover:text-primary font-medium"
            >
             My Issues
            </Link>

            <Link
              to="/extra-page-1"
              className="text-neutral-900 hover:text-primary font-medium"
            >
              Extra Page 1
            </Link>

            <Link
              to="/extra-page-2"
              className="text-neutral-900 hover:text-primary font-medium"
            >
              Extra Page 2
            </Link>

            {/* If User is Logged In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-neutral-900"
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-100 border rounded-md shadow-lg py-2">
                    <p className="px-4 py-2 text-neutral-900 font-medium">
                      {user.displayName}
                    </p>

                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-neutral-900 hover:bg-neutral-200"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-neutral-900 hover:bg-neutral-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* If User is NOT Logged In */
              <Link
                to="/login"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-900 hover:text-primary focus:outline-none"
            >
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-100 border-t">
          <Link
            onClick={() => setMobileMenuOpen(false)}
            to="/"
            className="block px-4 py-2 hover:bg-neutral-200"
          >
            Home
          </Link>

          <Link
            onClick={() => setMobileMenuOpen(false)}
            to="/all-issues"
            className="block px-4 py-2 hover:bg-neutral-200"
          >
            All Issues
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            to="/my-issues"
            className="block px-4 py-2 hover:bg-neutral-200"
          >
            My Issues
          </Link>

          {/* User Section in Mobile */}
          {user ? (
            <div className="border-t mt-2">
              <p className="px-4 py-2 font-medium">{user.displayName}</p>

              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-neutral-200"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-neutral-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="block px-4 py-2 hover:bg-neutral-200">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
