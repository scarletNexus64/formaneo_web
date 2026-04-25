import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ScaleIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import PublicNavigation from '../../components/PublicNavigation';

const LegalNotice: React.FC = () => {
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
            <BuildingOfficeIcon className="w-10 h-10 text-white mr-4" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Mentions Légales
              </h1>
              <p className="mt-2 text-white/80">Dernière mise à jour : 10 novembre 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">

          {/* Section 1 - Éditeur du site */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <BuildingOfficeIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Éditeur du site</h2>
                <div className="bg-gradient-to-br from-red-50 to-gray-50 dark:from-red-900/20 dark:to-gray-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                  <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="text-lg font-bold text-red-900 dark:text-red-300">FORMENAO SARL</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Société à Responsabilité Limitée</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Capital social</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">1 000 000 FCFA</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Siège social</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Tamdja, Bafoussam, Cameroun</p>
                      </div>
                    </div>

                    <div className="border-t border-red-200 dark:border-red-800 pt-4 mt-4 space-y-2">
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-32 flex-shrink-0">RCN :</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">CM-BXF-01-2025-B13-00091</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-32 flex-shrink-0">NUI :</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">M082517969111T</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-32 flex-shrink-0">Téléphones :</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">+237 691 59 28 82 / +237 678 61 36 53</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-32 flex-shrink-0">E-mail :</span>
                        <a href="mailto:formaneosarl@gmail.com" className="font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline">
                          formaneosarl@gmail.com
                        </a>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-32 flex-shrink-0">Site web :</span>
                        <a href="https://www.formaneo.site" className="font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline">
                          www.formaneo.site
                        </a>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mt-4 border border-red-200 dark:border-red-800">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Directeur de la publication</p>
                      <p className="font-bold text-gray-900 dark:text-white">Wabo Hervé</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Gérant de FORMENAO SARL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 - Hébergeur du site */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <GlobeAltIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Hébergeur du site</h2>
                <div className="bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900/50 dark:to-red-900/20 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">LWS (Ligne Web Services SAS)</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Société par Actions Simplifiée</p>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-32 flex-shrink-0">Adresse :</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">10 Rue Penthièvre, 75008 Paris, France</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-32 flex-shrink-0">Site web :</span>
                        <a href="https://www.lws.fr" target="_blank" rel="noopener noreferrer" className="font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline">
                          www.lws.fr
                        </a>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-32 flex-shrink-0">Téléphone :</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">+33 (0)1 77 62 30 03</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 - Propriété intellectuelle */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <ShieldCheckIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Propriété intellectuelle</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <p className="mb-4">
                    Tous les éléments du site <strong className="text-red-600 dark:text-red-400">www.formaneo.site</strong> (textes, images, vidéos, formations, logos, documents, interfaces, graphismes, sons, musiques, logiciels, bases de données, etc.) sont la propriété exclusive de <strong>FORMENAO SARL</strong> ou de ses partenaires.
                  </p>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded my-4">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Protection des droits d'auteur</p>
                    <p className="text-yellow-700 dark:text-yellow-400">
                      Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est strictement interdite, sauf autorisation écrite préalable de FORMENAO SARL.
                    </p>
                  </div>

                  <p className="mb-4">
                    Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
                  </p>

                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mt-4 border border-red-200 dark:border-red-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Marques et logos</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Les marques, logos, signes et tout autre contenu du site font l'objet d'une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d'auteur. L'utilisateur s'engage à ne pas utiliser ces éléments sans l'autorisation préalable et écrite de FORMENAO SARL.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 - Juridiction compétente */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <ScaleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Juridiction compétente</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <p className="mb-4">
                    Les présentes mentions légales sont régies par le droit camerounais.
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                      En cas de litige et à défaut d'accord amiable, le différend sera porté devant les tribunaux compétents du Cameroun, conformément aux règles de droit commun.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tout litige relatif à l'interprétation, la validité ou l'exécution des présentes mentions légales, ainsi qu'à l'utilisation du site www.formaneo.site, sera soumis à la juridiction des tribunaux camerounais compétents.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 - Politique de remboursement */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <CreditCardIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Politique de remboursement</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4 rounded">
                    <p className="font-semibold text-red-800 dark:text-red-300 mb-2">Aucun remboursement</p>
                    <p className="text-red-700 dark:text-red-400">
                      Toute activation de compte ou tout paiement effectué sur la plateforme Formaneo est <strong>définitif et non remboursable</strong>, sauf en cas d'erreur technique imputable directement à la plateforme.
                    </p>
                  </div>

                  <div className="mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Exceptions</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Un remboursement pourra être envisagé uniquement dans les cas suivants :
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                      <li>Erreur technique avérée imputable à la plateforme Formaneo</li>
                      <li>Double paiement pour un même service</li>
                      <li>Non-activation du compte suite à un paiement confirmé, après vérification technique</li>
                    </ul>
                  </div>

                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Toute demande de remboursement doit être adressée par écrit à l'adresse email : <a href="mailto:formaneosarl@gmail.com" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline">formaneosarl@gmail.com</a> avec les justificatifs nécessaires.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-10">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Pour toute question concernant ces mentions légales, veuillez nous contacter à : <a href="mailto:formaneosarl@gmail.com" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline">formaneosarl@gmail.com</a>
            </p>
            <div className="flex justify-center flex-wrap gap-4 text-sm">
              <Link
                to="/legal/terms-of-service"
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
              >
                Conditions d'utilisation
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                to="/legal/privacy-policy"
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
              >
                Politique de confidentialité
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                to="/"
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
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

export default LegalNotice;
