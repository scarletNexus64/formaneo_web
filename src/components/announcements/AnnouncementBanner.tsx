import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import announcementService from '../../services/announcement.service';
import { Announcement } from '../../types';

const AnnouncementBanner: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchUrgentAnnouncement();
  }, []);

  const fetchUrgentAnnouncement = async () => {
    try {
      const announcements = await announcementService.getUrgentAnnouncements();
      if (announcements.length > 0) {
        setAnnouncement(announcements[0]);
      }
    } catch (error) {
      console.error('Error fetching urgent announcements:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in localStorage to avoid showing again
    if (announcement) {
      localStorage.setItem(`announcement-dismissed-${announcement.id}`, 'true');
    }
  };

  // Check if announcement was already dismissed
  useEffect(() => {
    if (announcement) {
      const isDismissed = localStorage.getItem(`announcement-dismissed-${announcement.id}`);
      if (isDismissed) {
        setIsVisible(false);
      }
    }
  }, [announcement]);

  if (!announcement || !isVisible) {
    return null;
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-600';
      case 'warning':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-600';
      case 'danger':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className={`${getBackgroundColor(announcement.type)} text-white`}>
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <p className="ml-3 font-medium truncate">
              <span className="md:hidden">{announcement.title}</span>
              <span className="hidden md:inline">
                <strong>{announcement.title}:</strong> {announcement.content}
              </span>
            </p>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="-mr-1 flex p-2 rounded-md hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Fermer</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
