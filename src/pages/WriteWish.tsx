import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Snowflakes from '@/components/Snowflakes';

const WriteWish = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wish, setWish] = useState('');
  const [country, setCountry] = useState('');
  const [telegram, setTelegram] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wish.trim() || !country.trim() || !telegram.trim()) {
      toast({
        title: 'Заполните все поля',
        description: 'Все поля обязательны для заполнения',
        variant: 'destructive',
      });
      return;
    }

    if (!telegram.startsWith('@')) {
      toast({
        title: 'Неверный формат Telegram',
        description: 'Ник должен начинаться с символа @',
        variant: 'destructive',
      });
      return;
    }

    setShowDialog(true);
  };

  const handleConfirmSubscription = () => {
    const wishData = {
      wish,
      country,
      telegram,
      id: Date.now(),
    };

    const existingWishes = JSON.parse(localStorage.getItem('wishes') || '[]');
    localStorage.setItem('wishes', JSON.stringify([...existingWishes, wishData]));

    toast({
      title: '✨ Желание отправлено!',
      description: 'Твоё письмо Санте получено. Надеемся, что оно исполнится!',
    });

    setShowDialog(false);
    navigate('/wishes');
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

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-block mb-4 animate-float">
              <span className="text-6xl">📝</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-christmas-red mb-4">
              Твоё письмо Санте
            </h1>
            <p className="text-lg text-foreground/70">
              Расскажи о своей мечте, и, возможно, она сбудется в этом году!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-christmas-gold/30 animate-scale-in">
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-foreground mb-3">
                  🎁 Какой подарок ты хочешь?
                </label>
                <Textarea
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Напиши своё желание здесь..."
                  className="min-h-[150px] text-base resize-none border-2 focus:border-christmas-red transition-colors"
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Будь искренним и честным в своём желании
                </p>
              </div>

              <div>
                <label className="block text-lg font-semibold text-foreground mb-3">
                  🌍 Твоя страна
                </label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Например: Россия, Казахстан..."
                  className="text-base border-2 focus:border-christmas-red transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-foreground mb-3">
                  💬 Telegram для связи
                </label>
                <Input
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@твой_ник"
                  className="text-base border-2 focus:border-christmas-red transition-colors"
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Через Telegram с тобой свяжется твой Тайный Санта
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-christmas-red to-christmas-red/80 hover:from-christmas-red/90 hover:to-christmas-red text-white text-lg py-6 rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Icon name="Send" size={24} className="mr-2" />
                Отправить желание
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-christmas-red flex items-center gap-2">
              <Icon name="Bell" size={28} />
              Подпишись на канал!
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              Для отправки желания необходимо подписаться на наш канал. 
              Там ты найдёшь много интересного о проекте "Тайный Санта" и узнаешь истории исполненных желаний!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3">
            <Button
              asChild
              className="w-full bg-accent hover:bg-accent/90 text-white"
            >
              <a href="https://t.me/tainiy_santas" target="_blank" rel="noopener noreferrer">
                <Icon name="ExternalLink" size={20} className="mr-2" />
                Подписаться на канал
              </a>
            </Button>
            <Button
              onClick={handleConfirmSubscription}
              className="w-full bg-christmas-red hover:bg-christmas-red/90"
            >
              <Icon name="Check" size={20} className="mr-2" />
              Я подписался
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="w-full"
            >
              Отмена
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WriteWish;