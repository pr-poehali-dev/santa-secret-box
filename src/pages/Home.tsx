import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Icon from '@/components/ui/icon';
import Snowflakes from '@/components/Snowflakes';
import ActivityHistory from '@/components/ActivityHistory';

const Home = () => {
  const [wishCount, setWishCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCount = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/f8389ffb-4048-4cad-8f70-9c08e53f1d9a');
        const data = await response.json();
        setWishCount(data.wishes?.length || 0);
      } catch (error) {
        console.error('Failed to fetch wish count:', error);
      }
    };

    updateCount();
    const interval = setInterval(updateCount, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const newYear = new Date('2026-01-01T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = newYear - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Тайный Санта 🎅 - Исполни чужое желание или загадай своё!</title>
        <meta name="description" content={`${wishCount} желаний ждут исполнения! Присоединяйся к волшебству - напиши своё желание Санте или стань волшебником для кого-то. Вместе мы создадим настоящее новогоднее чудо ✨`} />
        <link rel="canonical" href="https://preview--santa-secret-box.poehali.dev/" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
        <Snowflakes />
        
        <div className="container mx-auto px-4 py-6 md:py-12 relative z-10">
        <header className="text-center mb-8 md:mb-16 animate-fade-in">
          <div className="inline-block mb-4 md:mb-6 animate-float">
            <span className="text-6xl md:text-8xl">🎅</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-christmas-red mb-3 md:mb-4 drop-shadow-lg px-4">
            Тайный Санта
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed mb-4 px-4">
            Волшебный год наступает! Давайте сделаем его особенным, даря радость незнакомцам
          </p>
          <div className="inline-flex items-center gap-2 bg-christmas-gold/20 border-2 border-christmas-gold/50 rounded-full px-4 md:px-6 py-2 md:py-3 animate-scale-in">
            <Icon name="Star" size={18} className="text-christmas-gold md:w-5 md:h-5" />
            <span className="text-sm md:text-lg font-semibold text-foreground">
              {wishCount} {wishCount === 1 ? 'желание' : wishCount < 5 ? 'желания' : 'желаний'} ждёт исполнения
            </span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto mb-8 md:mb-16">
          <div className="bg-card/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12 border-2 md:border-4 border-christmas-gold/30 animate-scale-in">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-christmas-red mb-3 md:mb-4">
                ✨ Как это работает? ✨
              </h2>
              <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                Присоединяйся к волшебству! Напиши своё желание Санте или исполни мечту другого человека. 
                Вместе мы создадим атмосферу настоящего новогоднего чуда, где каждый может стать волшебником для кого-то.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <Link to="/write-wish">
                <button className="w-full group relative overflow-hidden bg-gradient-to-br from-christmas-red to-christmas-red/80 hover:from-christmas-red/90 hover:to-christmas-red text-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative z-10">
                    <Icon name="Mail" size={40} className="mx-auto mb-3 md:mb-4 md:w-12 md:h-12" />
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-1 md:mb-2">Написать Желание</h3>
                    <p className="text-xs md:text-sm text-white/90">Расскажи Санте о своей мечте</p>
                  </div>
                </button>
              </Link>

              <Link to="/wishes">
                <button className="w-full group relative overflow-hidden bg-gradient-to-br from-christmas-gold to-christmas-gold/80 hover:from-christmas-gold/90 hover:to-christmas-gold text-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative z-10">
                    <Icon name="Gift" size={40} className="mx-auto mb-3 md:mb-4 md:w-12 md:h-12" />
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-1 md:mb-2">Исполнить Желание</h3>
                    <p className="text-xs md:text-sm text-white/90">Стань Сантой для кого-то</p>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-to-br from-christmas-red/10 to-christmas-gold/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 shadow-xl border-2 border-christmas-gold/40 animate-fade-in mb-6 md:mb-8">
          <div className="text-center">
            <div className="inline-block mb-3 md:mb-4">
              <span className="text-3xl md:text-4xl">⏰</span>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-christmas-red mb-4">
              До Нового года осталось:
            </h3>
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto">
              <div className="bg-card/90 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg border border-christmas-gold/30">
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-christmas-red mb-1 md:mb-2">
                  {timeLeft.days}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-semibold">
                  {timeLeft.days === 1 ? 'день' : timeLeft.days < 5 ? 'дня' : 'дней'}
                </div>
              </div>
              <div className="bg-card/90 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg border border-christmas-gold/30">
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-christmas-gold mb-1 md:mb-2">
                  {timeLeft.hours}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-semibold">
                  {timeLeft.hours === 1 ? 'час' : timeLeft.hours < 5 ? 'часа' : 'часов'}
                </div>
              </div>
              <div className="bg-card/90 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg border border-christmas-gold/30">
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-christmas-green mb-1 md:mb-2">
                  {timeLeft.minutes}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-semibold">
                  {timeLeft.minutes === 1 ? 'минута' : timeLeft.minutes < 5 ? 'минуты' : 'минут'}
                </div>
              </div>
              <div className="bg-card/90 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg border border-christmas-gold/30">
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-accent mb-1 md:mb-2">
                  {timeLeft.seconds}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-semibold">
                  {timeLeft.seconds === 1 ? 'секунда' : timeLeft.seconds < 5 ? 'секунды' : 'секунд'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-card/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 shadow-xl border border-border animate-fade-in mb-6 md:mb-8">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="text-3xl md:text-4xl mt-1 animate-float">🎄</div>
            <div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-christmas-red mb-2 md:mb-3">
                Присоединяйся к волшебству!
              </h3>
              <p className="text-sm md:text-lg text-foreground/80 leading-relaxed">
                Каждое исполненное желание делает мир добрее. Давайте вместе создадим настоящее новогоднее чудо 
                и подарим радость тем, кто в этом нуждается. Ведь настоящее волшебство начинается с нас!
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <ActivityHistory />
        </div>

        <div className="max-w-3xl mx-auto text-center pb-6 md:pb-8">
          <a
            href="https://t.me/tainiy_santas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-accent/90 hover:bg-accent text-white rounded-lg md:rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-sm md:text-base"
          >
            <Icon name="MessageCircle" size={18} className="md:w-5 md:h-5" />
            <span className="font-semibold">Наш Telegram канал</span>
            <Icon name="ExternalLink" size={14} className="md:w-4 md:h-4" />
          </a>
        </div>
      </div>
      </div>
    </>
  );
};

export default Home;