import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MegaphoneIcon,
  FunnelIcon,
  BellIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import announcementService, { AnnouncementFilters } from '../../services/announcement.service';
import { Announcement } from '../../types';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import Navigation from '../../components/Navigation';
import toast from 'react-hot-toast';

const AnnouncementsPage: React.FC = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<AnnouncementFilters>({
    per_page: 10,
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [currentPage, filters.type, filters.priority]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await announcementService.getAnnouncements({
        ...filters,
        page: currentPage,
      });
      setAnnouncements(response.data);
      setTotalPages(response.last_page);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  const handleAnnouncementClick = (announcement: Announcement) => {
    // For now, just scroll to top or show details inline
    console.log('Announcement clicked:', announcement);
  };

  const handleFilterChange = (filterType: 'type' | 'priority', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === 'all' ? undefined : value,
    }));
    setCurrentPage(1);
  };

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-cyan-600 dark:from-black dark:to-cyan-700 border-b border-gray-200 dark:border-gray-700">
        {/* Subtle animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
              >
                <MegaphoneIcon className="h-10 w-10 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Annonces</h1>
            <p className="text-lg text-blue-100 dark:text-blue-200 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mr-2"
              >
                <BellIcon className="w-5 h-5 text-yellow-300" />
              </motion.div>
              Restez informé des dernières actualités et annonces importantes
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-6 py-3 border rounded-xl font-medium transition-all mb-4 ${
              showFilters
                ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/30 text-black dark:text-blue-300 shadow-md'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filtres
            {(filters.type || filters.priority) && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
              >
                {(filters.type ? 1 : 0) + (filters.priority ? 1 : 0)}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type d'annonce
                    </label>
                    <select
                      id="type-filter"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                      value={filters.type || 'all'}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                      <option value="all">Tous les types</option>
                      <option value="info">Information</option>
                      <option value="warning">Avertissement</option>
                      <option value="success">Succès</option>
                      <option value="danger">Danger</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priorité
                    </label>
                    <select
                      id="priority-filter"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                      value={filters.priority || 'all'}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                      <option value="all">Toutes les priorités</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">Importante</option>
                      <option value="medium">Moyenne</option>
                      <option value="low">Basse</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Announcements List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : announcements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center"
          >
            <MegaphoneIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Aucune annonce disponible pour le moment.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
              >
                <AnnouncementCard
                  announcement={announcement}
                  onClick={() => handleAnnouncementClick(announcement)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 flex justify-center"
          >
            <nav className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                Précédent
              </motion.button>
              <span className="px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                Page {currentPage} sur {totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                Suivant
              </motion.button>
            </nav>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
