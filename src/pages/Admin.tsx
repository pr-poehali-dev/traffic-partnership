import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Partner {
  id: number;
  name: string;
  email: string;
  phone: string;
  traffic_source: string;
  experience: string;
  is_approved: boolean;
  created_at: string;
  leads_count: number;
  total_commission: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvalModal, setApprovalModal] = useState<{partnerId: number, name: string} | null>(null);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const partnerData = localStorage.getItem('partner');
    if (!partnerData) {
      navigate('/login');
      return;
    }

    const parsedPartner = JSON.parse(partnerData);
    if (!parsedPartner.is_admin) {
      navigate('/dashboard');
      return;
    }

    setAdmin(parsedPartner);
    fetchPartners(parsedPartner.id);
  }, [navigate]);

  const fetchPartners = async (adminId: number) => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/2d79683e-baac-45a9-badc-580ddb033645?admin_id=${adminId}`
      );
      const data = await response.json();

      if (data.success) {
        setPartners(data.partners);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('partner');
    localStorage.removeItem('session_token');
    navigate('/');
  };

  const handleApprove = async () => {
    if (!approvalModal || !password) return;
    setIsProcessing(true);

    try {
      const response = await fetch('https://functions.poehali.dev/2d79683e-baac-45a9-badc-580ddb033645', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': admin.email
        },
        body: JSON.stringify({
          partner_id: approvalModal.partnerId,
          password: password,
          action: 'approve'
        })
      });

      const data = await response.json();

      if (data.success) {
        setApprovalModal(null);
        setPassword('');
        fetchPartners(admin.id);
      }
    } catch (error) {
      console.error('Error approving partner:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (partnerId: number) => {
    if (!confirm('Вы уверены, что хотите отклонить эту заявку?')) return;
    setIsProcessing(true);

    try {
      const response = await fetch('https://functions.poehali.dev/2d79683e-baac-45a9-badc-580ddb033645', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': admin.email
        },
        body: JSON.stringify({
          partner_id: partnerId,
          action: 'reject'
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchPartners(admin.id);
      }
    } catch (error) {
      console.error('Error rejecting partner:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const approvedPartners = partners.filter(p => p.is_approved);
  const pendingPartners = partners.filter(p => !p.is_approved);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" size={48} className="text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/files/6f7e6700-6c19-4862-aa12-e73cd96bc7db.png" 
              alt="Дом Сократа" 
              className="h-10 w-auto"
            />
            <div>
              <span className="font-heading font-bold text-xl text-primary-foreground block">Дом Сократа</span>
              <span className="text-xs text-accent">Админ-панель</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-primary-foreground/80 hidden sm:inline">
              {admin?.name}
            </span>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Icon name="LogOut" size={18} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-2">
            Управление партнерами
          </h1>
          <p className="text-primary/70">Просмотр и управление заявками партнеров</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-primary/10 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Users" size={24} className="text-accent" />
              </div>
              <p className="text-sm text-primary/70 mb-1">Всего партнеров</p>
              <p className="font-heading font-bold text-4xl text-primary">{partners.length}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="CheckCircle" size={24} className="text-green-600" />
              </div>
              <p className="text-sm text-primary/70 mb-1">Активные</p>
              <p className="font-heading font-bold text-4xl text-primary">{approvedPartners.length}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Clock" size={24} className="text-yellow-600" />
              </div>
              <p className="text-sm text-primary/70 mb-1">На рассмотрении</p>
              <p className="font-heading font-bold text-4xl text-primary">{pendingPartners.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="pending">
              На рассмотрении ({pendingPartners.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Активные ({approvedPartners.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card className="border-2 border-primary/10 bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-primary">Новые заявки</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingPartners.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Inbox" size={64} className="text-primary/20 mx-auto mb-4" />
                    <p className="text-primary/70 text-lg">Нет новых заявок</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPartners.map((partner) => (
                      <div 
                        key={partner.id} 
                        className="p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-semibold text-lg text-primary">{partner.name}</h3>
                              <Badge className="bg-yellow-100 text-yellow-800">Ожидает</Badge>
                            </div>
                            <div className="space-y-2 text-sm text-primary/70">
                              <p className="flex items-center gap-2">
                                <Icon name="Mail" size={16} />
                                {partner.email}
                              </p>
                              <p className="flex items-center gap-2">
                                <Icon name="Phone" size={16} />
                                {partner.phone}
                              </p>
                              {partner.traffic_source && (
                                <p className="flex items-center gap-2">
                                  <Icon name="TrendingUp" size={16} />
                                  <strong>Источник трафика:</strong> {partner.traffic_source}
                                </p>
                              )}
                              {partner.experience && (
                                <div className="mt-2 p-3 bg-white rounded border border-primary/10">
                                  <p className="text-xs font-semibold text-primary mb-1">Опыт работы:</p>
                                  <p className="text-sm">{partner.experience}</p>
                                </div>
                              )}
                              <p className="text-xs text-primary/50 mt-2">
                                Подана: {new Date(partner.created_at).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setApprovalModal({partnerId: partner.id, name: partner.name})}
                              disabled={isProcessing}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Icon name="Check" size={18} className="mr-2" />
                              Одобрить
                            </Button>
                            <Button
                              onClick={() => handleReject(partner.id)}
                              disabled={isProcessing}
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Icon name="X" size={18} className="mr-2" />
                              Отклонить
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card className="border-2 border-primary/10 bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-primary">Активные партнеры</CardTitle>
              </CardHeader>
              <CardContent>
                {approvedPartners.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Users" size={64} className="text-primary/20 mx-auto mb-4" />
                    <p className="text-primary/70 text-lg">Пока нет активных партнеров</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedPartners.map((partner) => (
                      <div 
                        key={partner.id} 
                        className="p-4 border-2 border-primary/10 rounded-lg hover:border-accent/50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg text-primary">{partner.name}</h3>
                              <Badge className="bg-green-100 text-green-800">Активен</Badge>
                            </div>
                            <div className="space-y-1 text-sm text-primary/70">
                              <p className="flex items-center gap-2">
                                <Icon name="Mail" size={16} />
                                {partner.email}
                              </p>
                              <p className="flex items-center gap-2">
                                <Icon name="Phone" size={16} />
                                {partner.phone}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-primary/70 mb-1">Лидов привлечено</p>
                            <p className="font-heading font-bold text-2xl text-primary">{partner.leads_count}</p>
                            {partner.total_commission > 0 && (
                              <p className="text-sm text-accent font-semibold mt-1">
                                Выплачено: {partner.total_commission.toLocaleString('ru-RU')} ₽
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {approvalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="font-heading font-bold text-xl text-primary mb-4">
              Одобрение партнера
            </h3>
            <p className="text-primary/70 mb-4">
              Партнер: <strong>{approvalModal.name}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary mb-2">
                Установите пароль для входа <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:border-accent focus:outline-none"
                placeholder="Минимум 6 символов"
                autoFocus
              />
              <p className="text-xs text-primary/50 mt-1">
                Передайте этот пароль партнеру для первого входа
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleApprove}
                disabled={!password || password.length < 6 || isProcessing}
                className="bg-accent hover:bg-accent/90 text-primary font-semibold flex-1"
              >
                {isProcessing ? 'Обработка...' : 'Подтвердить'}
              </Button>
              <Button
                onClick={() => {
                  setApprovalModal(null);
                  setPassword('');
                }}
                variant="outline"
                disabled={isProcessing}
                className="border-primary/20"
              >
                Отмена
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;