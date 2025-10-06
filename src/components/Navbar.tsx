import React, { useState } from 'react';
import { Menu, X, Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleNavClick = (href: string) => {
    window.location.href = href;
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('/')}>
            <img src={logo} alt="Footprints" className="h-10 w-10" />
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gradient-primary">Footprints</span>
              <Leaf className="h-6 w-6 text-primary ml-1" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavClick('/')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </button>
            {user && (
              <>
                <button 
                  onClick={() => handleNavClick('/calculator')}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Calculator
                </button>
                <button 
                  onClick={() => handleNavClick('/dashboard')}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Dashboard
                </button>
              </>
            )}
            <button 
              onClick={() => handleNavClick('/contact')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Hi, {user.name}</span>
                <button
                  onClick={logout}
                  className="btn-outline text-sm px-4 py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleNavClick('/auth')}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleNavClick('/auth')}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              <button 
                onClick={() => handleNavClick('/')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </button>
              {user && (
                <>
                  <button 
                    onClick={() => handleNavClick('/calculator')}
                    className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                  >
                    Calculator
                  </button>
                  <button 
                    onClick={() => handleNavClick('/dashboard')}
                    className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                  >
                    Dashboard
                  </button>
                </>
              )}
              <button 
                onClick={() => handleNavClick('/contact')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Contact
              </button>
              
              {user ? (
                <div className="px-3 py-2 border-t border-border mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Hi, {user.name}</p>
                  <button
                    onClick={logout}
                    className="btn-outline text-sm px-4 py-2 w-full"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 border-t border-border mt-2 space-y-2">
                  <button 
                    onClick={() => handleNavClick('/auth')}
                    className="btn-outline text-sm px-4 py-2 w-full"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => handleNavClick('/auth')}
                    className="btn-primary text-sm px-4 py-2 w-full"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;