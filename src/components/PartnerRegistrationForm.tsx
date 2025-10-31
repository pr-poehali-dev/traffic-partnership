import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const PartnerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    traffic_source: '',
    experience: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('https://functions.poehali.dev/dac5d967-9062-43d2-91e9-19b52c372a12', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          traffic_source: '',
          experience: ''
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Произошла ошибка при регистрации');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Ошибка соединения. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card className="max-w-2xl mx-auto border-2 border-primary/10 bg-white shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-heading text-primary mb-2">
          Регистрация партнера
        </CardTitle>
        <CardDescription className="text-base text-primary/70">
          Заполните форму, и мы свяжемся с вами в течение 24 часов
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg flex items-start gap-3">
            <Icon name="CheckCircle" size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800">Заявка успешно отправлена!</p>
              <p className="text-sm text-green-700 mt-1">
                Мы свяжемся с вами в ближайшее время для обсуждения деталей партнерства.
              </p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg flex items-start gap-3">
            <Icon name="XCircle" size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Ошибка отправки</p>
              <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-base font-semibold text-primary mb-2 block">
              Имя и фамилия <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Иван Иванов"
              className="h-12 border-2 border-primary/20 focus:border-accent text-base"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-semibold text-primary mb-2 block">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="ivan@example.com"
              className="h-12 border-2 border-primary/20 focus:border-accent text-base"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-base font-semibold text-primary mb-2 block">
              Телефон <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (999) 123-45-67"
              className="h-12 border-2 border-primary/20 focus:border-accent text-base"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="traffic_source" className="text-base font-semibold text-primary mb-2 block">
              Источник трафика
            </Label>
            <Input
              id="traffic_source"
              name="traffic_source"
              type="text"
              value={formData.traffic_source}
              onChange={handleChange}
              placeholder="Контекстная реклама, SEO, социальные сети..."
              className="h-12 border-2 border-primary/20 focus:border-accent text-base"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="experience" className="text-base font-semibold text-primary mb-2 block">
              Опыт работы с трафиком
            </Label>
            <Textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Расскажите о вашем опыте работы с трафиком, успешных кейсах..."
              className="min-h-[120px] border-2 border-primary/20 focus:border-accent text-base resize-none"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-primary font-bold text-lg py-7 min-h-[56px] shadow-lg hover:shadow-xl transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Отправка...
              </>
            ) : (
              <>
                <Icon name="Send" size={20} className="mr-2" />
                Отправить заявку
              </>
            )}
          </Button>

          <p className="text-sm text-primary/60 text-center mt-4">
            Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default PartnerRegistrationForm;
