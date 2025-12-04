import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';

interface Activity {
  id: number;
  type: 'wish_created' | 'wish_fulfilled';
  country?: string;
  timestamp: number;
}

const ActivityHistory = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const loadActivities = () => {
      const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
      const recentActivities = stored.slice(0, 10).map((n: any) => ({
        id: n.id,
        type: n.type === 'wish' ? 'wish_created' : 'wish_fulfilled',
        country: n.country,
        timestamp: n.timestamp,
      }));
      setActivities(recentActivities);
    };

    loadActivities();
    const interval = setInterval(loadActivities, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return `${days} дн назад`;
  };

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-2 border-christmas-gold/30">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Activity" size={20} className="text-christmas-red" />
          <h3 className="text-lg md:text-xl font-display font-bold text-foreground">
            История активности
          </h3>
        </div>

        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Пока нет активности
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="mt-0.5">
                  {activity.type === 'wish_created' ? (
                    <span className="text-xl">✨</span>
                  ) : (
                    <span className="text-xl">🎅</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/90">
                    {activity.type === 'wish_created' ? (
                      <>
                        Загадали желание
                        {activity.country && ` из ${activity.country}`}
                      </>
                    ) : (
                      'Кто-то стал Тайным Сантой'
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityHistory;
