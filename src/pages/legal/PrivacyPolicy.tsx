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

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
          <div className="flex items-center">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Politique de Confidentialité
            </h1>
          </div>
          <p className="mt-2 text-gray-600">Dernière mise à jour : 10 novembre 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">

          {/* Introduction */}
          <div className="mb-10">
            <p className="text-gray-700 leading-relaxed">
              La présente politique de confidentialité décrit la manière dont <strong>FORMENAO SARL</strong>, société enregistrée sous le numéro <strong>RCN•CM-BXF-01-2025-B13-00091</strong>, collecte, utilise, stocke et protège les données personnelles des utilisateurs du site web <strong>www.formaneo.site</strong> et de ses services numériques.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <UsersIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Responsable du traitement
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-3">Le responsable du traitement des données est :</p>
                  <ul className="space-y-1 text-gray-700">
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
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <CircleStackIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Données collectées
                </h2>
                <div className="prose prose-blue max-w-none text-gray-700">
                  <p className="mb-4">
                    Lors de l'utilisation du site Formaneo, nous pouvons collecter les informations suivantes :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Données d'inscription :</strong> nom, prénom, adresse e-mail, numéro de téléphone, mot de passe.</li>
                    <li><strong>Données de transaction :</strong> historique de paiements, date d'activation, montant versé.</li>
                    <li><strong>Données d'utilisation :</strong> adresses IP, pages consultées, durée de connexion.</li>
                    <li><strong>Données d'affiliation :</strong> identifiants de parrainage, liens d'inscription utilisés.</li>
                    <li><strong>Données de support :</strong> messages envoyés via le service client ou les formulaires de contact.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <EyeIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Finalité de la collecte
                </h2>
                <div className="prose prose-blue max-w-none text-gray-700">
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
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Base légale du traitement</h2>
                <div className="prose prose-blue max-w-none text-gray-700">
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
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">5</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <GlobeAltIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Partage et transfert des données
                </h2>
                <div className="prose prose-blue max-w-none text-gray-700">
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-4">
                    <p className="font-semibold text-green-800">
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
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">6</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <ClockIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Durée de conservation
                </h2>
                <div className="prose prose-blue max-w-none text-gray-700">
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
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">7</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <LockClosedIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Sécurité des données
                </h2>
                <div className="prose prose-blue max-w-none text-gray-700">
                  <p className="mb-4">
                    FORMENAO SARL met en œuvre toutes les mesures techniques et organisationnelles nécessaires pour protéger les données personnelles contre :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>L'accès non autorisé,</li>
                    <li>La perte, la modification ou la divulgation accidentelle.</li>
                  </ul>
                  <p className="mt-4">
                    Les communications entre le site et les utilisateurs sont sécurisées par protocole <strong>HTTPS</strong> et les paiements sont traités via des systèmes certifiés <strong>PCI-DSS</strong>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">8</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <ShieldCheckIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Droits des utilisateurs
                </h2>
                <div className="prose prose-blue max-w-none text-gray-700">
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
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mt-4">
                    <p className="text-blue-800">
                      Toute demande doit être adressée par e-mail à : <strong>formaneosarl@gmail.com</strong>
                    </p>
                    <p className="text-blue-700 mt-2">
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
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">9</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies et technologies similaires</h2>
                <div className="prose prose-blue max-w-none text-gray-700">
                  <p className="mb-4">Le site <strong>www.formaneo.site</strong> utilise des cookies pour :</p>
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
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">10</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Liens externes</h2>
                <div className="prose prose-blue max-w-none text-gray-700">
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
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">11</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications de la politique</h2>
                <div className="prose prose-blue max-w-none text-gray-700">
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
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">12</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <EnvelopeIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Contact
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-3">
                    Pour toute question relative à la présente politique de confidentialité, veuillez contacter :
                  </p>
                  <ul className="space-y-1 text-gray-700">
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
          <div className="border-t border-gray-200 pt-8 mt-10">
            <p className="text-sm text-gray-600 text-center">
              Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée.
            </p>
            <div className="flex justify-center mt-4 space-x-4">
              <Link
                to="/legal/terms-of-service"
                className="text-blue-600 hover:text-blue-700 text-sm underline"
              >
                Conditions générales d'utilisation
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-700 text-sm underline"
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
