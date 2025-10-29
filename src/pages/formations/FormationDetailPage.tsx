import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  UserIcon,
  CheckCircleIcon,
  PlayIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
  LockClosedIcon,
  GiftIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  PlayIcon as PlayIconSolid
} from '@heroicons/react/24/solid';
import { FormationPack, Formation, formationsService } from '../../services/formations.service';
import { useAuthStore } from '../../store/authStore';
import { getFullImageUrl } from '../../utils/imageUtils';
import Navigation from '../../components/Navigation';
import defaultThumbnail from '../../assets/thumbnai.png';
import toast from 'react-hot-toast';
import PaymentModal from '../../components/payment/PaymentModal';
import paymentService from '../../services/payment.service';

const FormationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [pack, setFormation] = useState<FormationPack | null>(null);
  const formation = pack;
  const [formations, setFormations] = useState<Formation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadFormationDetail();
    }
  }, [id]);

  const loadFormationDetail = async () => {
    try {
      setIsLoading(true);
      
      // Charger les détails du pack (contient déjà les formations)
      const packData = await formationsService.getFormationPack(Number(id));
      setFormation(packData);
      
      // Utiliser les formations incluses dans le pack si elles existent
      if (packData.formations && Array.isArray(packData.formations)) {
        setFormations(packData.formations);
        console.log('✅ Formations loaded from pack data:', packData.formations);
      } else {
        // Essayer de charger les formations séparément (uniquement si acheté)
        try {
          const formationsData = await formationsService.getPackFormations(Number(id));
          setFormations(formationsData);
          setHasAccess(true);
        } catch (formationError: any) {
          if (formationError.response?.status === 403) {
            // L'utilisateur n'a pas accès aux détails des formations (pas acheté)
            console.log('⚠️ Pack not purchased, using preview data');
            setFormations([]);
            setHasAccess(false);
          } else {
            console.error('Error loading pack formations:', formationError);
            setFormations([]);
            setHasAccess(false);
          }
        }
      }
      
      // Déterminer l'accès basé sur is_purchased
      setHasAccess(packData.is_purchased || false);
      
    } catch (error) {
      console.error('Error loading formation detail:', error);
      toast.error('Erreur lors du chargement de la formation');
    } finally {
      setIsLoading(false);
    }
  };


  const handlePurchase = async () => {
    // Si le compte est activé, acheter directement sans paiement
    if (user?.account_status === 'active' && pack) {
      try {
        setIsPurchasing(true);
        await paymentService.purchaseFormationPack(pack.id);
        setHasAccess(true);
        await loadFormationDetail();
        toast.success('Formation obtenue avec succès !');
      } catch (error) {
        console.error('Error purchasing formation:', error);
        toast.error('Erreur lors de l\'obtention de la formation');
      } finally {
        setIsPurchasing(false);
      }
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = async () => {
    setHasAccess(true);
    await loadFormationDetail();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div>
                <div className="h-32 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Formation non trouvée</h3>
          <p className="text-gray-600 mb-6">La formation que vous recherchez n'existe pas.</p>
          <button
            onClick={() => navigate('/formations')}
            className="inline-flex items-center px-4 py-2 bg-brand-primary text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Retour aux formations
          </button>
        </div>
      </div>
    );
  }

  const levelBadge = getLevelBadge(formation.level || 'intermediate');
  const hasPromotion = (formation.is_on_promotion || formation.is_promoted) && (formation.promotion_price || formation.promotional_price);
  const displayPrice = hasPromotion ? (formation.promotion_price || formation.promotional_price!) : formation.price;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header with breadcrumb */}
      <div className="bg-white border-b border-formaneo-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center space-x-2 text-sm mb-4">
            <button
              onClick={() => navigate('/formations')}
              className="text-formaneo-gray-500 hover:text-brand-primary flex items-center font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Formations
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-brand-primary font-semibold truncate">{formation.title}</span>
          </nav>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
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
              {formation.rating} ({formation.students_count} étudiants)
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img
                  src={getFullImageUrl(formation.thumbnail_url) || defaultThumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = defaultThumbnail;
                  }}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${levelBadge.class}`}>
                    {levelBadge.label}
                  </span>
                  {formation.category && (
                    <span className="text-xs font-semibold text-brand-primary bg-formaneo-gold bg-opacity-10 px-3 py-1 rounded-full">
                      {typeof formation.category === 'object' ? formation.category.name : formation.category}
                    </span>
                  )}
                </div>
                
                <div className="absolute top-4 right-4 flex gap-2">
                  {hasPromotion && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Promotion
                    </span>
                  )}
                  {hasAccess && (
                    <div className="bg-green-500 text-white p-2 rounded-full">
                      <CheckCircleIconSolid className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-900 p-4 rounded-full shadow-lg">
                    <PlayIconSolid className="w-8 h-8" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{formation.title}</h1>
                
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {formation.description}
                </p>

                {hasPromotion && formation.promotion_ends_at && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center text-red-700">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      <span className="font-medium">
                        Offre limitée jusqu'au {new Date(formation.promotion_ends_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-brand-primary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <AcademicCapIcon className="w-6 h-6 text-brand-primary" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formation.formations_count}</p>
                <p className="text-sm text-gray-600">Cours</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-formaneo-gold bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ClockIcon className="w-6 h-6 text-formaneo-gold" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(formation.total_duration_minutes)}</p>
                <p className="text-sm text-gray-600">Durée totale</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-brand-primary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <StarIcon className="w-6 h-6 text-brand-primary" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formation.rating}</p>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-formaneo-gold bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <UserIcon className="w-6 h-6 text-formaneo-gold" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formation.students_count}</p>
                <p className="text-sm text-gray-600">Étudiants</p>
              </div>
            </div>

            {/* Skills and Requirements */}
            {((formation.skills_acquired?.length || 0) > 0 || (formation.requirements?.length || 0) > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {formation.skills_acquired && formation.skills_acquired.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Ce que vous apprendrez</h3>
                    <ul className="space-y-3">
                      {formation.skills_acquired.map((skill, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIconSolid className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {formation.requirements && formation.requirements.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Prérequis</h3>
                    <ul className="space-y-3">
                      {formation.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <BookOpenIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Course Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenu de la formation</h2>
              
              {formations.length > 0 ? (
                <div className="space-y-3">
                  {formations.map((course, index) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-xl p-6 hover:border-indigo-200 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            {hasAccess ? (
                              <div className="w-12 h-12 bg-brand-primary bg-opacity-10 rounded-xl flex items-center justify-center">
                                <PlayIcon className="w-6 h-6 text-brand-primary" />
                              </div>
                            ) : course.is_free_preview ? (
                              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <PlayIcon className="w-6 h-6 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                <LockClosedIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                              {course.description && (
                                <p className="text-gray-600 mb-2">{course.description}</p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <ClockIcon className="w-4 h-4 mr-1" />
                                  {formatDuration(course.duration_minutes || 0)}
                                </span>
                                {course.modules_count && (
                                  <span className="flex items-center">
                                    <BookOpenIcon className="w-4 h-4 mr-1" />
                                    {course.modules_count} modules
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {course.is_free_preview && (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold">
                                  Aperçu gratuit
                                </span>
                              )}
                              {!hasAccess && !course.is_free_preview && (
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-semibold">
                                  Premium
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {hasAccess && course.user_progress && course.user_progress > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                <span>Progression</span>
                                <span>{Math.round(course.user_progress)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-brand-primary h-2 rounded-full" 
                                  style={{ width: `${course.user_progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <BookOpenIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Contenu de la formation</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Achetez cette formation pour accéder à tout le contenu exclusif et commencer votre apprentissage.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6 max-w-sm mx-auto">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="text-center">
                        <AcademicCapIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">{formation?.formations_count || 0}</div>
                        <div>Cours</div>
                      </div>
                      <div className="text-center">
                        <ClockIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">{formatDuration(formation?.total_duration_minutes || 0)}</div>
                        <div>Durée</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sticky top-8">
              {/* Price */}
              <div className="text-center mb-8">
                {user?.account_status === 'active' ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Compte activé</span>
                    <span className="block text-2xl font-bold text-green-600 mt-2">
                      Formation gratuite
                    </span>
                  </div>
                ) : hasPromotion ? (
                  <div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                      <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Offre spéciale</span>
                    </div>
                    <span className="text-4xl font-bold text-brand-primary">
                      {formatPrice(displayPrice)} FCFA
                    </span>
                    <span className="block text-xl text-formaneo-gray-500 line-through mt-1">
                      {formatPrice(formation.price)} FCFA
                    </span>
                    <div className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-xl text-sm font-semibold mt-3">
                      Économisez {formatPrice(formation.price - displayPrice)} FCFA
                    </div>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-brand-primary">
                    {formatPrice(formation.price)} FCFA
                  </span>
                )}
              </div>

              {/* Action Button */}
              {hasAccess ? (
                <button
                  onClick={() => navigate(`/formations/${formation.id}/learn`)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl mb-6"
                >
                  <PlayIcon className="w-5 h-5 inline mr-2" />
                  Commencer la formation
                </button>
              ) : (
                <div className="space-y-6 mb-6">
                  {/* Payment Method Selection */}
  

                  <button
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className="w-full bg-brand-primary hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl"
                  >
                    {isPurchasing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Achat en cours...
                      </div>
                    ) : (
                      <>
                        <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
                        {user?.account_status === 'active' ? 'Obtenir gratuitement' : 'Acheter maintenant'}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Features */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cette formation inclut</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircleIconSolid className="w-3 h-3 text-green-600" />
                    </div>
                    Accès à vie au contenu
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircleIconSolid className="w-3 h-3 text-green-600" />
                    </div>
                    Certificat de completion
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircleIconSolid className="w-3 h-3 text-green-600" />
                    </div>
                    Support communautaire
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircleIconSolid className="w-3 h-3 text-green-600" />
                    </div>
                    Mises à jour gratuites
                  </li>
                  {hasPromotion && (
                    <li className="flex items-center text-sm text-red-600">
                      <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <GiftIcon className="w-3 h-3 text-red-600" />
                      </div>
                      Offre promotionnelle limitée
                    </li>
                  )}
                </ul>
              </div>

              {/* Guarantee */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Garantie 30 jours</h4>
                <p className="text-sm text-gray-600">
                  Remboursement complet si vous n'êtes pas satisfait
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {formation && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          item={{
            id: formation.id,
            name: formation.name || formation.title,
            price: displayPrice || 0,
            type: 'formation_pack',
            cashback: formation.cashback_amount
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default FormationDetailPage;