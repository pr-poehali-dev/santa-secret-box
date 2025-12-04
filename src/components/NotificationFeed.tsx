import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Notification {
  id: number;
  type: 'wish' | 'santa';
  country?: string;
  timestamp: number;
}

const NotificationFeed = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const loadNotifications = () => {
      const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
      const recent = stored.slice(0, 6);
      setNotifications(recent);
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;

    setVisible(true);
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2700);

    const nextTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [currentIndex, notifications.length]);

  if (notifications.length === 0) return null;

  const current = notifications[currentIndex];
  if (!current) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`bg-card/95 backdrop-blur-md border-2 border-christmas-gold/50 rounded-xl p-4 shadow-2xl transition-all duration-300 ${
          visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3">
          {current.type === 'wish' ? (
            <>
              <span className="text-2xl">✨</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Кто-то из {current.country || 'страны'} загадал желание
                </p>
              </div>
              <Icon name="Sparkles" size={20} className="text-christmas-gold" />
            </>
          ) : (
            <>
              <span className="text-2xl">🎅</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Кто-то стал Тайным Сантой
                </p>
              </div>
              <Icon name="Gift" size={20} className="text-christmas-red" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationFeed;
