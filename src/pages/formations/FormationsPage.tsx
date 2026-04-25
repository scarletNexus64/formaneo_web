import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlayIcon,
  TagIcon,
  UserIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  Squares2X2Icon,
  ListBulletIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { FormationPack, formationsService } from '../../services/formations.service';
import { useAuthStore } from '../../store/authStore';
import { getFullImageUrl } from '../../utils/imageUtils';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';
import defaultThumbnail from '../../assets/thumbnai.png';

const FormationsPage = () => {
  const { user } = useAuthStore();
  const [formations, setFormations] = useState<FormationPack[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<FormationPack[]>([]);
  const [categories, setCategories] = useState<(string | { id: number; name: string; slug: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const levels = [
    { value: '', label: 'Tous les niveaux' },
    { value: 'beginner', label: 'Débutant' },
    { value: 'intermediate', label: 'Intermédiaire' },
    { value: 'advanced', label: 'Avancé' }
  ];

  useEffect(() => {
    loadFormations();
    loadCategories();
  }, []);

  useEffect(() => {
    filterFormations();
  }, [formations, searchQuery, selectedCategory, selectedLevel]);

  const loadFormations = async () => {
    try {
      setIsLoading(true);
      const data = await formationsService.getFormationPacks();
      setFormations(data);
    } catch (error) {
      console.error('Error loading formations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await formationsService.getFormationCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filterFormations = () => {
    let filtered = formations;

    if (searchQuery) {
      filtered = filtered.filter(
        formation =>
          (formation.title && formation.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (formation.description && formation.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (formation.instructor_name && formation.instructor_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(formation => {
        const categoryName = typeof formation.category === 'object' ? formation.category.name : formation.category;
        return categoryName === selectedCategory;
      });
    }

    if (selectedLevel) {
      filtered = filtered.filter(formation => formation.level === selectedLevel);
    }

    setFilteredFormations(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes > 0 ? remainingMinutes + 'min' : ''}`;
    }
    return `${remainingMinutes}min`;
  };

  const getLevelBadge = (level: string) => {
    const badges = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-purple-100 text-purple-800'
    };
    const labels = {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé'
    };
    return { class: badges[level as keyof typeof badges] || 'bg-gray-100 text-gray-800 dark:text-gray-200', label: labels[level as keyof typeof labels] || level };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-gray-900 dark:from-red-700 dark:to-black border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        {/* Subtle animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-3"
                >
                  <BookOpenIcon className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold text-white">Formations</h1>
              </div>
              <p className="text-lg text-red-100 dark:text-red-200 flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-2"
                >
                  <SparklesIcon className="w-5 h-5 text-yellow-300" />
                </motion.div>
                Développez vos compétences avec nos formations professionnelles
              </p>
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl"
              >
                <p className="text-sm text-white font-semibold flex items-center">
                  <FireIcon className="w-4 h-4 mr-1 text-orange-300" />
                  {filteredFormations.length} formation{filteredFormations.length > 1 ? 's' : ''}
                </p>
              </motion.div>

              {/* View Mode Toggle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, description ou auteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-6 py-4 border rounded-xl font-medium transition-all ${
                showFilters
                  ? 'border-red-200 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 shadow-md'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
              }`}
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filtres
              {(selectedCategory || selectedLevel) && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                >
                  {(selectedCategory ? 1 : 0) + (selectedLevel ? 1 : 0)}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
              >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Catégorie
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((category) => {
                      const categoryName = typeof category === 'object' ? category.name : category;
                      const categoryKey = typeof category === 'object' ? category.id : category;
                      return (
                        <option key={categoryKey} value={categoryName}>
                          {categoryName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Niveau de difficulté
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {levels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedLevel('');
                    setSearchQuery('');
                  }}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
                >
                  Effacer tous les filtres
                </button>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredFormations.length} résultat{filteredFormations.length > 1 ? 's' : ''} trouvé{filteredFormations.length > 1 ? 's' : ''}
                </div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
                viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
              }`}>
                <div className={`bg-gray-200 dark:bg-gray-600 animate-pulse ${viewMode === 'list' ? 'w-full sm:w-48 h-48 sm:h-32' : 'h-48'}`}></div>
                {viewMode === 'list' && (
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-3 w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                  </div>
                )}
                {viewMode === 'grid' && (
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-3 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Formations Display */
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredFormations.map((formation, index) => {
              const levelBadge = getLevelBadge(formation.level || 'intermediate');
              const hasPromotion = (formation.is_on_promotion || formation.is_promoted) && (formation.promotion_price || formation.promotional_price);
              const displayPrice = hasPromotion ? (formation.promotion_price || formation.promotional_price!) : formation.price;

              if (viewMode === 'list') {
                return (
                  <ActivationGuard
                    key={formation.id}
                    action="consulter cette formation"
                    className="w-full"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    >
                      <Link
                        to={`/formations/${formation.id}`}
                        className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-700 hover:shadow-lg transition-all p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
                      >
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-48 h-48 sm:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getFullImageUrl(formation.thumbnail_url) || defaultThumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = defaultThumbnail;
                        }}
                      />
                      
                      {/* Badges */}
                      {hasPromotion && (
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs font-semibold shadow-md">
                          Promo
                        </div>
                      )}
                      {formation.is_purchased && (
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-500 text-white p-1.5 sm:p-2 rounded-lg shadow-md">
                          <CheckCircleIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg whitespace-nowrap">
                            {typeof formation.category === 'object' ? formation.category.name : formation.category}
                          </span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap ${levelBadge.class}`}>
                            {levelBadge.label}
                          </span>
                        </div>

                        {formation.is_purchased ? (
                          <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-lg whitespace-nowrap self-start">
                            Acheté
                          </span>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            {hasPromotion ? (
                              <>
                                <span className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400 whitespace-nowrap">
                                  {formatPrice(displayPrice)} FCFA
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through whitespace-nowrap">
                                  {formatPrice(formation.price)} FCFA
                                </span>
                              </>
                            ) : (
                              <span className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400 whitespace-nowrap">
                                {formatPrice(formation.price)} FCFA
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2">
                        {formation.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {formation.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center whitespace-nowrap">
                          <UserIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate max-w-[120px] sm:max-w-none">{formation.instructor_name}</span>
                        </div>
                        <div className="flex items-center whitespace-nowrap">
                          <ClockIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                          {formatDuration(formation.total_duration_minutes)}
                        </div>
                        <div className="flex items-center whitespace-nowrap">
                          <AcademicCapIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                          {formation.formations_count} cours
                        </div>
                        <div className="flex items-center whitespace-nowrap">
                          <StarIcon className="w-4 h-4 mr-1 text-yellow-400 flex-shrink-0" />
                          {formation.rating}
                        </div>
                      </div>
                    </div>
                      </Link>
                    </motion.div>
                  </ActivationGuard>
                );
              }

              // Grid View
              return (
                <ActivationGuard
                  key={formation.id}
                  action="consulter cette formation"
                  className="w-full"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <Link
                      to={`/formations/${formation.id}`}
                      className="group block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-red-200 dark:hover:border-red-700 hover:shadow-xl transition-all"
                    >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={getFullImageUrl(formation.thumbnail_url) || defaultThumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = defaultThumbnail;
                      }}
                    />
                    
                    {/* Badges */}
                    {hasPromotion && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        Promo
                      </div>
                    )}
                    {formation.is_purchased && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white p-2 rounded-lg">
                        <CheckCircleIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">
                        {typeof formation.category === 'object' ? formation.category.name : formation.category}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${levelBadge.class}`}>
                        {levelBadge.label}
                      </span>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2">
                      {formation.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {formation.description}
                    </p>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center min-w-0">
                        <UserIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{formation.instructor_name}</span>
                      </div>
                      <div className="flex items-center whitespace-nowrap">
                        <ClockIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                        {formatDuration(formation.total_duration_minutes)}
                      </div>
                      <div className="flex items-center whitespace-nowrap">
                        <AcademicCapIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                        {formation.formations_count} cours
                      </div>
                      <div className="flex items-center whitespace-nowrap">
                        <StarIcon className="w-3 h-3 mr-1 text-yellow-400 flex-shrink-0" />
                        {formation.rating}
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        {hasPromotion ? (
                          <>
                            <span className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 whitespace-nowrap">
                              {formatPrice(displayPrice)} FCFA
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 line-through whitespace-nowrap">
                              {formatPrice(formation.price)} FCFA
                            </span>
                          </>
                        ) : (
                          <span className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 whitespace-nowrap">
                            {formatPrice(formation.price)} FCFA
                          </span>
                        )}
                      </div>

                      {formation.is_purchased ? (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
                          Acheté
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-red-600 dark:text-red-400 whitespace-nowrap flex-shrink-0">
                          Voir détails →
                        </span>
                      )}
                    </div>
                  </div>
                    </Link>
                  </motion.div>
                </ActivationGuard>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredFormations.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <AcademicCapIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Aucune formation trouvée
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Aucune formation ne correspond à vos critères. Essayez de modifier vos filtres ou explorez toutes nos formations.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedLevel('');
              }}
              className="inline-flex items-center px-6 py-3 bg-red-600 dark:bg-red-700 text-white font-semibold rounded-xl hover:bg-red-700 dark:hover:bg-red-600"
            >
              Effacer les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormationsPage;