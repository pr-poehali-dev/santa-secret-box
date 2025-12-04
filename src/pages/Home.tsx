import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import Snowflakes from '@/components/Snowflakes';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-blue via-background to-christmas-snow relative overflow-hidden">
      <Snowflakes />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6 animate-float">
            <span className="text-8xl">🎅</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-christmas-red mb-4 drop-shadow-lg">
            Тайный Санта
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Волшебный год наступает! Давайте сделаем его особенным, даря радость незнакомцам
          </p>
        </header>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-christmas-gold/30 animate-scale-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-christmas-red mb-4">
                ✨ Как это работает? ✨
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Присоединяйся к волшебству! Напиши своё желание Санте или исполни мечту другого человека. 
                Вместе мы создадим атмосферу настоящего новогоднего чуда, где каждый может стать волшебником для кого-то.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/write-wish">
                <button className="w-full group relative overflow-hidden bg-gradient-to-br from-christmas-red to-christmas-red/80 hover:from-christmas-red/90 hover:to-christmas-red text-white rounded-2xl p-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative z-10">
                    <Icon name="Mail" size={48} className="mx-auto mb-4" />
                    <h3 className="text-2xl font-display font-bold mb-2">Написать Желание</h3>
                    <p className="text-sm text-white/90">Расскажи Санте о своей мечте</p>
                  </div>
                </button>
              </Link>

              <Link to="/wishes">
                <button className="w-full group relative overflow-hidden bg-gradient-to-br from-christmas-gold to-christmas-gold/80 hover:from-christmas-gold/90 hover:to-christmas-gold text-white rounded-2xl p-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative z-10">
                    <Icon name="Gift" size={48} className="mx-auto mb-4" />
                    <h3 className="text-2xl font-display font-bold mb-2">Исполнить Желание</h3>
                    <p className="text-sm text-white/90">Стань Сантой для кого-то</p>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-to-r from-christmas-blue/10 to-christmas-green/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="text-4xl mt-1 animate-float">🎄</div>
            <div>
              <h3 className="text-2xl font-display font-bold text-christmas-red mb-3">
                Присоединяйся к волшебству!
              </h3>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Каждое исполненное желание делает мир добрее. Давайте вместе создадим настоящее новогоднее чудо 
                и подарим радость тем, кто в этом нуждается. Ведь настоящее волшебство начинается с нас!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
