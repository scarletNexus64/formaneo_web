import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  StarIcon,
  PlayIcon,
  GlobeAltIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: "Formations Complètes",
      description: "Accédez à des centaines de cours vidéo de qualité professionnelle"
    },
    {
      icon: <CurrencyDollarIcon className="w-8 h-8" />,
      title: "Système de Cashback",
      description: "Gagnez de l'argent en complétant vos formations"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Programme d'Affiliation",
      description: "Parrainez vos amis et gagnez des commissions"
    },
    {
      icon: <BookOpenIcon className="w-8 h-8" />,
      title: "E-books Premium",
      description: "Bibliothèque complète de livres numériques"
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Paiement Mobile Money",
      description: "Payez facilement avec MTN, Moov ou Wave"
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Suivi de Progression",
      description: "Suivez votre évolution et obtenez des certificats"
    }
  ];

  const testimonials = [
    {
      name: "Jean-Paul K.",
      role: "Développeur Web",
      content: "Formaneo m'a permis d'acquérir de nouvelles compétences tout en gagnant de l'argent. Le système de cashback est génial !",
      rating: 5
    },
    {
      name: "Marie T.",
      role: "Entrepreneure",
      content: "Les formations sont de très haute qualité. J'ai pu développer mon business grâce aux connaissances acquises.",
      rating: 5
    },
    {
      name: "Ahmed B.",
      role: "Étudiant",
      content: "Le programme d'affiliation m'aide à financer mes études. Je recommande vivement Formaneo !",
      rating: 5
    }
  ];

  const stats = [
    { value: "10,000+", label: "Étudiants actifs" },
    { value: "500+", label: "Formations disponibles" },
    { value: "98%", label: "Taux de satisfaction" },
    { value: "5M FCFA", label: "Cashback distribué" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Formaneo</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 transition">Fonctionnalités</a>
              <a href="#courses" className="text-gray-700 hover:text-primary-600 transition">Formations</a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary-600 transition">Témoignages</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition">Tarifs</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                Connexion
              </Link>
              <Link to="/register" className="btn-primary">
                Commencer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Apprenez, Progressez et <span className="text-primary-600">Gagnez de l'Argent</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                La première plateforme e-learning africaine qui vous récompense pour votre apprentissage. 
                Accédez à des milliers de formations et gagnez du cashback à chaque cours complété.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center"
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Commencer maintenant
                </button>
                <button className="bg-white border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-primary-50 transition">
                  Voir les formations
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold">+10,000 étudiants</p>
                  <p className="text-sm text-gray-600">nous font déjà confiance</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
                  alt="Students learning"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Certificat gratuit</p>
                      <p className="text-sm text-gray-600">À la fin de chaque formation</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Cashback garanti</p>
                      <p className="text-sm text-gray-600">Jusqu'à 50% remboursé</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-primary-100 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Formaneo ?
            </h2>
            <p className="text-xl text-gray-600">
              Une plateforme complète pour votre développement personnel et professionnel
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Commencez votre parcours d'apprentissage en 4 étapes simples
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Inscrivez-vous", desc: "Créez votre compte gratuitement et recevez 1000 FCFA de bonus" },
              { step: 2, title: "Choisissez vos formations", desc: "Parcourez notre catalogue et sélectionnez vos cours" },
              { step: 3, title: "Apprenez à votre rythme", desc: "Suivez les vidéos et complétez les modules" },
              { step: 4, title: "Gagnez du cashback", desc: "Recevez de l'argent pour chaque formation complétée" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <svg className="w-8 h-8 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos étudiants
            </h2>
            <p className="text-xl text-gray-600">
              Plus de 10,000 étudiants nous font confiance
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à transformer votre vie ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez des milliers d'étudiants qui apprennent et gagnent avec Formaneo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Inscription gratuite
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition">
              Voir la démo
            </button>
          </div>
          <p className="text-primary-100 mt-6">
            <CheckCircleIcon className="w-5 h-5 inline mr-2" />
            Pas de carte bancaire requise • 5 quiz gratuits • Bonus de bienvenue 1000 FCFA
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Formaneo</h3>
              <p className="text-gray-400">
                La plateforme e-learning qui vous récompense pour votre apprentissage.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Formations</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Développement Web</a></li>
                <li><a href="#" className="hover:text-white transition">Marketing Digital</a></li>
                <li><a href="#" className="hover:text-white transition">Business</a></li>
                <li><a href="#" className="hover:text-white transition">Design</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">À propos</a></li>
                <li><a href="#" className="hover:text-white transition">Devenir formateur</a></li>
                <li><a href="#" className="hover:text-white transition">Affiliation</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Aide</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Conditions</a></li>
                <li><a href="#" className="hover:text-white transition">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Formaneo. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;