import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Building2, MapPin, Star, Users, Briefcase, Filter } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { mockCompanies } from '@/shared/mocks/companies';
import { INDUSTRIES, CITIES, COMPANY_SIZES } from '@/shared/constants';

const SELECT_ALL = '__all__'

export function CompaniesPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [industry, setIndustry] = useState('');
  const [city, setCity] = useState('');
  const [size, setSize] = useState('');

  const filteredCompanies = useMemo(() => {
    return mockCompanies.filter(company => {
      if (query) {
        const q = query.toLowerCase();
        const desc = company.description?.toLowerCase() ?? '';
        if (!company.name.toLowerCase().includes(q) && !desc.includes(q)) {
          return false;
        }
      }
      if (industry && company.industry !== industry) return false;
      if (city && !company.cities.includes(city)) return false;
      if (size && company.size !== size) return false;
      return true;
    });
  }, [query, industry, city, size]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Компании</h1>
          <p className="text-muted-foreground">Найдите работодателя мечты среди {mockCompanies.length}+ компаний</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Название компании"
                  className="pl-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Select
                value={industry || SELECT_ALL}
                onValueChange={(v) => setIndustry(v === SELECT_ALL ? '' : v)}
              >
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Отрасль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_ALL}>Все отрасли</SelectItem>
                  {INDUSTRIES.map(ind => (
                    <SelectItem key={ind.value} value={ind.value}>{ind.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={city || SELECT_ALL}
                onValueChange={(v) => setCity(v === SELECT_ALL ? '' : v)}
              >
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Город" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_ALL}>Все города</SelectItem>
                  {CITIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={size || SELECT_ALL}
                onValueChange={(v) => setSize(v === SELECT_ALL ? '' : v)}
              >
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Размер" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_ALL}>Любой размер</SelectItem>
                  {COMPANY_SIZES.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <span className="text-muted-foreground">
            Найдено: <strong className="text-foreground">{filteredCompanies.length}</strong> компаний
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/companies/${company.id}`}>
                <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        {company.logo ? (
                          <img src={company.logo} alt="" className="w-12 h-12 object-contain" />
                        ) : (
                          <Building2 className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-lg truncate">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">{company.industry}</p>
                        {company.isVerified && (
                          <Badge variant="secondary" className="mt-1 text-xs">Проверена</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {company.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {company.cities.join(', ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {COMPANY_SIZES.find(s => s.value === company.size)?.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{company.rating}</span>
                        <span className="text-muted-foreground text-sm">({company.reviewsCount})</span>
                      </div>
                      <Badge variant="outline">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {company.vacanciesCount} вакансий
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Компании не найдены</h3>
              <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
