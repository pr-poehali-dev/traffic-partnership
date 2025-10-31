import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Lead {
  id: number;
  client_name: string;
  client_phone: string;
  client_email: string;
  project_address: string;
  estimate_amount: number;
  status: string;
  commission_amount: number;
  notes: string;
  created_at: string;
}

interface Statistics {
  total_leads: number;
  approved_leads: number;
  total_commission: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    total_leads: 0,
    approved_leads: 0,
    total_commission: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const partnerData = localStorage.getItem('partner');
    if (!partnerData) {
      navigate('/login');
      return;
    }

    const parsedPartner = JSON.parse(partnerData);
    setPartner(parsedPartner);

    fetchLeads(parsedPartner.id);
  }, [navigate]);

  const fetchLeads = async (partnerId: number) => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/f84da5a5-d817-45a3-b926-d3e064fe8e7a?partner_id=${partnerId}`
      );
      const data = await response.json();

      if (data.success) {
        setLeads(data.leads);
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('partner');
    localStorage.removeItem('session_token');
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      new: { label: 'Новый', className: 'bg-blue-100 text-blue-800' },
      in_review: { label: 'На рассмотрении', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Одобрен', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Отклонен', className: 'bg-red-100 text-red-800' },
      completed: { label: 'Завершен', className: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

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
            <span className="font-heading font-bold text-xl text-primary-foreground">Дом Сократа</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-primary-foreground/80 hidden sm:inline">
              {partner?.name}
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
            Личный кабинет партнера
          </h1>
          <p className="text-primary/70">Отслеживайте свои лиды и доходы</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-primary/10 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Users" size={24} className="text-accent" />
              </div>
              <p className="text-sm text-primary/70 mb-1">Всего лидов</p>
              <p className="font-heading font-bold text-4xl text-primary">{statistics.total_leads}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="CheckCircle" size={24} className="text-green-600" />
              </div>
              <p className="text-sm text-primary/70 mb-1">Одобрено</p>
              <p className="font-heading font-bold text-4xl text-primary">{statistics.approved_leads}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Wallet" size={24} className="text-accent" />
              </div>
              <p className="text-sm text-primary/70 mb-1">Заработано</p>
              <p className="font-heading font-bold text-4xl text-accent">
                {statistics.total_commission.toLocaleString('ru-RU')} ₽
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-primary/10 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-primary">Мои лиды</CardTitle>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Inbox" size={64} className="text-primary/20 mx-auto mb-4" />
                <p className="text-primary/70 text-lg">У вас пока нет лидов</p>
                <p className="text-primary/50 text-sm mt-2">
                  Привлекайте клиентов и отслеживайте их здесь
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className="p-4 border-2 border-primary/10 rounded-lg hover:border-accent/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-primary">{lead.client_name}</h3>
                          {getStatusBadge(lead.status)}
                        </div>
                        <div className="space-y-1 text-sm text-primary/70">
                          <p className="flex items-center gap-2">
                            <Icon name="Phone" size={16} />
                            {lead.client_phone}
                          </p>
                          {lead.client_email && (
                            <p className="flex items-center gap-2">
                              <Icon name="Mail" size={16} />
                              {lead.client_email}
                            </p>
                          )}
                          {lead.project_address && (
                            <p className="flex items-center gap-2">
                              <Icon name="MapPin" size={16} />
                              {lead.project_address}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-primary/70 mb-1">Смета проекта</p>
                        <p className="font-heading font-bold text-xl text-primary">
                          {lead.estimate_amount.toLocaleString('ru-RU')} ₽
                        </p>
                        {lead.commission_amount > 0 && (
                          <p className="text-sm text-accent font-semibold mt-1">
                            Ваш доход: {lead.commission_amount.toLocaleString('ru-RU')} ₽
                          </p>
                        )}
                        <p className="text-xs text-primary/50 mt-2">
                          {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    {lead.notes && (
                      <div className="mt-3 pt-3 border-t border-primary/10">
                        <p className="text-sm text-primary/70">
                          <strong>Примечание:</strong> {lead.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
