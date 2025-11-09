import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import apiService from '../../services/api.service';
import Navigation from '../../components/Navigation';

const ProfilePage = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiService.put('/auth/profile', formData);

      if (response.data.success) {
        updateProfile(response.data.user);
        setSuccess(true);
        setIsEditing(false);

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
    setError(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non disponible';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getAccountStatus = () => {
    if (!user) return { text: 'Inconnu', color: 'gray' };

    switch (user.account_status) {
      case 'active':
        return { text: 'Actif', color: 'green' };
      case 'inactive':
        return { text: 'Inactif', color: 'yellow' };
      case 'expired':
        return { text: 'Expiré', color: 'red' };
      default:
        return { text: 'Inconnu', color: 'gray' };
    }
  };

  const accountStatus = getAccountStatus();

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
            <UserCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400" />
            Mon Profil
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Gérez vos informations personnelles
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
          >
            <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            <p className="text-green-600 dark:text-green-400 font-medium">
              Profil mis à jour avec succès !
            </p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
          >
            <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Informations personnelles
            </h2>
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
              >
                Modifier
              </motion.button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Annuler
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <UserCircleIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nom</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <EnvelopeIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.email}</p>
                </div>
              </div>

              {user?.phone && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <PhoneIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Informations du compte
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Code promo</p>
                <p className="text-lg font-mono font-semibold text-primary-600 dark:text-primary-400">
                  {user?.promo_code}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Statut du compte</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${accountStatus.color}-100 dark:bg-${accountStatus.color}-900/20 text-${accountStatus.color}-700 dark:text-${accountStatus.color}-400`}>
                  {accountStatus.text}
                </span>
              </div>
            </div>

            {user?.account_activated_at && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Compte activé le</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {formatDate(user.account_activated_at)}
                  </p>
                </div>
              </div>
            )}

            {user?.account_expires_at && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expire le</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {formatDate(user.account_expires_at)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;