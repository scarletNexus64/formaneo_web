import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UsersIcon,
  BookOpenIcon,
  TrophyIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import PublicNavigation from '../../components/PublicNavigation';

const TermsOfService: React.FC = () => {
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
            <DocumentTextIcon className="w-10 h-10 text-white mr-4" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Conditions Générales d'Utilisation (CGU)
              </h1>
              <p className="mt-2 text-white/80">Dernière mise à jour : 10 novembre 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">

          {/* Section 1 */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">1</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Objet</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <p className="mb-4">
                    Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités d'accès et d'utilisation du site web <strong className="text-red-600 dark:text-red-400">www.formaneo.site</strong>, exploité par <strong>FORMENAO SARL</strong>, société spécialisée dans la formation en ligne et les services éducatifs numériques.
                  </p>
                  <p className="mb-4">La plateforme Formaneo propose :</p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>des formations interactives, dont certaines sont sous droits PLR (Private Label Rights),</li>
                    <li>des ebooks éducatifs,</li>
                    <li>des quiz pédagogiques,</li>
                    <li>des certificats internes,</li>
                    <li>un programme d'affiliation à deux niveaux, fondé sur l'activation réelle des comptes utilisateurs.</li>
                  </ul>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                      Formaneo n'est ni un jeu d'argent, ni un système pyramidal (Ponzi), ni un MLM.
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-400 mt-2">
                      Toutes les activités reposent sur des activations de compte réelles et renouvelables, donnant accès à des contenus pédagogiques.
                    </p>
                  </div>
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
                  <UsersIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Inscription et activation du compte
                </h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>L'accès au site Formaneo nécessite la création d'un compte utilisateur.</li>
                    <li>Pour bénéficier des services et contenus, le compte doit être activé.</li>
                    <li>Le coût de l'activation est fixé à <strong className="text-red-600 dark:text-red-400">5 500 FCFA</strong>, valable pour une durée d'un (1) mois, renouvelable à tout moment.</li>
                    <li>Le prix d'activation est modifiable par Formaneo, avec information préalable publiée sur le site.</li>
                    <li>Une fois activé, l'utilisateur dispose d'un accès complet et illimité aux formations, ebooks, quiz et fonctionnalités éducatives de Formaneo pendant la période d'activation.</li>
                    <li>L'utilisateur s'engage à fournir des informations exactes lors de son inscription et à ne pas partager ses identifiants avec des tiers.</li>
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
                  <BookOpenIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Formations et ebooks
                </h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Les formations et ebooks sont des contenus numériques accessibles uniquement aux comptes activés.</li>
                    <li>Certaines formations peuvent être fournies sous droits PLR, permettant leur réutilisation interne selon les droits acquis.</li>
                    <li>Les paiements d'activation ou de renouvellement se font exclusivement via des passerelles de paiement sécurisées (CinetPay, Mobile Money, ou toute autre solution agréée).</li>
                    <li>L'accès aux contenus est maintenu tant que le compte reste activé et en règle.</li>
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrophyIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Quiz éducatifs et récompenses
                </h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">Nature des quiz</h3>
                  <p className="mb-4">
                    Les quiz disponibles sur Formaneo ont pour unique objectif l'apprentissage et la consolidation des connaissances. Ils ne comportent aucun élément de hasard ni mise d'argent.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">Récompenses éducatives</h3>
                  <p className="mb-4">
                    Les utilisateurs peuvent recevoir des récompenses pédagogiques pour leurs performances aux quiz, afin de stimuler leur progression.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">Conditions d'accès aux récompenses</h3>
                  <p className="mb-4">
                    Les récompenses, bourses ou commissions deviennent accessibles uniquement après activation réelle du compte. Aucun gain n'est dû sans activation effective.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">Finalité éducative</h3>
                  <p>
                    Les quiz et récompenses sont des mécanismes de motivation, et non un moyen de générer des revenus garantis.
                  </p>
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
                  <UsersIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Programme d'affiliation
                </h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Formaneo propose un programme d'affiliation à deux (2) niveaux, accessible uniquement aux comptes activés.</li>
                    <li>Ce programme repose sur la recommandation réelle et l'activation effective des filleuls.</li>
                    <li>Les commissions sont calculées comme suit :
                      <ul className="list-circle pl-6 mt-2 space-y-1">
                        <li><strong className="text-red-600 dark:text-red-400">Niveau 1 :</strong> 2 000 FCFA pour chaque filleul ayant activé son compte.</li>
                        <li><strong className="text-red-600 dark:text-red-400">Niveau 2 :</strong> 1 000 FCFA pour chaque filleul de niveau 2 ayant activé son compte.</li>
                      </ul>
                    </li>
                    <li>Les commissions d'affiliation sont versées uniquement après confirmation du paiement d'activation du filleul.</li>
                    <li className="text-red-600 dark:text-red-400 font-semibold">Toute tentative de fraude, d'inscription multiple ou de manipulation des liens d'affiliation entraînera la suspension immédiate du compte concerné.</li>
                  </ul>
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
                  <CreditCardIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Bonus de bienvenue et crédits internes
                </h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Après activation, chaque utilisateur reçoit un bonus de bienvenue de <strong className="text-red-600 dark:text-red-400">2 000 FCFA</strong>, sous forme de crédit interne Formaneo.</li>
                    <li>Ce bonus n'est attribué que si une activation réelle a eu lieu.</li>
                    <li>Les crédits internes (bonus, bourses, commissions) sont affichés sur le tableau de bord utilisateur, mais ne sont pas assimilables à de l'argent liquide disponible immédiatement.</li>
                    <li>Les montants cumulés ne deviennent retirables qu'à partir du seuil unique de retrait défini ci-dessous.</li>
                  </ul>
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Retraits et seuil de retrait</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Le seuil unique de retrait est fixé à <strong className="text-red-600 dark:text-red-400">2 000 FCFA</strong>.</li>
                    <li>Les retraits ne sont possibles que pour les comptes activés et dès que le solde cumulé atteint le seuil minimal.</li>
                    <li>Les paiements s'effectuent via les moyens disponibles (Mobile Money, Flutterwave, CinetPay ou autres solutions approuvées).</li>
                    <li>Aucun gain ni retrait n'est garanti sans respect des conditions d'activation.</li>
                  </ul>
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Certificats et bourses</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Les certificats délivrés par Formaneo sont internes à la plateforme et ne constituent pas une certification officielle reconnue par un organisme externe.</li>
                    <li>Les bourses ou primes éducatives sont liées à la participation active et à l'activation réelle du compte.</li>
                  </ul>
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ShieldCheckIcon className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                  Responsabilité
                </h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Formaneo ne saurait être tenu responsable des pertes financières ou matérielles résultant d'une mauvaise utilisation du site.</li>
                    <li>La société s'engage à fournir des contenus éducatifs de qualité, mais ne garantit aucun revenu, résultat financier ou promesse de gain.</li>
                    <li>Les utilisateurs restent seuls responsables de leurs décisions et de l'usage qu'ils font des informations et services du site.</li>
                  </ul>
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Protection des données personnelles</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Formaneo collecte et traite les données personnelles conformément à la <Link to="/legal/privacy-policy" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline">politique de confidentialité</Link> disponible sur le site.</li>
                    <li>Les données sont utilisées exclusivement pour le bon fonctionnement des services (formation, affiliation, paiements).</li>
                    <li>Conformément aux réglementations en vigueur, chaque utilisateur dispose d'un droit d'accès, de rectification et de suppression de ses données.</li>
                  </ul>
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Modifications des CGU</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Formaneo se réserve le droit de modifier les présentes CGU à tout moment.</li>
                    <li>Toute modification sera publiée sur le site et prendra effet immédiatement.</li>
                    <li>L'utilisation continue du site après publication vaut acceptation des nouvelles conditions.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 12 - Mentions légales */}
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 dark:text-red-400 font-bold">12</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mentions légales</h2>
                <div className="prose prose-red max-w-none text-gray-700 dark:text-gray-300">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Éditeur du site :</h3>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                      <li><strong>FORMENAO SARL</strong></li>
                      <li>Société à Responsabilité Limitée au capital de 1 000 000 FCFA</li>
                      <li>Siège social : Tamdja, Bafoussam, Cameroun</li>
                      <li>RCN : CM-BXF-01-2025-B13-00091</li>
                      <li>Numéro de contribuable / NUI : M082517969111T</li>
                      <li>Téléphones : +237 691 59 28 82 / +237 678 61 36 53</li>
                      <li>E-mail : formaneosarl@gmail.com</li>
                      <li>Site web : www.formaneo.site</li>
                      <li>Directeur de la publication : Wabo Hervé (Gérant de FORMENAO SARL)</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Hébergeur du site :</h3>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                      <li><strong>LWS (Ligne Web Services SAS)</strong></li>
                      <li>10 Rue Penthièvre, 75008 Paris, France</li>
                      <li>Site web : www.lws.fr</li>
                      <li>Téléphone : +33 (0)1 77 62 30 03</li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">Propriété intellectuelle</h3>
                  <p className="mb-4">
                    Tous les éléments du site (textes, images, vidéos, formations, logos, documents, interfaces, etc.) sont la propriété exclusive de FORMENAO SARL ou de ses partenaires. Toute reproduction, diffusion ou utilisation non autorisée est strictement interdite.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">Juridiction compétente</h3>
                  <p className="mb-4">
                    Tout litige relatif à l'interprétation ou à l'exécution des présentes CGU est soumis aux tribunaux compétents du Cameroun.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">Politique de remboursement</h3>
                  <p>
                    Toute activation de compte ou tout paiement effectué sur Formaneo est définitif et non remboursable, sauf erreur technique imputable à la plateforme.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-10">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              En utilisant le site Formaneo, vous acceptez l'ensemble de ces conditions générales d'utilisation.
            </p>
            <div className="flex justify-center mt-4 space-x-4">
              <Link
                to="/legal/privacy-policy"
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm underline"
              >
                Politique de confidentialité
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

export default TermsOfService;
