import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, School, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <School className="h-8 w-8 text-lime-600" />
          <span className="text-xl font-bold ">SchoolTimetable</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-lime-500 ${
              location.pathname === '/' ? 'text-lime-500' : 'text-gray-700'
            }`}
          >
            Accueil
          </Link>
          <Link
            to="/timetable"
            className={`text-sm font-medium transition-colors hover:text-lime-500 ${
              location.pathname === '/timetable' ? 'text-lime-500' : 'text-gray-700'
            }`}
          >
            Emploi du Temps
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-lime-500 ${
              location.pathname === '/about' ? 'text-lime-500' : 'text-gray-700'
            }`}
          >
            En Savoir Plus
          </Link>
          
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-lime-500">
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
              </button>
              <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/teacher'}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                >
                  Tableau de bord
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-lime-500 rounded-md hover:bg-lime-600 transition-colors"
            >
              Se connecter
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 hover:text-lime-500 focus:outline-none"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="py-2 px-4 space-y-2">
            <Link
              to="/"
              onClick={closeMenu}
              className={`block py-2 text-base font-medium ${
                location.pathname === '/' ? 'text-lime-500' : 'text-gray-700'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/timetable"
              onClick={closeMenu}
              className={`block py-2 text-base font-medium ${
                location.pathname === '/timetable' ? 'text-lime-500' : 'text-gray-700'
              }`}
            >
              Emploi du Temps
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className={`block py-2 text-base font-medium ${
                location.pathname === '/about' ? 'text-lime-500' : 'text-gray-700'
              }`}
            >
              En Savoir Plus
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/teacher'}
                  onClick={closeMenu}
                  className="block py-2 text-base font-medium text-gray-700"
                >
                  Tableau de bord
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full py-2 text-base font-medium text-gray-700"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Se déconnecter
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block py-2 text-base font-medium text-lime-500"
              >
                Se connecter
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
