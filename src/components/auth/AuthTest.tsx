import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LoginCredentials, RegisterData } from '../../types';

const AuthTest: React.FC = () => {
  const { user, isLoading, login, register, logout } = useAuthStore();
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: 'test@example.com',
    password: 'password123'
  });
  
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: 'Test User',
    email: 'newuser@example.com',
    password: 'Password123',
    password_confirmation: 'Password123',
    phone: '+237612345678'
  });

  const handleLogin = async () => {
    try {
      await login(loginData);
      console.log('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await register(registerData);
      console.log('Registration successful');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Test d'Authentification</h2>
      
      {user ? (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Utilisateur connecté</h3>
          <p><strong>Nom:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Solde:</strong> {user.balance} FCFA</p>
          <p><strong>Code promo:</strong> {user.promo_code}</p>
          <p><strong>Quiz gratuits restants:</strong> {user.free_quizzes_left}</p>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Test Login */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Test de Connexion</h3>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
          </div>

          {/* Test Register */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Test d'Inscription</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nom complet"
                value={registerData.name}
                onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={registerData.phone}
                onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={registerData.password}
                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={registerData.password_confirmation}
                onChange={(e) => setRegisterData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Status */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Statut de l'API</h3>
        <p className="text-sm text-gray-600">
          URL API: {process.env.REACT_APP_API_URL}
        </p>
        <p className="text-sm text-gray-600">
          Statut: <span className={isLoading ? 'text-yellow-600' : 'text-gray-600'}>
            {isLoading ? 'En cours...' : 'Prêt'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthTest;