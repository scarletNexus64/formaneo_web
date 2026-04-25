import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  PlusIcon,
  EnvelopeOpenIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Navigation from '../../components/Navigation';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id: number;
  subject: string;
  content: string;
  sender_type: 'user' | 'admin';
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  admin?: {
    name: string;
  };
  withdrawal_request?: {
    id: number;
    amount: number;
    payment_method: string;
    status: string;
  };
}

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Formulaire de nouveau message
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) {
        setIsRefreshing(true);
      }

      const response = await fetch(`${(import.meta as any).env.VITE_API_URL}/api/v1/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
        setUnreadCount(data.unread_count);

        if (showRefreshToast) {
          toast.success('Messages actualisés');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message);

    // Marquer comme lu si c'est un message non lu de l'admin
    if (message.sender_type === 'admin' && !message.is_read) {
      try {
        await fetch(`${(import.meta as any).env.VITE_API_URL}/api/v1/messages/${message.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Recharger les messages pour mettre à jour le statut
        loadMessages();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) {
      return;
    }

    try {
      const response = await fetch(`${(import.meta as any).env.VITE_API_URL}/api/v1/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Message supprimé');
        setSelectedMessage(null);
        loadMessages();
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSubject.trim() || !newContent.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`${(import.meta as any).env.VITE_API_URL}/api/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          subject: newSubject,
          content: newContent
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Message envoyé avec succès');
        setShowComposeModal(false);
        setNewSubject('');
        setNewContent('');
        loadMessages();
      } else {
        toast.error(data.message || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-gray-900 dark:from-red-700 dark:to-black border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-3"
              >
                <EnvelopeIcon className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Courriels</h1>
                <p className="text-red-100 dark:text-red-200 mt-1">
                  {unreadCount > 0 ? `${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}` : 'Tous les messages lus'}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadMessages(true)}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 transition-all"
              >
                <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowComposeModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-all font-medium"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Nouveau</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des messages */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Messages</h2>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Chargement...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center">
                <EnvelopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Aucun message</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } ${!message.is_read && message.sender_type === 'admin' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {!message.is_read && message.sender_type === 'admin' && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                          )}
                          <p className={`text-sm truncate ${!message.is_read && message.sender_type === 'admin' ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {message.subject}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {message.sender_type === 'admin' ? `De: Admin` : 'Vous'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                      {message.sender_type === 'admin' && !message.is_read ? (
                        <EnvelopeIcon className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                      ) : (
                        <EnvelopeOpenIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contenu du message */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {selectedMessage ? (
              <>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{selectedMessage.sender_type === 'admin' ? 'De: Admin' : 'Vous'}</span>
                        <span>•</span>
                        <span>{formatDate(selectedMessage.created_at)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
                    {selectedMessage.content}
                  </pre>

                  {selectedMessage.withdrawal_request && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Demande de retrait associée
                      </h3>
                      <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <p>Montant: {selectedMessage.withdrawal_request.amount.toLocaleString('fr-FR')} FCFA</p>
                        <p>Méthode: {selectedMessage.withdrawal_request.payment_method.toUpperCase()}</p>
                        <p>Statut: <span className={`font-semibold ${
                          selectedMessage.withdrawal_request.status === 'completed' ? 'text-green-600' :
                          selectedMessage.withdrawal_request.status === 'rejected' ? 'text-red-600' :
                          selectedMessage.withdrawal_request.status === 'processing' ? 'text-orange-600' :
                          'text-gray-600'
                        }`}>
                          {selectedMessage.withdrawal_request.status === 'completed' ? 'Complété' :
                           selectedMessage.withdrawal_request.status === 'rejected' ? 'Rejeté' :
                           selectedMessage.withdrawal_request.status === 'processing' ? 'En cours' :
                           'En attente'}
                        </span></p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <EnvelopeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Sélectionnez un message pour le lire
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Nouveau Message */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Nouveau message</h2>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Objet
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Objet du message"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Votre message..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowComposeModal(false);
                    setNewSubject('');
                    setNewContent('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSending ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
