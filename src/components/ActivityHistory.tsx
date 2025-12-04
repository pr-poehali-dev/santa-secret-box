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
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/f8389ffb-4048-4cad-8f70-9c08e53f1d9a');
        const data = await response.json();
        const wishes = data.wishes || [];

        const recentActivities = wishes.slice(0, 10).map((w: any) => ({
          id: w.id,
          type: 'wish_created' as const,
          country: w.country,
          timestamp: w.timestamp,
        }));
        setActivities(recentActivities);

        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

        const todayWishes = wishes.filter((w: any) => w.timestamp >= oneDayAgo).length;
        const weekWishes = wishes.filter((w: any) => w.timestamp >= oneWeekAgo).length;

        setTodayCount(todayWishes);
        setWeekCount(weekWishes);
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    };

    loadActivities();
    const interval = setInterval(loadActivities, 5000);

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

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-christmas-red/10 border border-christmas-red/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🔥</span>
              <span className="text-xs text-muted-foreground">Сегодня</span>
            </div>
            <p className="text-2xl font-bold text-christmas-red">{todayCount}</p>
            <p className="text-xs text-muted-foreground mt-1">желаний</p>
          </div>
          
          <div className="bg-christmas-gold/10 border border-christmas-gold/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">📆</span>
              <span className="text-xs text-muted-foreground">За неделю</span>
            </div>
            <p className="text-2xl font-bold text-christmas-gold">{weekCount}</p>
            <p className="text-xs text-muted-foreground mt-1">желаний</p>
          </div>
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