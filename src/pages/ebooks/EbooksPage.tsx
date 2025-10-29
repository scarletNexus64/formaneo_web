import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  DocumentTextIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TagIcon,
  UserIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  WalletIcon,
  DevicePhoneMobileIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Ebook, ebooksService } from '../../services/ebooks.service';
import { useAuthStore } from '../../store/authStore';
import { getFullImageUrl } from '../../utils/imageUtils';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';
import defaultCover from '../../assets/thumbnai.png';
import PaymentModal from '../../components/payment/PaymentModal';
import paymentService from '../../services/payment.service';
import { challengeTracker } from '../../services/challengeTracker.service';

const EbooksPage = () => {
  const { user } = useAuthStore();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [filteredEbooks, setFilteredEbooks] = useState<Ebook[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);

  const priceFilters = [
    { value: '', label: 'Tous les prix' },
    { value: 'free', label: 'Gratuit' },
    { value: 'paid', label: 'Payant' },
    { value: 'low', label: 'Moins de 5,000 FCFA' },
    { value: 'medium', label: '5,000 - 15,000 FCFA' },
    { value: 'high', label: 'Plus de 15,000 FCFA' }
  ];

  useEffect(() => {
    loadEbooks();
    loadCategories();
  }, []);

  useEffect(() => {
    filterEbooks();
  }, [ebooks, searchQuery, selectedCategory, priceFilter]);

  const loadEbooks = async () => {
    try {
      setIsLoading(true);
      const data = await ebooksService.getEbooks();
      setEbooks(data);
    } catch (error) {
      console.error('Error loading ebooks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await ebooksService.getEbookCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filterEbooks = () => {
    let filtered = ebooks;

    if (searchQuery) {
      filtered = filtered.filter(
        ebook =>
          (ebook.title && ebook.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (ebook.description && ebook.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (ebook.author && ebook.author.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(ebook => ebook.category === selectedCategory);
    }

    if (priceFilter) {
      filtered = filtered.filter(ebook => {
        switch (priceFilter) {
          case 'free':
            return ebook.is_free;
          case 'paid':
            return !ebook.is_free;
          case 'low':
            return ebook.price > 0 && ebook.price < 5000;
          case 'medium':
            return ebook.price >= 5000 && ebook.price <= 15000;
          case 'high':
            return ebook.price > 15000;
          default:
            return true;
        }
      });
    }

    setFilteredEbooks(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handlePurchase = async (ebook: Ebook, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Si le compte est activé, tous les ebooks sont gratuits
    if (user?.account_status === 'active') {
      try {
        // Acheter directement sans paiement car le compte est activé
        await paymentService.purchaseEbook(ebook.id);
        await loadEbooks();
        // Tracker l'achat d'ebook
        await challengeTracker.trackEbookPurchased(ebook.id, ebook.title);
      } catch (error) {
        console.error('Error purchasing ebook:', error);
      }
    } else if (ebook.is_free) {
      // Si c'est gratuit, acheter directement
      try {
        await paymentService.purchaseEbook(ebook.id);
        await loadEbooks();
        // Tracker l'achat d'ebook
        await challengeTracker.trackEbookPurchased(ebook.id, ebook.title);
      } catch (error) {
        console.error('Error purchasing ebook:', error);
      }
    } else {
      // Sinon, montrer le modal de paiement
      setSelectedEbook(ebook);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = async () => {
    await loadEbooks();
    if (selectedEbook) {
      // Tracker l'achat d'ebook après paiement réussi
      await challengeTracker.trackEbookPurchased(selectedEbook.id, selectedEbook.title);
    }
    setShowPaymentModal(false);
    setSelectedEbook(null);
  };

  const handleView = async (ebookId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await ebooksService.viewEbook(ebookId);
      if (response.success && response.view_url) {
        window.open(response.view_url, '_blank');
      }
    } catch (error) {
      console.error('Error viewing ebook:', error);
    }
  };

  const handleDownload = async (ebookId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await ebooksService.downloadEbook(ebookId);
    } catch (error) {
      console.error('Error downloading ebook:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header avec design bibliothèque mais couleurs du projet */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <BookOpenIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Bibliothèque E-books</h1>
              </div>
              <p className="text-lg text-gray-600">
                📚 Découvrez notre collection de livres numériques professionnels
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl">
                <p className="text-sm text-indigo-700 font-semibold">
                  {filteredEbooks.length} e-book{filteredEbooks.length > 1 ? 's' : ''}
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
                placeholder="🔍 Rechercher un livre par titre, auteur ou sujet..."
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
              {(selectedCategory || priceFilter) && (
                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                  {(selectedCategory ? 1 : 0) + (priceFilter ? 1 : 0)}
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
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Prix
                  </label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                  >
                    {priceFilters.map((filter) => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setPriceFilter('');
                    setSearchQuery('');
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Effacer tous les filtres
                </button>
                
                <div className="text-sm text-gray-500">
                  {filteredEbooks.length} résultat{filteredEbooks.length > 1 ? 's' : ''} trouvé{filteredEbooks.length > 1 ? 's' : ''}
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
                <div className={`bg-gray-200 ${viewMode === 'list' ? 'w-32 h-40' : 'h-48'}`}></div>
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
          /* Ebooks Display */
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredEbooks.map((ebook) => {
              if (viewMode === 'list') {
                return (
                  <ActivationGuard 
                    key={ebook.id} 
                    action="consulter cet e-book"
                    className="w-full"
                  >
                    <div
                      className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md p-6 flex gap-6"
                    >
                    {/* Cover avec effet livre mais couleurs du projet */}
                    <div className="relative w-32 h-40 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-lg transform hover:scale-105 transition-transform">
                      <img
                        src={getFullImageUrl(ebook.cover_image_url) || defaultCover}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = defaultCover;
                        }}
                      />
                      
                      {/* Effet reliure de livre (subtil) */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-indigo-600 opacity-30"></div>
                      
                      {/* Effet brillance de livre */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Badges */}
                      {ebook.is_free && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          📖 Gratuit
                        </div>
                      )}
                      {ebook.is_purchased && (
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
                            📚 {ebook.category}
                          </span>
                          {ebook.is_free && (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                              Gratuit
                            </span>
                          )}
                        </div>
                        
                        {!ebook.is_free && user?.account_status !== 'active' && (
                          <span className="text-xl font-bold text-indigo-600">
                            {ebook.formatted_price}
                          </span>
                        )}
                        {!ebook.is_free && user?.account_status === 'active' && (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            Gratuit (Compte activé)
                          </span>
                        )}
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                        📖 {ebook.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {ebook.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 mr-1" />
                          {ebook.author}
                        </div>
                        <div className="flex items-center">
                          <DocumentTextIcon className="w-4 h-4 mr-1" />
                          {ebook.pages} pages
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
                          {ebook.rating}
                        </div>
                        <div className="flex items-center">
                          <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                          {ebook.downloads} téléchargements
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {ebook.is_purchased ? (
                          <>
                            <button
                              onClick={(e) => handleView(ebook.id, e)}
                              className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                            >
                              <EyeIcon className="w-4 h-4 mr-2" />
                              📖 Lire
                            </button>
                            <button
                              onClick={(e) => handleDownload(ebook.id, e)}
                              className="flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700"
                            >
                              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                              Télécharger
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={(e) => handlePurchase(ebook, e)}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                          >
                            <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                            {ebook.is_free || user?.account_status === 'active' ? 'Obtenir gratuitement' : 'Acheter'}
                          </button>
                        )}
                      </div>
                    </div>
                    </div>
                  </ActivationGuard>
                );
              }

              // Grid View (style livre debout avec couleurs du projet)
              return (
                <ActivationGuard 
                  key={ebook.id} 
                  action="consulter cet e-book"
                  className="w-full"
                >
                  <div
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-200 hover:shadow-lg transform hover:-translate-y-1 transition-all"
                  >
                  {/* Cover avec proportion livre */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={getFullImageUrl(ebook.cover_image_url) || defaultCover}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = defaultCover;
                      }}
                    />
                    
                    {/* Effet reliure de livre (subtil) */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-indigo-600 opacity-30"></div>
                    
                    {/* Effet brillance */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Badges */}
                    {ebook.is_free && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        Gratuit
                      </div>
                    )}
                    {ebook.is_purchased && (
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
                        📚 {ebook.category}
                      </span>
                      {ebook.is_free && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          Gratuit
                        </span>
                      )}
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                      📖 {ebook.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {ebook.description}
                    </p>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <UserIcon className="w-3 h-3 mr-1" />
                        {ebook.author}
                      </div>
                      <div className="flex items-center">
                        <DocumentTextIcon className="w-3 h-3 mr-1" />
                        {ebook.pages} pages
                      </div>
                      <div className="flex items-center">
                        <StarIcon className="w-3 h-3 mr-1 text-yellow-400" />
                        {ebook.rating}
                      </div>
                      <div className="flex items-center">
                        <ArrowDownTrayIcon className="w-3 h-3 mr-1" />
                        {ebook.downloads}
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {!ebook.is_free && user?.account_status !== 'active' && (
                          <span className="text-lg font-bold text-indigo-600">
                            {ebook.formatted_price}
                          </span>
                        )}
                        {!ebook.is_free && user?.account_status === 'active' && (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            Gratuit (Compte activé)
                          </span>
                        )}
                      </div>
                      
                      {ebook.is_purchased ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleView(ebook.id, e)}
                            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            title="Lire"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDownload(ebook.id, e)}
                            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            title="Télécharger"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handlePurchase(ebook, e)}
                          className="flex items-center px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                        >
                          <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                          {ebook.is_free || user?.account_status === 'active' ? 'Obtenir' : 'Acheter'}
                        </button>
                      )}
                    </div>
                  </div>
                  </div>
                </ActivationGuard>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredEbooks.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <BookOpenIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Aucun e-book trouvé
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Aucun e-book ne correspond à vos critères. Essayez de modifier vos filtres ou explorez tous nos e-books.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setPriceFilter('');
              }}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
            >
              Effacer les filtres
            </button>
          </div>
        )}

        {/* L'ancien modal de paiement est supprimé car nous utilisons PaymentModal maintenant */}
        
        {/* Payment Modal */}
        {selectedEbook && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedEbook(null);
            }}
            item={{
              id: selectedEbook.id,
              name: selectedEbook.title,
              price: selectedEbook.price,
              type: 'ebook',
              cashback: 0
            }}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default EbooksPage;