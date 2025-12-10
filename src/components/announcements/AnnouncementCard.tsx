import React from 'react';
import { Announcement } from '../../types';
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface AnnouncementCardProps {
  announcement: Announcement;
  onClick?: () => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, onClick }) => {
  // Get icon and color based on type
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'info':
        return {
          icon: InformationCircleIcon,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500',
          textColor: 'text-blue-900',
        };
      case 'warning':
        return {
          icon: ExclamationTriangleIcon,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          textColor: 'text-yellow-900',
        };
      case 'success':
        return {
          icon: CheckCircleIcon,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          textColor: 'text-green-900',
        };
      case 'danger':
        return {
          icon: XCircleIcon,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          textColor: 'text-red-900',
        };
      default:
        return {
          icon: InformationCircleIcon,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-500',
          textColor: 'text-gray-900',
        };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Urgent</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Importante</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Moyenne</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Basse</span>;
      default:
        return null;
    }
  };

  const styles = getTypeStyles(announcement.type);
  const Icon = styles.icon;

  return (
    <div
      className={`${styles.bgColor} ${styles.borderColor} border-l-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <Icon className={`h-6 w-6 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${styles.textColor}`}>{announcement.title}</h3>
            {getPriorityBadge(announcement.priority)}
          </div>
          <p className={`text-sm ${styles.textColor} opacity-90 line-clamp-2`}>
            {announcement.content}
          </p>
          {announcement.published_at && (
            <p className="text-xs text-gray-500 mt-2">
              Publié le {new Date(announcement.published_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      </div>
      {announcement.image_url && (
        <img
          src={announcement.image_url}
          alt={announcement.title}
          className="mt-3 rounded-lg w-full h-48 object-cover"
        />
      )}
    </div>
  );
};

export default AnnouncementCard;
