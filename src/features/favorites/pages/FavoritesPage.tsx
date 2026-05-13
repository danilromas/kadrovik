import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Building2, MapPin, Briefcase, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useFavoritesStore } from '@/features/favorites/store/favoritesStore';
import { mockVacancies } from '@/shared/mocks/vacancies';
import { mockCompanies } from '@/shared/mocks/companies';
import { EMPLOYMENT_TYPE_LABELS } from '@/shared/constants';
import { formatSalary } from '@/shared/lib/utils';

export function FavoritesPage() {
  const { favoriteVacancies, favoriteCompanies, toggleVacancy, toggleCompany } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState('vacancies');

  const savedVacancies = mockVacancies.filter(v => favoriteVacancies.includes(v.id));
  const savedCompanies = mockCompanies.filter(c => favoriteCompanies.includes(c.id));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-2">Избранное</h1>
        <p className="text-muted-foreground">Сохранённые вакансии и компании</p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="vacancies">
            Вакансии
            <Badge variant="secondary" className="ml-2">{savedVacancies.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="companies">
            Компании
            <Badge variant="secondary" className="ml-2">{savedCompanies.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vacancies" className="mt-6">
          {savedVacancies.length > 0 ? (
            <div className="space-y-4">
              {savedVacancies.map((vacancy, index) => (
                <motion.div
                  key={vacancy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <Building2 className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link to={`/vacancies/${vacancy.id}`} className="hover:text-primary">
                                <h3 className="font-semibold text-foreground text-lg">
                                  {vacancy.title}
                                </h3>
                              </Link>
                              <Link to={`/companies/${vacancy.company?.id ?? vacancy.companyId}`} className="text-muted-foreground hover:text-primary">
                                {vacancy.company?.name ?? 'Компания'}
                              </Link>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleVacancy(vacancy.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {vacancy.city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {vacancy.employmentType.map((t) => EMPLOYMENT_TYPE_LABELS[t]).join(', ')}
                            </span>
                          </div>
                          <div className="mt-3">
                            <span className="text-lg font-semibold text-primary">
                              {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Нет сохранённых вакансий</h3>
                <p className="text-muted-foreground mb-4">
                  Добавляйте интересные вакансии в избранное, чтобы не потерять их
                </p>
                <Button asChild>
                  <Link to="/vacancies">Найти вакансии</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="companies" className="mt-6">
          {savedCompanies.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCompanies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                          <Building2 className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleCompany(company.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                      <Link to={`/companies/${company.id}`} className="hover:text-primary">
                        <h3 className="font-semibold text-foreground text-lg mb-1">
                          {company.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3">{company.industry}</p>
                      <Badge variant="outline">
                        {company.vacanciesCount} вакансий
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Нет сохранённых компаний</h3>
                <p className="text-muted-foreground mb-4">
                  Добавляйте интересные компании в избранное
                </p>
                <Button asChild>
                  <Link to="/companies">Найти компании</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
