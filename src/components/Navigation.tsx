import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  AcademicCapIcon,
  HomeIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
  PuzzlePieceIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import logo from '../assets/logo.png';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/formations', label: 'Formations', icon: AcademicCapIcon },
    { path: '/quizz', label: 'Quizz', icon: PuzzlePieceIcon },
    { path: '/challenges', label: 'Défis', icon: TrophyIcon },
    { path: '/ebooks', label: 'E-books', icon: BookOpenIcon },
    { path: '/wallet', label: 'Portefeuille', icon: CurrencyDollarIcon },
    { path: '/affiliate', label: 'Affiliation', icon: UserGroupIcon },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center">
              <img src={logo} alt="Formaneo" className="h-20 w-20" />
            </Link>
            
            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-formaneo-gold bg-opacity-10 text-brand-primary'
                        : 'text-formaneo-gray-600 hover:text-brand-primary hover:bg-formaneo-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* Balance */}
            <div className="hidden md:block bg-formaneo-gold bg-opacity-10 px-4 py-2 rounded-lg border border-formaneo-gold border-opacity-20">
              <p className="text-xs text-formaneo-gray-600">Solde</p>
              <p className="text-sm font-semibold text-brand-primary">
                {formatPrice(user?.balance || 0)} FCFA
              </p>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-brand-primary">{user?.name}</p>
                <p className="text-xs text-formaneo-gray-500">{user?.email}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-formaneo-gray-500 hover:text-brand-primary hover:bg-formaneo-gray-100 rounded-lg transition-colors"
                title="Déconnexion"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2 py-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive(item.path)
                    ? 'bg-formaneo-gold bg-opacity-10 text-brand-primary'
                    : 'text-formaneo-gray-600 hover:text-brand-primary hover:bg-formaneo-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;