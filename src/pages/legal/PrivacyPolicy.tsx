import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CircleStackIcon,
  EyeIcon,
  UsersIcon,
  GlobeAltIcon,
  ClockIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import PublicNavigation from '../../components/PublicNavigation';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <PublicNavigation />

      {/* Header */}
      <div className="pt-20 bg-gradient-to-r from-red-600 to-gray-900 dark:from-red-700 dark:to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/"
            className="inline-flex items-center text-white/90 hover:text-white transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
          <div className="flex items-center">
            <ShieldCheckIcon className="w-10 h-10 text-white mr-4" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Politique de Confidentialité
              </h1>
              <p className="mt-2 text-white/80">Dernière mise à jour : 10 novembre 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">

          {/* Introduction */}
          <div className="mb-10">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              La présente politique de confidentialité décrit la manière dont <strong>FORMENAO SARL</strong>, société enregistrée sous le numéro <strong className="text-red-600 dark:text-red-400">RCN•CM-BXF-01-2025-B13-00091</strong>, collecte, utilise, stocke et protège les données personnelles des utilisateurs du site web <strong className="text-red-600 dark:text-red-400">www.formaneo.site</strong> et de ses services numériques.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">1</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <UsersIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Responsable du traitement
                </h2>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">Le responsable du traitement des données est :</p>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                    <li><strong>FORMENAO SARL</strong></li>
                    <li>📍 Siège social : Bafoussam – Tamdja</li>
                    <li>📧 Email : formaneosarl@gmail.com</li>
                    <li>🌐 Site web : www.formaneo.site</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">2</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CircleStackIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Données collectées
                </h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <p className="mb-4">
                    Lors de l'utilisation du site Formaneo, nous pouvons collecter les informations suivantes :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-red-600 dark:text-red-400">Données d'inscription :</strong> nom, prénom, adresse e-mail, numéro de téléphone, mot de passe.</li>
                    <li><strong className="text-red-600 dark:text-red-400">Données de transaction :</strong> historique de paiements, date d'activation, montant versé.</li>
                    <li><strong className="text-red-600 dark:text-red-400">Données d'utilisation :</strong> adresses IP, pages consultées, durée de connexion.</li>
                    <li><strong className="text-red-600 dark:text-red-400">Données d'affiliation :</strong> identifiants de parrainage, liens d'inscription utilisés.</li>
                    <li><strong className="text-red-600 dark:text-red-400">Données de support :</strong> messages envoyés via le service client ou les formulaires de contact.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">3</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <EyeIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Finalité de la collecte
                </h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <p className="mb-4">Les données personnelles sont collectées uniquement pour :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Créer et gérer les comptes utilisateurs.</li>
                    <li>Assurer le bon fonctionnement des formations, quiz et systèmes d'affiliation.</li>
                    <li>Traiter les paiements et retraits via les passerelles agréées (CinetPay, Flutterwave, Mobile Money, etc.).</li>
                    <li>Améliorer les services éducatifs proposés.</li>
                    <li>Communiquer avec les utilisateurs (notifications, assistance, mises à jour).</li>
                    <li>Respecter les obligations légales et réglementaires.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">4</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Base légale du traitement</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <p className="mb-4">Le traitement des données personnelles repose sur :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Le consentement explicite de l'utilisateur lors de son inscription ;</li>
                    <li>L'exécution d'un contrat (accès aux formations et au programme d'affiliation) ;</li>
                    <li>L'obligation légale de conserver certaines données comptables et de transaction.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">5</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <GlobeAltIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Partage et transfert des données
                </h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-600 p-4 rounded mb-4">
                    <p className="font-semibold text-green-800 dark:text-green-300">
                      Les données personnelles des utilisateurs ne sont jamais vendues ni partagées à des tiers non autorisés.
                    </p>
                  </div>
                  <p className="mb-4">
                    Cependant, certaines données peuvent être transmises à des partenaires de confiance pour les besoins techniques ou financiers suivants :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Passerelles de paiement (CinetPay, Flutterwave, Mobile Money) pour valider les transactions.</li>
                    <li>Fournisseurs d'hébergement pour assurer la sécurité et la disponibilité du site.</li>
                    <li>Autorités légales uniquement en cas d'obligation légale (fraude, litige, etc.).</li>
                  </ul>
                  <p className="mt-4">
                    Tous nos partenaires s'engagent à respecter la confidentialité et la protection des données.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">6</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ClockIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Durée de conservation
                </h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <p className="mb-4">Les données sont conservées :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Pendant la durée d'activité du compte utilisateur,</li>
                    <li>Et jusqu'à 12 mois après la suppression du compte, sauf obligation légale de conservation plus longue (ex : comptabilité).</li>
                  </ul>
                  <p className="mt-4">
                    Au-delà de ces délais, les données sont automatiquement supprimées ou anonymisées.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">7</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <LockClosedIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Sécurité des données
                </h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <p className="mb-4">
                    FORMENAO SARL met en œuvre toutes les mesures techniques et organisationnelles nécessaires pour protéger les données personnelles contre :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>L'accès non autorisé,</li>
                    <li>La perte, la modification ou la divulgation accidentelle.</li>
                  </ul>
                  <p className="mt-4">
                    Les communications entre le site et les utilisateurs sont sécurisées par protocole <strong className="text-red-600 dark:text-red-400">HTTPS</strong> et les paiements sont traités via des systèmes certifiés <strong className="text-red-600 dark:text-red-400">PCI-DSS</strong>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">8</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ShieldCheckIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Droits des utilisateurs
                </h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <p className="mb-4">
                    Conformément aux législations en vigueur, chaque utilisateur dispose des droits suivants :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Droit d'accès à ses données personnelles,</li>
                    <li>Droit de rectification en cas d'erreur,</li>
                    <li>Droit de suppression (« droit à l'oubli »),</li>
                    <li>Droit d'opposition au traitement,</li>
                    <li>Droit à la portabilité des données (export de ses informations).</li>
                  </ul>
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4 rounded mt-4">
                    <p className="text-red-800 dark:text-red-300">
                      Toute demande doit être adressée par e-mail à : <strong>formaneosarl@gmail.com</strong>
                    </p>
                    <p className="text-red-700 dark:text-red-400 mt-2">
                      FORMENAO SARL s'engage à y répondre dans un délai maximal de 15 jours ouvrables.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">9</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cookies et technologies similaires</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <p className="mb-4">Le site <strong className="text-red-600 dark:text-red-400">www.formaneo.site</strong> utilise des cookies pour :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Faciliter la navigation,</li>
                    <li>Analyser le trafic et les performances,</li>
                    <li>Personnaliser l'expérience utilisateur.</li>
                  </ul>
                  <p className="mt-4">
                    L'utilisateur peut à tout moment désactiver les cookies depuis les paramètres de son navigateur.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">10</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Liens externes</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <p>
                    Le site Formaneo peut contenir des liens vers d'autres sites externes.
                  </p>
                  <p className="mt-2">
                    FORMENAO SARL décline toute responsabilité concernant la politique de confidentialité de ces sites tiers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">11</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Modifications de la politique</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <p className="mb-4">
                    FORMENAO SARL se réserve le droit de modifier la présente politique à tout moment.
                  </p>
                  <p className="mb-4">
                    Toute mise à jour sera publiée sur cette page avec la date de dernière révision.
                  </p>
                  <p>
                    L'utilisation continue du site vaut acceptation des nouvelles dispositions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">12</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <EnvelopeIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Contact
                </h2>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Pour toute question relative à la présente politique de confidentialité, veuillez contacter :
                  </p>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                    <li>📧 formaneosarl@gmail.com</li>
                    <li>🌐 www.formaneo.site</li>
                    <li>📍 Bafoussam – Tamdja</li>
                    <li>RCN•CM-BXF-01-2025-B13-00091</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-10">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée.
            </p>
            <div className="flex justify-center mt-4 space-x-4">
              <Link
                to="/legal/terms-of-service"
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm underline"
              >
                Conditions générales d'utilisation
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                to="/"
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm underline"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
