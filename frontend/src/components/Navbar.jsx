import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X, Home, TrendingUp, Send, Download, Wallet } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Navigation */}
      <nav className="nav-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Aspire Secure Trade</span>
              </Link>
            </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-300 hover:text-white hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Dashboard
                </Link>
                <Link to="/deposit" className="text-slate-300 hover:text-white hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Deposit
                </Link>
                <Link to="/withdraw" className="text-slate-300 hover:text-white hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Withdraw
                </Link>
                <Link to="/transactions" className="text-slate-300 hover:text-white hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Transactions
                </Link>
                <div className="ml-4 pl-4 border-l border-slate-600 flex items-center space-x-2">
                  <User className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-300">{user.firstName} {user.lastName}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="btn-danger mobile-button flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-700 bg-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {user ? (
                <>
                  <div className="px-3 py-2 text-slate-400 text-sm border-b border-slate-700">
                    Welcome, {user.firstName}
                  </div>
                  <Link
                    to="/dashboard"
                    className="text-slate-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/deposit"
                    className="text-slate-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Deposit
                  </Link>
                  <Link
                    to="/withdraw"
                    className="text-slate-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Withdraw
                  </Link>
                  <Link
                    to="/transactions"
                    className="text-slate-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Transactions
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>

      {/* Bottom Navigation for Mobile */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 z-40 md:hidden">
          <div className="flex items-center justify-around py-2">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive('/dashboard') ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <Home className="h-5 w-5 mb-1" />
              <span className="text-xs">Home</span>
            </Link>
            
            <Link
              to="/portfolio"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive('/portfolio') ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <Wallet className="h-5 w-5 mb-1" />
              <span className="text-xs">Portfolio</span>
            </Link>
            
            <Link
              to="/markets"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive('/markets') ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <TrendingUp className="h-5 w-5 mb-1" />
              <span className="text-xs">Markets</span>
            </Link>
            
            <Link
              to="/send"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive('/send') ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <Send className="h-5 w-5 mb-1" />
              <span className="text-xs">Send</span>
            </Link>
            
            <Link
              to="/transactions"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive('/transactions') ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <Download className="h-5 w-5 mb-1" />
              <span className="text-xs">History</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
