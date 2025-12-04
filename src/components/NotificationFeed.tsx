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
  const [shownIds, setShownIds] = useState<Set<number>>(new Set());
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const loadNotifications = () => {
      const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
      const recent = stored.slice(0, 6).filter((n: Notification) => !shownIds.has(n.id));
      setNotifications(recent);
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 500);

    return () => clearInterval(interval);
  }, [shownIds]);

  useEffect(() => {
    if (notifications.length === 0) return;
    if (currentNotification) return;

    const nextNotification = notifications[0];
    if (!nextNotification) return;

    setCurrentNotification(nextNotification);
    setVisible(true);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      
      setTimeout(() => {
        setShownIds((prev) => new Set([...prev, nextNotification.id]));
        setCurrentNotification(null);
      }, 300);
    }, 3000);

    return () => {
      clearTimeout(hideTimer);
    };
  }, [notifications, currentNotification, shownIds]);

  if (!currentNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`bg-card/95 backdrop-blur-md border-2 border-christmas-gold/50 rounded-xl p-4 shadow-2xl transition-all duration-300 ${
          visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3">
          {currentNotification.type === 'wish' ? (
            <>
              <span className="text-2xl">✨</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Кто-то из {currentNotification.country || 'страны'} загадал желание
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