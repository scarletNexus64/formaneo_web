import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Tilt from 'react-parallax-tilt';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

const predefinedFAQs: FAQ[] = [
  {
    question: "Comment puis-je m'inscrire ?",
    answer: "Pour vous inscrire, cliquez sur le bouton 'Commencer' ou 'Inscription gratuite' en haut de la page. Remplissez le formulaire avec vos informations et validez. Vous recevrez un bonus de bienvenue de 2 000 FCFA ! 🎉",
    category: "Inscription"
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "Nous acceptons Mobile Money (MTN Mobile Money et Orange Money), ainsi que les cartes bancaires. Tous les paiements sont sécurisés et cryptés. 💳",
    category: "Paiement"
  },
  {
    question: "Comment fonctionne le programme d'affiliation ?",
    answer: "Notre programme d'affiliation vous permet de gagner 2 000 FCFA pour chaque filleul direct (niveau 1) et 1 000 FCFA pour chaque filleul de vos filleuls (niveau 2). Sans limite ! 💰",
    category: "Affiliation"
  },
  {
    question: "Combien coûte l'accès aux formations ?",
    answer: "Nous proposons différents forfaits adaptés à vos besoins. L'inscription est gratuite et vous recevez 2 000 FCFA de bonus pour démarrer ! Consultez notre page tarifs pour plus de détails. 📚",
    category: "Tarifs"
  },
  {
    question: "Comment retirer mes gains d'affiliation ?",
    answer: "Vous pouvez demander un retrait dès que votre solde atteint 2 000 FCFA. Les retraits sont traités sous 24-48h via Mobile Money directement sur votre compte. ⚡",
    category: "Retrait"
  },
  {
    question: "Les certificats sont-ils reconnus ?",
    answer: "Oui ! Tous nos certificats sont professionnels et peuvent être ajoutés à votre CV ou profil LinkedIn. Ils attestent de vos compétences acquises. 🎓",
    category: "Certificats"
  },
  {
    question: "Puis-je accéder aux formations à vie ?",
    answer: "L'accès aux formations reste disponible tant que votre forfait est actif. Une fois renouvelé, vous pouvez continuer à apprendre à votre rythme. 📖",
    category: "Accès"
  },
  {
    question: "Comment contacter le support ?",
    answer: "Notre équipe est disponible 7j/7 ! Envoyez-nous un email à formaneosarl@gmail.com ou appelez au +237 678 613 653. Nous sommes là pour vous aider ! 💬",
    category: "Support"
  },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Bonjour ! 👋 Je suis l'assistant virtuel de Formaneo. Comment puis-je vous aider aujourd'hui ?",
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

    // Recherche dans les FAQs
    for (const faq of predefinedFAQs) {
      const keywords = faq.question.toLowerCase().split(' ');
      const matchCount = keywords.filter(keyword =>
        lowerMessage.includes(keyword) && keyword.length > 3
      ).length;

      if (matchCount >= 2) {
        return faq.answer;
      }
    }

    // Réponses basées sur des mots-clés
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      return "Bonjour ! 😊 Je suis ravi de vous aider. Vous pouvez me poser des questions sur l'inscription, les formations, l'affiliation ou tout autre sujet !";
    }

    if (lowerMessage.includes('merci')) {
      return "De rien ! C'est avec plaisir. N'hésitez pas si vous avez d'autres questions ! 😊";
    }

    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('coût')) {
      return "Nous proposons plusieurs forfaits adaptés à tous les budgets. L'inscription est gratuite avec un bonus de 2 000 FCFA ! Pour plus de détails sur nos tarifs, n'hésitez pas à nous contacter. 💰";
    }

    if (lowerMessage.includes('formation') || lowerMessage.includes('cours')) {
      return "Nous offrons plus de 500 formations dans divers domaines : développement web, marketing digital, design, business et bien plus ! Toutes nos formations incluent des certificats professionnels. 📚";
    }

    // Réponse par défaut
    return "Je n'ai pas trouvé de réponse précise à votre question. Voici quelques sujets sur lesquels je peux vous aider :\n\n• Inscription et compte\n• Modes de paiement\n• Programme d'affiliation\n• Certificats\n• Support technique\n\nOu contactez directement notre équipe au +237 678 613 653 ! 📞";
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
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-red-600 via-gray-900 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center group"
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
            <ChatBubbleLeftRightIcon className="w-8 h-8 relative z-10" />

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

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)]"
          >
            <Tilt
              tiltMaxAngleX={5}
              tiltMaxAngleY={5}
              glareEnable={true}
              glareMaxOpacity={0.1}
              scale={1}
              transitionSpeed={2000}
              className="h-full"
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
                      <h3 className="font-bold text-white">Assistant Formaneo</h3>
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
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.isUser
                            ? 'bg-gradient-to-r from-red-600 to-gray-900 text-white rounded-br-sm'
                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-sm shadow-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className={`text-xs mt-1 ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">Questions fréquentes :</p>
                      {predefinedFAQs.slice(0, 4).map((faq, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSuggestionClick(faq.question)}
                          className="w-full text-left bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-300 transition shadow-sm hover:shadow-md"
                        >
                          💡 {faq.question}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Posez votre question..."
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-800 dark:text-white placeholder-gray-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={inputValue.trim() === ''}
                      className="bg-gradient-to-r from-red-600 to-gray-900 text-white p-3 rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    Alimenté par l'IA Formaneo 🚀
                  </p>
                </div>
              </div>
            </Tilt>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
