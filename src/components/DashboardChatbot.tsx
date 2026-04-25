import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

const predefinedFAQs: FAQ[] = [
  // Activation de compte
  {
    question: "Comment activer mon compte ?",
    answer: "Pour activer votre compte web, vous devez payer 5 000 FCFA via CinetPay ou FreeMoPay (USSD). L'activation dure 1 mois et vous donne accès à toutes les fonctionnalités. Les utilisateurs mobile sont activés automatiquement avec 2 000 FCFA de bonus ! 🎉",
    category: "Activation",
    keywords: ["activer", "compte", "activation", "payer", "5000", "cinetpay", "freemopay"]
  },
  {
    question: "Mon compte est-il actif ?",
    answer: "Vous pouvez vérifier l'état de votre compte dans votre profil. Si votre compte n'est pas actif, une bannière s'affiche en haut de la page vous invitant à l'activer. L'activation coûte 5 000 FCFA et dure 1 mois. 📱",
    category: "Activation",
    keywords: ["actif", "état", "vérifier", "bannière"]
  },

  // Quiz
  {
    question: "Comment fonctionnent les quiz ?",
    answer: "Vous avez droit à UNE SEULE tentative par quiz, alors préparez-vous bien ! 📚 Pour réussir, vous devez obtenir au moins 60% de bonnes réponses. En cas de réussite, vous recevrez une récompense directement dans votre portefeuille ! 💰",
    category: "Quiz",
    keywords: ["quiz", "test", "tentative", "réussir", "60%", "récompense"]
  },
  {
    question: "Puis-je refaire un quiz raté ?",
    answer: "Non, vous n'avez droit qu'à UNE seule tentative par quiz. Il est donc important de bien réviser avant de commencer ! Une fois le quiz terminé, vous ne pouvez plus le repasser. 🎯",
    category: "Quiz",
    keywords: ["refaire", "raté", "retenter", "deuxième chance"]
  },
  {
    question: "Quelle est la note de passage pour un quiz ?",
    answer: "Pour réussir un quiz et obtenir votre récompense, vous devez obtenir au moins 60% de bonnes réponses. Par exemple, si le quiz contient 10 questions, vous devez en réussir au moins 6. 📊",
    category: "Quiz",
    keywords: ["note", "passage", "60", "pourcent", "réussir"]
  },

  // Formations
  {
    question: "Comment accéder aux formations ?",
    answer: "Les formations sont organisées en packs. Chaque pack contient plusieurs formations, et chaque formation contient des vidéos. Vous pouvez acheter des packs dans la section 'Formations'. Une fois acheté, le contenu est accessible à vie ! 🎓",
    category: "Formations",
    keywords: ["formations", "cours", "vidéos", "packs", "accès"]
  },
  {
    question: "Est-ce que je reçois un certificat ?",
    answer: "Oui ! Après avoir terminé une formation, vous recevez automatiquement un certificat professionnel que vous pouvez télécharger et ajouter à votre CV ou LinkedIn. 🏆",
    category: "Formations",
    keywords: ["certificat", "diplôme", "attestation", "télécharger"]
  },
  {
    question: "Qu'est-ce que le cashback sur les formations ?",
    answer: "Certaines formations offrent un système de cashback. Après avoir terminé la formation, vous recevez un pourcentage du prix payé directement dans votre portefeuille ! C'est notre façon de vous récompenser pour votre engagement. 💸",
    category: "Formations",
    keywords: ["cashback", "remboursement", "retour", "argent"]
  },

  // E-books
  {
    question: "Comment fonctionnent les e-books ?",
    answer: "Nous proposons des e-books gratuits et payants. Vous pouvez les consulter en ligne ou les télécharger pour une lecture hors ligne. Tous vos achats sont sauvegardés dans votre bibliothèque personnelle. 📖",
    category: "E-books",
    keywords: ["ebook", "livre", "gratuit", "payant", "télécharger", "lire"]
  },
  {
    question: "Puis-je télécharger les e-books ?",
    answer: "Oui ! Tous les e-books que vous achetez peuvent être téléchargés pour une lecture hors ligne. Vous pouvez également les consulter directement en ligne depuis votre bibliothèque. 📱",
    category: "E-books",
    keywords: ["télécharger", "download", "hors ligne", "offline"]
  },

  // Affiliation
  {
    question: "Comment fonctionne le programme d'affiliation ?",
    answer: "Notre programme d'affiliation est sur 2 niveaux :\n\n• Niveau 1 (vos filleuls directs) : 1 000 FCFA par filleul\n• Niveau 2 (filleuls de vos filleuls) : 500 FCFA par filleul\n\nVous gagnez des commissions à l'activation de compte ET lors des achats de vos filleuls ! 💰",
    category: "Affiliation",
    keywords: ["affiliation", "parrainage", "commission", "filleul", "niveau", "1000", "500"]
  },
  {
    question: "Quand est-ce que je reçois mes commissions ?",
    answer: "Vous recevez vos commissions IMMÉDIATEMENT :\n• Lors de l'activation du compte de votre filleul\n• Lors de chaque achat effectué par vos filleuls\n\nL'argent est crédité directement dans votre portefeuille ! ⚡",
    category: "Affiliation",
    keywords: ["commission", "recevoir", "quand", "délai", "paiement"]
  },
  {
    question: "Comment partager mon lien d'affiliation ?",
    answer: "Rendez-vous dans la section 'Affiliation' de votre dashboard. Vous y trouverez votre lien de parrainage unique et votre code promo. Partagez-les sur les réseaux sociaux, par email ou SMS pour commencer à gagner ! 🚀",
    category: "Affiliation",
    keywords: ["partager", "lien", "code", "promo", "parrainage"]
  },

  // Portefeuille
  {
    question: "Comment retirer mes gains ?",
    answer: "Vous pouvez demander un retrait dès que votre solde atteint 1 000 FCFA. Le montant maximum par retrait est de 1 000 000 FCFA. Les retraits sont traités sous 24-48h via Mobile Money (MTN ou Orange Money). 💳",
    category: "Portefeuille",
    keywords: ["retrait", "retirer", "argent", "mobile money", "1000"]
  },
  {
    question: "Quel est mon solde actuel ?",
    answer: "Votre solde est affiché en haut à droite de votre dashboard. Il regroupe tous vos gains : commissions d'affiliation, récompenses de quiz, cashback, etc. Vous pouvez consulter l'historique détaillé dans la section 'Portefeuille'. 💰",
    category: "Portefeuille",
    keywords: ["solde", "balance", "argent", "gains"]
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "Nous acceptons :\n• Mobile Money (MTN Mobile Money, Orange Money)\n• CinetPay (pour les paiements web)\n• FreeMoPay (pour les paiements USSD)\n\nTous les paiements sont sécurisés et cryptés. 🔒",
    category: "Portefeuille",
    keywords: ["paiement", "mobile money", "cinetpay", "freemopay", "mtn", "orange"]
  },

  // Panier
  {
    question: "Comment fonctionne le panier ?",
    answer: "Vous pouvez ajouter plusieurs formations, e-books et produits dans votre panier. Les prix promotionnels sont appliqués automatiquement. Au moment du paiement, vos parrains reçoivent leurs commissions instantanément ! 🛒",
    category: "Panier",
    keywords: ["panier", "cart", "acheter", "paiement", "checkout"]
  },
  {
    question: "Y a-t-il des promotions ?",
    answer: "Oui ! De nombreux produits bénéficient de prix promotionnels. Le prix promo s'affiche automatiquement et remplace le prix normal lors de l'ajout au panier. Consultez régulièrement nos offres ! 🎁",
    category: "Panier",
    keywords: ["promotion", "promo", "réduction", "offre", "prix"]
  },

  // Compte
  {
    question: "Comment modifier mon profil ?",
    answer: "Rendez-vous dans 'Paramètres' ou 'Mon profil' via le menu en haut à droite. Vous pouvez y modifier vos informations personnelles, votre email, votre numéro de téléphone et votre mot de passe. 👤",
    category: "Compte",
    keywords: ["profil", "modifier", "email", "téléphone", "mot de passe"]
  },
  {
    question: "Comment réinitialiser mon mot de passe ?",
    answer: "Si vous avez oublié votre mot de passe, cliquez sur 'Mot de passe oublié ?' sur la page de connexion. Vous recevrez un lien par email ET SMS. Le lien est valable 1 heure. ⏰",
    category: "Compte",
    keywords: ["mot de passe", "réinitialiser", "oublié", "reset", "password"]
  },

  // Support
  {
    question: "Comment contacter le support ?",
    answer: "Notre équipe est disponible 7j/7 ! Vous pouvez nous contacter par :\n• Email : formaneosarl@gmail.com\n• Téléphone : +237 678 613 653\n\nNous répondons généralement sous 24h. 💬",
    category: "Support",
    keywords: ["support", "aide", "contact", "email", "téléphone", "help"]
  },
  {
    question: "Où trouver les CGU ?",
    answer: "Les Conditions Générales d'Utilisation (CGU) et les Mentions légales sont accessibles depuis le menu 'Informations légales' en bas de la barre latérale gauche. 📄",
    category: "Support",
    keywords: ["cgu", "conditions", "légal", "mentions"]
  }
];

const DashboardChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Bonjour ! 👋 Je suis votre assistant Formaneo. Comment puis-je vous aider aujourd'hui ?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findAnswer = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Recherche par mots-clés dans les FAQs
    for (const faq of predefinedFAQs) {
      const matchCount = faq.keywords.filter(keyword =>
        lowerMessage.includes(keyword.toLowerCase())
      ).length;

      if (matchCount >= 1) {
        return faq.answer;
      }
    }

    // Recherche dans les questions
    for (const faq of predefinedFAQs) {
      const questionWords = faq.question.toLowerCase().split(' ');
      const matchCount = questionWords.filter(word =>
        lowerMessage.includes(word) && word.length > 3
      ).length;

      if (matchCount >= 2) {
        return faq.answer;
      }
    }

    // Réponses basées sur des patterns
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return "Bonjour ! 😊 Je suis là pour vous aider avec vos questions sur Formaneo. N'hésitez pas à me demander des informations sur l'activation de compte, les formations, les quiz, l'affiliation ou le portefeuille !";
    }

    if (lowerMessage.includes('merci')) {
      return "De rien ! C'est un plaisir de vous aider. Si vous avez d'autres questions, je suis là ! 😊";
    }

    if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
      return "Je peux vous aider avec :\n• Activation de compte\n• Quiz et récompenses\n• Formations et certificats\n• E-books\n• Programme d'affiliation\n• Portefeuille et retraits\n• Panier et paiements\n\nQue souhaitez-vous savoir ? 🤔";
    }

    // Réponse par défaut avec suggestions
    return "Je n'ai pas trouvé de réponse précise à votre question. 🤔\n\nVoici les thèmes sur lesquels je peux vous aider :\n• Activation de compte (5 000 FCFA)\n• Quiz (1 tentative, 60% pour réussir)\n• Formations et certificats\n• E-books (gratuits et payants)\n• Affiliation (1 000 FCFA niveau 1)\n• Portefeuille et retraits (min 1 000 FCFA)\n\nOu contactez notre support : +237 678 613 653 📞";
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: messages.length,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowSuggestions(false);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 1,
        text: findAnswer(inputValue),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Suggestions initiales (top 6 questions les plus importantes)
  const topSuggestions = [
    predefinedFAQs[0], // Activation
    predefinedFAQs[2], // Quiz
    predefinedFAQs[9], // Affiliation
    predefinedFAQs[12], // Retrait
  ];

  return (
    <>
      {/* Chatbot Toggle Button - Adapté pour le dashboard */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-red-600 via-gray-900 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center group"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-red-400/30 rounded-full blur-lg"
            />
            <ChatBubbleLeftRightIcon className="w-7 h-7 sm:w-8 sm:h-8 relative z-10" />

            {/* Notification badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
            >
              !
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot Window - Responsive */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[calc(100vh-8rem)] sm:h-[600px] max-h-[calc(100vh-2rem)]"
          >
            <div className="h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 via-gray-900 to-purple-600 p-4 flex items-center justify-between relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                <div className="flex items-center gap-3 relative z-10">
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                    >
                      <SparklesIcon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base">Assistant Formaneo</h3>
                    <p className="text-xs text-white/80">En ligne • Répond en ~1s</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition relative z-10"
                >
                  <XMarkIcon className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-800/50">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                        message.isUser
                          ? 'bg-gradient-to-r from-red-600 to-gray-900 text-white rounded-br-sm'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-sm shadow-md'
                      }`}
                    >
                      <p className="text-xs sm:text-sm whitespace-pre-line break-words">{message.text}</p>
                      <p className={`text-[10px] sm:text-xs mt-1 ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Quick Suggestions */}
                {showSuggestions && messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2 sm:mb-3">Questions fréquentes :</p>
                    {topSuggestions.map((faq, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSuggestionClick(faq.question)}
                        className="w-full text-left bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition shadow-sm hover:shadow-md"
                      >
                        💡 {faq.question}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 sm:p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Posez votre question..."
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-gray-800 dark:text-white placeholder-gray-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={inputValue.trim() === ''}
                    className="bg-gradient-to-r from-red-600 to-gray-900 text-white p-2 sm:p-3 rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  Alimenté par l'IA Formaneo 🚀
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardChatbot;
