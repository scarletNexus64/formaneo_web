import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ListBulletIcon
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
    return { class: badges[level as keyof typeof badges] || 'bg-gray-100 text-gray-800', label: labels[level as keyof typeof labels] || level };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <BookOpenIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Formations</h1>
              <p className="text-lg text-gray-600">
                🗂️ Développez vos compétences avec nos formations professionnelles
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl">
                <p className="text-sm text-indigo-700 font-semibold">
                  {filteredFormations.length} formation{filteredFormations.length > 1 ? 's' : ''}
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, description ou auteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-6 py-4 bg-white border rounded-xl font-medium ${
                showFilters 
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filtres
              {(selectedCategory || selectedLevel) && (
                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                  {(selectedCategory ? 1 : 0) + (selectedLevel ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Catégorie
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
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
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Niveau de difficulté
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
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
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Effacer tous les filtres
                </button>
                
                <div className="text-sm text-gray-500">
                  {filteredFormations.length} résultat{filteredFormations.length > 1 ? 's' : ''} trouvé{filteredFormations.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${
                viewMode === 'list' ? 'flex' : ''
              }`}>
                <div className={`bg-gray-200 ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'}`}></div>
                {viewMode === 'list' && (
                  <div className="flex-1 p-6">
                    <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                )}
                {viewMode === 'grid' && (
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
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
            {filteredFormations.map((formation) => {
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
                    <Link
                      to={`/formations/${formation.id}`}
                      className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md p-6 flex gap-6"
                    >
                    {/* Thumbnail */}
                    <div className="relative w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          Promo
                        </div>
                      )}
                      {formation.is_purchased && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-lg">
                          <CheckCircleIcon className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                            {typeof formation.category === 'object' ? formation.category.name : formation.category}
                          </span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${levelBadge.class}`}>
                            {levelBadge.label}
                          </span>
                        </div>
                        
                        {formation.is_purchased ? (
                          <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                            Acheté
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            {hasPromotion ? (
                              <>
                                <span className="text-xl font-bold text-indigo-600">
                                  {formatPrice(displayPrice)} FCFA
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(formation.price)} FCFA
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-bold text-indigo-600">
                                {formatPrice(formation.price)} FCFA
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                        {formation.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {formation.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 mr-1" />
                          {formation.instructor_name}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {formatDuration(formation.total_duration_minutes)}
                        </div>
                        <div className="flex items-center">
                          <AcademicCapIcon className="w-4 h-4 mr-1" />
                          {formation.formations_count} cours
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
                          {formation.rating}
                        </div>
                      </div>
                    </div>
                    </Link>
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
                  <Link
                    to={`/formations/${formation.id}`}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-200 hover:shadow-lg"
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
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        {typeof formation.category === 'object' ? formation.category.name : formation.category}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${levelBadge.class}`}>
                        {levelBadge.label}
                      </span>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                      {formation.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {formation.description}
                    </p>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <UserIcon className="w-3 h-3 mr-1" />
                        {formation.instructor_name}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {formatDuration(formation.total_duration_minutes)}
                      </div>
                      <div className="flex items-center">
                        <AcademicCapIcon className="w-3 h-3 mr-1" />
                        {formation.formations_count} cours
                      </div>
                      <div className="flex items-center">
                        <StarIcon className="w-3 h-3 mr-1 text-yellow-400" />
                        {formation.rating}
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {hasPromotion ? (
                          <>
                            <span className="text-lg font-bold text-indigo-600">
                              {formatPrice(displayPrice)} FCFA
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                              {formatPrice(formation.price)} FCFA
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-indigo-600">
                            {formatPrice(formation.price)} FCFA
                          </span>
                        )}
                      </div>
                      
                      {formation.is_purchased ? (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          Acheté
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-indigo-600">
                          Voir détails →
                        </span>
                      )}
                    </div>
                  </div>
                  </Link>
                </ActivationGuard>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredFormations.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <AcademicCapIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Aucune formation trouvée
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Aucune formation ne correspond à vos critères. Essayez de modifier vos filtres ou explorez toutes nos formations.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedLevel('');
              }}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
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