import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [estimateAmount, setEstimateAmount] = useState<number>(500000);
  const earnings = estimateAmount * 0.1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Hammer" size={28} className="text-accent" />
            <span className="font-heading font-bold text-xl">РемонтПартнер</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#conditions" className="text-sm hover:text-accent transition-colors">Условия</a>
            <a href="#stats" className="text-sm hover:text-accent transition-colors">Статистика</a>
            <a href="#materials" className="text-sm hover:text-accent transition-colors">Материалы</a>
            <a href="#contact" className="text-sm hover:text-accent transition-colors">Контакты</a>
          </nav>
          <Button className="bg-accent hover:bg-accent/90">
            Стать партнером
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20 px-4 py-2 text-sm font-semibold">
            Партнерская программа
          </Badge>
          <h1 className="font-heading font-extrabold text-5xl md:text-7xl mb-6 leading-tight">
            Зарабатывайте
            <span className="block text-accent mt-2">10% от сметы</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Привлекайте клиентов на ремонт квартир под ключ и получайте стабильный доход с каждого проекта
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8 py-6">
              <Icon name="Rocket" size={20} className="mr-2" />
              Начать зарабатывать
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Icon name="FileText" size={20} className="mr-2" />
              Подробнее
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          {[
            { icon: 'TrendingUp', title: 'До 50 000 ₽', desc: 'Средний доход с одного клиента' },
            { icon: 'Users', title: '500+ партнеров', desc: 'Уже работают с нами' },
            { icon: 'Clock', title: '24 часа', desc: 'Вывод средств на карту' },
          ].map((stat, idx) => (
            <Card key={idx} className="text-center border-2 hover:border-accent/50 transition-all hover:shadow-lg animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={stat.icon as any} size={32} className="text-accent" />
                </div>
                <h3 className="font-heading font-bold text-2xl mb-2">{stat.title}</h3>
                <p className="text-muted-foreground">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="conditions" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-center mb-4">
              Условия партнерства
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Прозрачные и честные условия для каждого партнера
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Percent" className="text-accent" />
                    Комиссия
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-accent/5 rounded-lg">
                    <span>Базовая ставка</span>
                    <span className="font-heading font-bold text-2xl text-accent">10%</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• От сметы на работы (без материалов)</p>
                    <p>• Выплата после подписания договора</p>
                    <p>• Дополнительные бонусы за объем</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="CreditCard" className="text-accent" />
                    Выплаты
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-accent/5 rounded-lg">
                    <span>Срок выплаты</span>
                    <span className="font-heading font-bold text-2xl text-accent">24ч</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• На банковскую карту любого банка</p>
                    <p>• Минимальная сумма вывода: 1 000 ₽</p>
                    <p>• Комиссия за перевод: 0%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calculator" className="text-accent" />
                  Калькулятор дохода
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="estimate" className="text-base mb-2 block">
                      Сумма сметы (₽)
                    </Label>
                    <Input
                      id="estimate"
                      type="number"
                      value={estimateAmount}
                      onChange={(e) => setEstimateAmount(Number(e.target.value))}
                      className="text-lg h-12"
                    />
                  </div>
                  <div className="p-6 bg-white rounded-xl border-2 border-accent/20">
                    <p className="text-muted-foreground mb-2">Ваш доход</p>
                    <p className="font-heading font-bold text-5xl text-accent">
                      {earnings.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[100000, 300000, 500000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setEstimateAmount(amount)}
                        className="p-3 rounded-lg border-2 hover:border-accent transition-colors"
                      >
                        <span className="text-sm text-muted-foreground block">Смета</span>
                        <span className="font-semibold">{(amount / 1000)}к</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="stats" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-center mb-12">
              Статистика и аналитика
            </h2>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="leads">Лиды</TabsTrigger>
                <TabsTrigger value="earnings">Доходы</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Всего лидов', value: '47', icon: 'Users', change: '+12%' },
                    { label: 'Конверсия', value: '34%', icon: 'TrendingUp', change: '+5%' },
                    { label: 'Средний чек', value: '450к', icon: 'DollarSign', change: '+8%' },
                    { label: 'Заработано', value: '153к', icon: 'Wallet', change: '+15%' },
                  ].map((metric, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <Icon name={metric.icon as any} size={20} className="text-muted-foreground" />
                          <Badge variant="secondary" className="text-xs">{metric.change}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                        <p className="font-heading font-bold text-3xl">{metric.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>График доходов</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-around gap-2">
                      {[45, 62, 58, 73, 85, 92, 88, 95, 102, 110, 125, 143].map((height, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full bg-accent/20 hover:bg-accent/40 rounded-t transition-all cursor-pointer"
                            style={{ height: `${(height / 143) * 100}%` }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][idx]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leads">
                <Card>
                  <CardHeader>
                    <CardTitle>Ваши лиды</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Иванов И.И.', status: 'Договор подписан', amount: '520 000', date: '28.10.2024' },
                        { name: 'Петрова М.А.', status: 'На согласовании', amount: '380 000', date: '29.10.2024' },
                        { name: 'Сидоров П.К.', status: 'Консультация', amount: '650 000', date: '30.10.2024' },
                      ].map((lead, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:border-accent transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                              <Icon name="User" size={20} className="text-accent" />
                            </div>
                            <div>
                              <p className="font-semibold">{lead.name}</p>
                              <p className="text-sm text-muted-foreground">{lead.status}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-heading font-bold text-lg">{lead.amount} ₽</p>
                            <p className="text-sm text-muted-foreground">{lead.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="earnings">
                <Card>
                  <CardHeader>
                    <CardTitle>История выплат</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { amount: '52 000', date: '25.10.2024', status: 'Выплачено' },
                        { amount: '38 000', date: '18.10.2024', status: 'Выплачено' },
                        { amount: '45 500', date: '11.10.2024', status: 'Выплачено' },
                        { amount: '28 000', date: '04.10.2024', status: 'Выплачено' },
                      ].map((payment, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Icon name="CheckCircle" size={20} className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold">{payment.amount} ₽</p>
                              <p className="text-sm text-muted-foreground">{payment.date}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {payment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <section id="materials" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-center mb-4">
              Рекламные материалы
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Готовые инструменты для продвижения
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: 'Image', title: 'Баннеры', desc: 'Готовые баннеры всех размеров для контекста и таргета', count: '24 шт' },
                { icon: 'FileText', title: 'Лендинг', desc: 'Готовая посадочная страница с формой захвата лида', count: '1 шт' },
                { icon: 'Link', title: 'Реф. ссылки', desc: 'Персональные ссылки с автоматическим отслеживанием', count: '∞' },
                { icon: 'Video', title: 'Видео', desc: 'Рекламные ролики для YouTube и социальных сетей', count: '8 шт' },
                { icon: 'Mail', title: 'Email-шаблоны', desc: 'Готовые письма для email-рассылок', count: '12 шт' },
                { icon: 'MessageSquare', title: 'Скрипты', desc: 'Скрипты продаж и ответы на частые вопросы', count: '5 шт' },
              ].map((material, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow border-2 hover:border-accent/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon name={material.icon as any} size={24} className="text-accent" />
                    </div>
                    <CardTitle className="text-xl mb-2">{material.title}</CardTitle>
                    <Badge variant="secondary">{material.count}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{material.desc}</p>
                    <Button variant="outline" className="w-full">
                      <Icon name="Download" size={16} className="mr-2" />
                      Скачать
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6">
              Готовы начать зарабатывать?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Регистрация занимает 2 минуты. Первый лид можете получить уже сегодня
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-10 py-6">
              <Icon name="Rocket" size={20} className="mr-2" />
              Зарегистрироваться сейчас
            </Button>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-center mb-12">
              Контакты
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="Phone" size={28} className="text-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2">Телефон</h3>
                  <a href="tel:+79999999999" className="text-accent hover:underline">
                    +7 (999) 999-99-99
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="Mail" size={28} className="text-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2">Email</h3>
                  <a href="mailto:partners@example.com" className="text-accent hover:underline">
                    partners@example.com
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="MessageCircle" size={28} className="text-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2">Telegram</h3>
                  <a href="https://t.me/support" className="text-accent hover:underline">
                    @support
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon name="Hammer" size={24} />
              <span className="font-heading font-bold text-lg">РемонтПартнер</span>
            </div>
            <p className="text-sm opacity-75">
              © 2024 РемонтПартнер. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
