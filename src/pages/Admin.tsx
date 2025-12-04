import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Snowflakes from '@/components/Snowflakes';

interface Wish {
  id: number;
  wish: string;
  country: string;
  telegram: string;
  category?: string;
}

const ADMIN_PASSWORD = 'hjhawk228';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishToDelete, setWishToDelete] = useState<Wish | null>(null);
  const [selectedWishes, setSelectedWishes] = useState<Set<number>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadWishes();
    }
  }, []);

  const loadWishes = async () => {
    try {
      const [wishesRes, visitorsRes] = await Promise.all([
        fetch('https://functions.poehali.dev/f8389ffb-4048-4cad-8f70-9c08e53f1d9a'),
        fetch('https://functions.poehali.dev/5f9188b6-402c-4246-8a5e-f5de87370a31')
      ]);
      
      const wishesData = await wishesRes.json();
      const visitorsData = await visitorsRes.json();
      
      setWishes(wishesData.wishes || []);
      setVisitorCount(visitorsData.count || 0);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      loadWishes();
      toast({
        title: '✅ Доступ разрешён',
        description: 'Добро пожаловать в админ-панель',
      });
    } else {
      toast({
        title: '❌ Неверный пароль',
        description: 'Попробуйте ещё раз',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteWish = async () => {
    if (!wishToDelete) return;

    try {
      await fetch(`https://functions.poehali.dev/f8389ffb-4048-4cad-8f70-9c08e53f1d9a?id=${wishToDelete.id}`, {
        method: 'DELETE',
      });
      
      await loadWishes();
      setWishToDelete(null);

      toast({
        title: '🗑️ Желание удалено',
        description: 'Запись успешно удалена из системы',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить желание',
        variant: 'destructive',
      });
    }
  };

  const toggleWishSelection = (wishId: number) => {
    const newSelected = new Set(selectedWishes);
    if (newSelected.has(wishId)) {
      newSelected.delete(wishId);
    } else {
      newSelected.add(wishId);
    }
    setSelectedWishes(newSelected);
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedWishes).map(id =>
          fetch(`https://functions.poehali.dev/f8389ffb-4048-4cad-8f70-9c08e53f1d9a?id=${id}`, {
            method: 'DELETE',
          })
        )
      );
      
      await loadWishes();
      setSelectedWishes(new Set());
      setShowBulkDeleteDialog(false);

      toast({
        title: '🗑️ Желания удалены',
        description: `Удалено записей: ${selectedWishes.size}`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить желания',
        variant: 'destructive',
      });
    }
  };

  const selectAll = () => {
    setSelectedWishes(new Set(wishes.map(w => w.id)));
  };

  const deselectAll = () => {
    setSelectedWishes(new Set());
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('admin_auth');
    toast({
      title: 'Выход выполнен',
      description: 'До скорых встреч!',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden flex items-center justify-center">
        <Snowflakes />
        
        <div className="container mx-auto px-4 relative z-10 max-w-md">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-block mb-4 animate-float">
              <span className="text-6xl">🔐</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-christmas-red mb-4">
              Админ-панель
            </h1>
            <p className="text-base text-foreground/70">
              Введите пароль для доступа к модерации
            </p>
          </div>

          <Card className="bg-card/90 backdrop-blur-sm border-2 border-christmas-gold/30 animate-scale-in">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Пароль администратора
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Введите пароль"
                  className="border-2 focus:border-christmas-red"
                />
              </div>
              
              <Button
                onClick={handleLogin}
                className="w-full bg-christmas-red hover:bg-christmas-red/90"
              >
                <Icon name="LogIn" size={20} className="mr-2" />
                Войти
              </Button>

              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="w-full"
              >
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                На главную
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      <Snowflakes />
      
      <div className="container mx-auto px-4 py-6 md:py-12 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="hover:scale-105 transition-transform text-sm md:text-base"
          >
            <Icon name="ArrowLeft" size={18} className="mr-2 md:w-5 md:h-5" />
            На главную
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-sm md:text-base border-christmas-red/50 hover:bg-christmas-red/10"
          >
            <Icon name="LogOut" size={18} className="mr-2 md:w-5 md:h-5" />
            Выйти
          </Button>
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-4 animate-float">
            <span className="text-5xl md:text-6xl">⚙️</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-christmas-red mb-4 px-4">
            Панель модерации
          </h1>
          <p className="text-base md:text-lg text-foreground/70 px-4">
            Управление желаниями: {wishes.length} записей
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8 grid sm:grid-cols-2 gap-4">
          <Card className="bg-card/90 backdrop-blur-sm border-2 border-christmas-gold/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Users" size={24} className="text-christmas-red" />
                <h3 className="text-lg font-semibold text-foreground">Посетители</h3>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-christmas-red">{visitorCount}</p>
              <p className="text-sm text-muted-foreground mt-1">уникальных пользователей</p>
            </CardContent>
          </Card>

          <Card className="bg-card/90 backdrop-blur-sm border-2 border-christmas-gold/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Star" size={24} className="text-christmas-gold" />
                <h3 className="text-lg font-semibold text-foreground">Желания</h3>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-christmas-gold">{wishes.length}</p>
              <p className="text-sm text-muted-foreground mt-1">всего записей</p>
            </CardContent>
          </Card>
        </div>

        {wishes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📭</div>
            <p className="text-xl text-foreground/70">
              Нет желаний для модерации
            </p>
          </div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto mb-6 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={selectAll}
                  variant="outline"
                  size="sm"
                  className="text-sm"
                >
                  <Icon name="CheckSquare" size={16} className="mr-2" />
                  Выбрать все
                </Button>
                <Button
                  onClick={deselectAll}
                  variant="outline"
                  size="sm"
                  className="text-sm"
                  disabled={selectedWishes.size === 0}
                >
                  <Icon name="Square" size={16} className="mr-2" />
                  Снять выбор
                </Button>
              </div>
              
              {selectedWishes.size > 0 && (
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-muted-foreground">
                    Выбрано: {selectedWishes.size}
                  </span>
                  <Button
                    onClick={() => setShowBulkDeleteDialog(true)}
                    variant="destructive"
                    size="sm"
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить выбранные
                  </Button>
                </div>
              )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
              {wishes.map((wishItem) => (
                <Card
                  key={wishItem.id}
                  className={`border-2 animate-scale-in bg-card/90 backdrop-blur-sm transition-all ${
                    selectedWishes.has(wishItem.id)
                      ? 'border-christmas-red ring-2 ring-christmas-red/50'
                      : 'border-christmas-gold/30'
                  }`}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-end mb-2">
                      <button
                        onClick={() => toggleWishSelection(wishItem.id)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        {selectedWishes.has(wishItem.id) ? (
                          <Icon name="CheckSquare" size={20} className="text-christmas-red" />
                        ) : (
                          <Icon name="Square" size={20} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  <div className="flex items-start justify-between gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Icon name="MapPin" size={14} className="text-christmas-red md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm font-semibold text-christmas-red">
                        {wishItem.country}
                      </span>
                    </div>
                    {wishItem.category && (
                      <span className="text-xl md:text-2xl">
                        {wishItem.category === 'material' && '🎁'}
                        {wishItem.category === 'help' && '🤝'}
                        {wishItem.category === 'communication' && '💬'}
                        {wishItem.category === 'experience' && '✨'}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-3 line-clamp-3">
                    {truncateText(wishItem.wish, 100)}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4 text-xs md:text-sm text-muted-foreground">
                    <Icon name="User" size={14} />
                    <span>{wishItem.telegram}</span>
                  </div>

                    <Button
                      onClick={() => setWishToDelete(wishItem)}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить желание
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog open={showBulkDeleteDialog} onOpenChange={() => setShowBulkDeleteDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-destructive flex items-center gap-2">
              <Icon name="AlertTriangle" size={28} />
              Массовое удаление
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              Вы уверены, что хотите удалить {selectedWishes.size} {selectedWishes.size === 1 ? 'желание' : selectedWishes.size < 5 ? 'желания' : 'желаний'}? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBulkDeleteDialog(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="flex-1"
            >
              <Icon name="Trash2" size={20} className="mr-2" />
              Да, удалить все
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!wishToDelete} onOpenChange={() => setWishToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-destructive flex items-center gap-2">
              <Icon name="AlertTriangle" size={28} />
              Подтверждение удаления
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              Вы уверены, что хотите удалить это желание? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          
          {wishToDelete && (
            <div className="bg-muted/50 rounded-lg p-4 my-4">
              <p className="text-sm text-foreground/80">
                <strong>Страна:</strong> {wishToDelete.country}
              </p>
              <p className="text-sm text-foreground/80 mt-2">
                <strong>Желание:</strong> {truncateText(wishToDelete.wish, 100)}
              </p>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setWishToDelete(null)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWish}
              className="flex-1"
            >
              <Icon name="Trash2" size={20} className="mr-2" />
              Да, удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;