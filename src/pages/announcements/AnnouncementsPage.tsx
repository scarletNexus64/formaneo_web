import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import announcementService, { AnnouncementFilters } from '../../services/announcement.service';
import { Announcement } from '../../types';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Annonces</h1>
          <p className="mt-2 text-gray-600">
            Restez informé des dernières actualités et annonces importantes.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type Filter */}
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Type d'annonce
              </label>
              <select
                id="type-filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                id="priority-filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">Aucune annonce disponible pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onClick={() => handleAnnouncementClick(announcement)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
