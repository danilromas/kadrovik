import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Users, Building2, TrendingUp, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CATEGORIES, CITIES } from '@/shared/constants';
import { mockVacancies } from '@/shared/mocks/vacancies';
import { mockCompanies } from '@/shared/mocks/companies';
import { formatSalary } from '@/shared/lib/utils';

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCity) params.set('city', selectedCity);
    navigate(`/vacancies?${params.toString()}`);
  };

  const featuredVacancies = mockVacancies.slice(0, 6);
  const topCompanies = mockCompanies.slice(0, 4);

  const stats = [
    { icon: Briefcase, value: '50,000+', label: 'Вакансий' },
    { icon: Users, value: '1,000,000+', label: 'Соискателей' },
    { icon: Building2, value: '25,000+', label: 'Компаний' },
    { icon: TrendingUp, value: '95%', label: 'Успешных наймов' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Работа в Крыму с{' '}
              <span className="text-primary">КАДРОВИК</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 text-pretty">
              Вакансии от работодателей Крыма — от Симферополя до Ялты и Севастополя.
              Создайте резюме и начните получать предложения уже сегодня.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-card rounded-2xl shadow-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Должность, компания или ключевое слово"
                    className="pl-12 h-12 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="md:w-64 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <select
                    className="w-full h-12 pl-12 pr-4 rounded-md border border-input bg-background text-foreground"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="">Весь Крым</option>
                    {CITIES.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" size="lg" className="h-12 px-8">
                  Найти работу
                </Button>
              </div>
            </form>

            {/* Popular searches */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-muted-foreground">Популярное:</span>
              {['React разработчик', 'Python', 'Менеджер', 'Дизайнер', 'Аналитик'].map((term) => (
                <Link
                  key={term}
                  to={`/vacancies?q=${encodeURIComponent(term)}`}
                  className="text-sm text-primary hover:underline"
                >
                  {term}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Популярные категории</h2>
            <p className="text-muted-foreground">Выберите интересующую вас сферу деятельности</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.slice(0, 8).map((category, index) => (
              <motion.div
                key={category.value}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/vacancies?category=${category.value}`}>
                  <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {category.label}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Math.floor(Math.random() * 500 + 100)} вакансий
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/vacancies">
                Все категории
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Vacancies */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Актуальные вакансии</h2>
              <p className="text-muted-foreground">Свежие предложения от проверенных работодателей</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/vacancies">
                Все вакансии
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVacancies.map((vacancy, index) => (
              <motion.div
                key={vacancy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/vacancies/${vacancy.id}`}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground line-clamp-1">
                              {vacancy.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">{vacancy.company?.name ?? 'Компания'}</p>
                          </div>
                        </div>
                        {vacancy.isHot && (
                          <Badge variant="destructive" className="shrink-0">Hot</Badge>
                        )}
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {vacancy.city}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <span className="text-primary">
                            {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {vacancy.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill.name} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" asChild>
              <Link to="/vacancies">
                Все вакансии
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Лучшие работодатели</h2>
            <p className="text-muted-foreground">Компании с высоким рейтингом и отличными условиями</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/companies/${company.id}`}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all text-center">
                    <CardContent className="p-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="w-12 h-12 object-contain" />
                        ) : (
                          <Building2 className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{company.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{company.industry}</p>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{company.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({company.reviewsCount} отзывов)
                        </span>
                      </div>
                      <Badge variant="outline">{company.vacanciesCount} вакансий</Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/companies">
                Все компании
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Готовы начать карьеру мечты?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Создайте резюме за 5 минут и получайте предложения от лучших работодателей
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">
                  Создать резюме
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link to="/vacancies">
                  Смотреть вакансии
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Почему выбирают нас</h2>
            <p className="text-muted-foreground">Преимущества платформы КАДРОВИК</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Проверенные работодатели',
                description: 'Все компании проходят модерацию. Никакого спама и мошенников.',
              },
              {
                icon: TrendingUp,
                title: 'Умный поиск',
                description: 'Алгоритмы подбирают вакансии на основе вашего опыта и предпочтений.',
              },
              {
                icon: Users,
                title: 'Прямой контакт',
                description: 'Общайтесь с HR-менеджерами напрямую через встроенный чат.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
