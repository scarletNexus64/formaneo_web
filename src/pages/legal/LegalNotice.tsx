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

const LegalNotice: React.FC = () => {
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
            <BuildingOfficeIcon className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Mentions Légales
            </h1>
          </div>
          <p className="mt-2 text-gray-600">Dernière mise à jour : 10 novembre 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">

          {/* Section 1 - Éditeur du site */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Éditeur du site</h2>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <p className="text-lg font-bold text-blue-900">FORMENAO SARL</p>
                      <p className="text-sm text-gray-600">Société à Responsabilité Limitée</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Capital social</p>
                        <p className="font-medium text-gray-800">1 000 000 FCFA</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Siège social</p>
                        <p className="font-medium text-gray-800">Tamdja, Bafoussam, Cameroun</p>
                      </div>
                    </div>

                    <div className="border-t border-blue-200 pt-4 mt-4 space-y-2">
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 uppercase w-32 flex-shrink-0">RCN :</span>
                        <span className="font-medium text-gray-800">CM-BXF-01-2025-B13-00091</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 uppercase w-32 flex-shrink-0">NUI :</span>
                        <span className="font-medium text-gray-800">M082517969111T</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 uppercase w-32 flex-shrink-0">Téléphones :</span>
                        <span className="font-medium text-gray-800">+237 691 59 28 82 / +237 678 61 36 53</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 uppercase w-32 flex-shrink-0">E-mail :</span>
                        <a href="mailto:formaneosarl@gmail.com" className="font-medium text-blue-600 hover:text-blue-700 underline">
                          formaneosarl@gmail.com
                        </a>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 uppercase w-32 flex-shrink-0">Site web :</span>
                        <a href="https://www.formaneo.site" className="font-medium text-blue-600 hover:text-blue-700 underline">
                          www.formaneo.site
                        </a>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 mt-4 border border-blue-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Directeur de la publication</p>
                      <p className="font-bold text-gray-900">Wabo Hervé</p>
                      <p className="text-sm text-gray-600">Gérant de FORMENAO SARL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 - Hébergeur du site */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <GlobeAltIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergeur du site</h2>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <p className="text-lg font-bold text-purple-900">LWS (Ligne Web Services SAS)</p>
                      <p className="text-sm text-gray-600">Société par Actions Simplifiée</p>
                    </div>

                    <div className="border-t border-purple-200 pt-4 mt-4 space-y-2">
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 uppercase w-32 flex-shrink-0">Adresse :</span>
                        <span className="font-medium text-gray-800">10 Rue Penthièvre, 75008 Paris, France</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 uppercase w-32 flex-shrink-0">Site web :</span>
                        <a href="https://www.lws.fr" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700 underline">
                          www.lws.fr
                        </a>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-gray-500 uppercase w-32 flex-shrink-0">Téléphone :</span>
                        <span className="font-medium text-gray-800">+33 (0)1 77 62 30 03</span>
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
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
                <div className="prose prose-blue max-w-none text-gray-700">
                  <p className="mb-4">
                    Tous les éléments du site <strong>www.formaneo.site</strong> (textes, images, vidéos, formations, logos, documents, interfaces, graphismes, sons, musiques, logiciels, bases de données, etc.) sont la propriété exclusive de <strong>FORMENAO SARL</strong> ou de ses partenaires.
                  </p>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded my-4">
                    <p className="font-semibold text-yellow-800 mb-2">Protection des droits d'auteur</p>
                    <p className="text-yellow-700">
                      Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est strictement interdite, sauf autorisation écrite préalable de FORMENAO SARL.
                    </p>
                  </div>

                  <p className="mb-4">
                    Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
                  </p>

                  <div className="bg-blue-50 rounded-lg p-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Marques et logos</h3>
                    <p className="text-gray-700">
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
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <ScaleIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Juridiction compétente</h2>
                <div className="prose prose-blue max-w-none text-gray-700">
                  <p className="mb-4">
                    Les présentes mentions légales sont régies par le droit camerounais.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <p className="font-medium text-gray-800 mb-3">
                      En cas de litige et à défaut d'accord amiable, le différend sera porté devant les tribunaux compétents du Cameroun, conformément aux règles de droit commun.
                    </p>
                    <p className="text-sm text-gray-600">
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
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <CreditCardIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Politique de remboursement</h2>
                <div className="prose prose-blue max-w-none text-gray-700">
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <p className="font-semibold text-red-800 mb-2">Aucun remboursement</p>
                    <p className="text-red-700">
                      Toute activation de compte ou tout paiement effectué sur la plateforme Formaneo est <strong>définitif et non remboursable</strong>, sauf en cas d'erreur technique imputable directement à la plateforme.
                    </p>
                  </div>

                  <div className="mt-4 bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Exceptions</h3>
                    <p className="text-gray-700 mb-2">
                      Un remboursement pourra être envisagé uniquement dans les cas suivants :
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li>Erreur technique avérée imputable à la plateforme Formaneo</li>
                      <li>Double paiement pour un même service</li>
                      <li>Non-activation du compte suite à un paiement confirmé, après vérification technique</li>
                    </ul>
                  </div>

                  <p className="mt-4 text-sm text-gray-600">
                    Toute demande de remboursement doit être adressée par écrit à l'adresse email : <a href="mailto:formaneosarl@gmail.com" className="text-blue-600 hover:text-blue-700 underline">formaneosarl@gmail.com</a> avec les justificatifs nécessaires.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 mt-10">
            <p className="text-sm text-gray-600 text-center mb-4">
              Pour toute question concernant ces mentions légales, veuillez nous contacter à : <a href="mailto:formaneosarl@gmail.com" className="text-blue-600 hover:text-blue-700 underline">formaneosarl@gmail.com</a>
            </p>
            <div className="flex justify-center flex-wrap gap-4 text-sm">
              <Link
                to="/legal/terms-of-service"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Conditions d'utilisation
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                to="/legal/privacy-policy"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Politique de confidentialité
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-700 underline"
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
