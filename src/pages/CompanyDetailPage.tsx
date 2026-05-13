import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Building2, Users, Star, Globe, Calendar, Briefcase,
  ArrowLeft, CheckCircle, ExternalLink
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Separator } from '@/shared/ui/separator';
import { mockCompanies } from '@/shared/mocks/companies';
import { mockVacancies } from '@/shared/mocks/vacancies';
import { COMPANY_SIZES, EMPLOYMENT_TYPE_LABELS } from '@/shared/constants';
import { formatSalary } from '@/shared/lib/utils';

export function CompanyDetailPage() {
  const { id } = useParams();
  const company = mockCompanies.find(c => c.id === id);
  
  if (!company) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Компания не найдена</h1>
          <Button asChild>
            <Link to="/companies">К списку компаний</Link>
          </Button>
        </div>
      </div>
    );
  }

  const companyVacancies = mockVacancies.filter(v => v.companyId === company.id || v.company?.id === company.id);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Link to="/companies" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к компаниям
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                  {company.logo ? (
                    <img src={company.logo} alt="" className="w-16 h-16 object-contain" />
                  ) : (
                    <Building2 className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-foreground">{company.name}</h1>
                        {company.isVerified && (
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Проверена
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{company.industry}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1.5 rounded-lg">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-lg">{company.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {company.cities.join(', ')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {COMPANY_SIZES.find(s => s.value === company.size)?.label}
                    </span>
                    {company.foundedYear != null && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Основана в {company.foundedYear}
                      </span>
                    )}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        Сайт компании
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="about" className="space-y-6">
          <TabsList>
            <TabsTrigger value="about">О компании</TabsTrigger>
            <TabsTrigger value="vacancies">
              Вакансии
              <Badge variant="secondary" className="ml-2">{companyVacancies.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Отзывы
              <Badge variant="secondary" className="ml-2">{company.reviewsCount}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>О компании</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{company.description}</p>
                  </CardContent>
                </Card>

                {company.benefits && company.benefits.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Преимущества работы</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {company.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Контакты</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Адрес</p>
                      <p className="text-foreground">{company.address ?? company.cities[0] ?? '—'}</p>
                    </div>
                    {company.email && (
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a href={`mailto:${company.email}`} className="text-primary hover:underline">
                          {company.email}
                        </a>
                      </div>
                    )}
                    {company.phone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Телефон</p>
                        <a href={`tel:${company.phone}`} className="text-primary hover:underline">
                          {company.phone}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground mb-1">{company.vacanciesCount}</div>
                      <div className="text-muted-foreground">открытых вакансий</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vacancies">
            <div className="space-y-4">
              {companyVacancies.length > 0 ? (
                companyVacancies.map((vacancy, index) => (
                  <motion.div
                    key={vacancy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/vacancies/${vacancy.id}`}>
                      <Card className="hover:shadow-md hover:border-primary/50 transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-foreground text-lg mb-1">{vacancy.title}</h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {vacancy.city}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4" />
                                  {vacancy.employmentType.map((t) => EMPLOYMENT_TYPE_LABELS[t]).join(', ')}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-primary text-lg">
                                {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Нет открытых вакансий</h3>
                    <p className="text-muted-foreground">Сейчас у компании нет активных вакансий</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-12 text-center">
                <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Отзывы скоро появятся</h3>
                <p className="text-muted-foreground">Раздел находится в разработке</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
