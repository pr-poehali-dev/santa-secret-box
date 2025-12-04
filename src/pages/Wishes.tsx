import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Snowflakes from '@/components/Snowflakes';

interface Wish {
  id: number;
  wish: string;
  country: string;
  telegram: string;
  category?: string;
}

const Wishes = () => {
  const navigate = useNavigate();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [showTelegram, setShowTelegram] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const wishesPerPage = 9;

  useEffect(() => {
    const storedWishes = JSON.parse(localStorage.getItem('wishes') || '[]');
    setWishes(storedWishes);
  }, []);

  const filteredWishes = filterCategory === 'all' 
    ? wishes 
    : wishes.filter(w => w.category === filterCategory);

  const indexOfLastWish = currentPage * wishesPerPage;
  const indexOfFirstWish = indexOfLastWish - wishesPerPage;
  const currentWishes = filteredWishes.slice(indexOfFirstWish, indexOfLastWish);
  const totalPages = Math.ceil(filteredWishes.length / wishesPerPage);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleShowTelegram = () => {
    setShowTelegram(true);
    
    if (selectedWish) {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const newNotification = {
        id: Date.now(),
        type: 'santa',
        timestamp: Date.now(),
      };
      localStorage.setItem('notifications', JSON.stringify([newNotification, ...notifications]));

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea384c', '#F97316', '#0EA5E9', '#22c55e'],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      <Snowflakes />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8 hover:scale-105 transition-transform"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>

        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-4 animate-float">
            <span className="text-6xl">🎁</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-christmas-red mb-4">
            Желания от людей
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Выбери желание, которое хочешь исполнить, и стань настоящим Сантой для кого-то!
          </p>
        </div>

        {wishes.length > 0 && (
          <div className="max-w-md mx-auto mb-8">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="border-2 border-christmas-gold/30 bg-card/90 backdrop-blur-sm">
                <SelectValue placeholder="Фильтр по категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🌟 Все категории</SelectItem>
                <SelectItem value="material">🎁 Материальное</SelectItem>
                <SelectItem value="help">🤝 Помощь</SelectItem>
                <SelectItem value="communication">💬 Общение</SelectItem>
                <SelectItem value="experience">✨ Эмоции</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {wishes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🎄</div>
            <p className="text-xl text-foreground/70 mb-6">
              Пока что нет желаний. Будь первым, кто добавит своё!
            </p>
            <Button
              onClick={() => navigate('/write-wish')}
              className="bg-christmas-red hover:bg-christmas-red/90"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить желание
            </Button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {currentWishes.map((wishItem) => (
              <Card
                key={wishItem.id}
                className="cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-christmas-gold/50 animate-scale-in bg-card/90 backdrop-blur-sm"
                onClick={() => setSelectedWish(wishItem)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} className="text-christmas-red" />
                      <span className="text-sm font-semibold text-christmas-red">
                        {wishItem.country}
                      </span>
                    </div>
                    {wishItem.category && (
                      <span className="text-2xl">
                        {wishItem.category === 'material' && '🎁'}
                        {wishItem.category === 'help' && '🤝'}
                        {wishItem.category === 'communication' && '💬'}
                        {wishItem.category === 'experience' && '✨'}
                      </span>
                    )}
                  </div>
                  <p className="text-foreground/80 leading-relaxed line-clamp-4">
                    {truncateText(wishItem.wish, 120)}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-christmas-red hover:text-christmas-red hover:bg-christmas-red/10"
                    >
                      Подробнее
                      <Icon name="ChevronRight" size={16} className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="hover:bg-christmas-red/10"
                >
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? "bg-christmas-red hover:bg-christmas-red/90" : "hover:bg-christmas-red/10"}
                  >
                    {pageNum}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="hover:bg-christmas-red/10"
                >
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={!!selectedWish} onOpenChange={() => { setSelectedWish(null); setShowTelegram(false); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-christmas-red flex items-center gap-2">
              <Icon name="Gift" size={28} />
              Желание от участника
            </DialogTitle>
          </DialogHeader>
          
          {selectedWish && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="MapPin" size={20} className="text-christmas-red" />
                <span className="font-semibold text-foreground">{selectedWish.country}</span>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 border-l-4 border-christmas-gold">
                <p className="text-lg leading-relaxed text-foreground">
                  {selectedWish.wish}
                </p>
              </div>

              {!showTelegram ? (
                <Button
                  onClick={handleShowTelegram}
                  className="w-full bg-gradient-to-r from-christmas-red to-christmas-red/80 hover:from-christmas-red/90 hover:to-christmas-red text-white py-6 text-lg shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <Icon name="MessageCircle" size={24} className="mr-2" />
                  Показать Telegram для связи
                </Button>
              ) : (
                <div className="bg-christmas-green/10 border-2 border-christmas-green rounded-xl p-6 animate-scale-in">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name="MessageCircle" size={24} className="text-christmas-green" />
                    <span className="text-lg font-semibold text-foreground">Telegram контакт:</span>
                  </div>
                  <a
                    href={`https://t.me/${selectedWish.telegram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl font-bold text-christmas-green hover:text-christmas-green/80 transition-colors flex items-center gap-2 group"
                  >
                    {selectedWish.telegram}
                    <Icon name="ExternalLink" size={20} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <p className="text-sm text-muted-foreground mt-3">
                    Свяжись с человеком и исполни его желание! 🎁
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wishes;