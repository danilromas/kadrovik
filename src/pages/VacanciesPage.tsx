import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Building2, Filter, X, Heart, Clock, Briefcase,
  ChevronDown, SlidersHorizontal, Grid, List
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { Slider } from '@/shared/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { CATEGORIES, CITIES, EXPERIENCE_LEVELS, EMPLOYMENT_TYPES, WORK_FORMATS, SPECIALIZATIONS } from '@/shared/constants';
import { flattenCities } from '@/shared/mocks/geo';
import type { WorkFormat } from '@/shared/types';
import { useFavoritesStore } from '@/features/favorites/store/favoritesStore';
import { formatDistanceToNow, formatSalary, getExperienceFilterValue } from '@/shared/lib/utils';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useVacanciesQuery } from '@/shared/api/queries';
import { useAdminModerationStore, isVacancyModeratedOut } from '@/features/admin/store/adminModerationStore';

/** Подсветка вхождения запроса (ТЗ P.3) */
function MarkQuery({ text, q }: { text: string; q: string }) {
  const trimmed = q.trim();
  if (!trimmed) return <>{text}</>;
  const i = text.toLowerCase().indexOf(trimmed.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded px-0.5 bg-yellow-200 dark:bg-yellow-900/50">{text.slice(i, i + trimmed.length)}</mark>
      {text.slice(i + trimmed.length)}
    </>
  );
}

/** Radix Select не допускает пустой `value` у `SelectItem` */
const SELECT_ALL = '__all__'

export function VacanciesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favoriteVacancies, toggleVacancy } = useFavoritesStore();
  const { data: vacanciesData = [], isLoading: vacanciesLoading } = useVacanciesQuery();
  const moderation = useAdminModerationStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(true);
  const [salaryRange, setSalaryRange] = useState([0, 500000]);
  
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    companyQuery: '',
    specialization: '',
    experience: [] as string[],
    employment: [] as string[],
    schedule: [] as string[],
    workFormats: [] as WorkFormat[],
    remote: false,
  });

  const debouncedQuery = useDebounce(filters.query, 400);
  const debouncedCompany = useDebounce(filters.companyQuery, 400);

  const baseVacancies = useMemo(
    () => vacanciesData.filter((v) => !isVacancyModeratedOut(v.id, moderation)),
    [vacanciesData, moderation]
  );

  const filteredVacancies = useMemo(() => {
    return baseVacancies.filter((vacancy) => {
      const company = vacancy.company
      if (debouncedQuery) {
        const query = debouncedQuery.toLowerCase();
        const matchesTitle = vacancy.title.toLowerCase().includes(query);
        const matchesCompany = company?.name.toLowerCase().includes(query) ?? false;
        const matchesSkills = vacancy.skills.some(s => s.name.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
      }
      if (filters.city && vacancy.city !== filters.city) return false;
      if (filters.category && vacancy.profession !== filters.category) return false;
      if (filters.experience.length && !filters.experience.includes(getExperienceFilterValue(vacancy.experienceYears))) {
        return false;
      }
      if (filters.employment.length && !vacancy.employmentType.some((t) => filters.employment.includes(t))) {
        return false;
      }
      if (filters.schedule.length && !filters.schedule.includes(vacancy.schedule)) return false;
      if (filters.specialization && vacancy.specialization !== filters.specialization) return false;
      if (debouncedCompany.trim()) {
        const cq = debouncedCompany.trim().toLowerCase();
        if (!(company?.name.toLowerCase().includes(cq) ?? false)) return false;
      }
      if (filters.workFormats.length) {
        const ok = filters.workFormats.some((wf) => vacancy.workFormat.includes(wf));
        if (!ok) return false;
      }
      if (vacancy.salaryMax != null && vacancy.salaryMax < salaryRange[0]) return false;
      if (vacancy.salaryMin != null && vacancy.salaryMin > salaryRange[1]) return false;
      return true;
    });
  }, [baseVacancies, filters, salaryRange, debouncedQuery, debouncedCompany]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.city) params.set('city', filters.city);
    setSearchParams(params);
  };

  const toggleWorkFormat = (wf: WorkFormat) => {
    setFilters((prev) => ({
      ...prev,
      workFormats: prev.workFormats.includes(wf)
        ? prev.workFormats.filter((x) => x !== wf)
        : [...prev.workFormats, wf],
    }));
  };

  const toggleFilter = (key: 'experience' | 'employment' | 'schedule', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      city: '',
      category: '',
      companyQuery: '',
      specialization: '',
      experience: [],
      employment: [],
      schedule: [],
      workFormats: [],
      remote: false,
    });
    setSalaryRange([0, 500000]);
    setSearchParams({});
  };

  const activeFiltersCount = [
    filters.city,
    filters.category,
    filters.companyQuery,
    filters.specialization,
    ...filters.experience,
    ...filters.employment,
    ...filters.schedule,
    ...filters.workFormats,
    filters.remote,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Поиск вакансий</h1>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Должность, навыки или компания"
                className="pl-12 h-12"
                value={filters.query}
                onChange={(e) => setFilters(f => ({ ...f, query: e.target.value }))}
              />
            </div>
            <div className="md:w-56">
              <Select
                value={filters.city || SELECT_ALL}
                onValueChange={(v) => setFilters(f => ({ ...f, city: v === SELECT_ALL ? '' : v }))}
              >
                <SelectTrigger className="h-12">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Город" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_ALL}>Все города</SelectItem>
                  {CITIES.map(city => (
                    <SelectItem key={city.value} value={city.value}>{city.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="lg" className="h-12">
              Найти
            </Button>
          </form>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="hidden lg:block w-72 shrink-0"
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-foreground flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Фильтры
                      </h2>
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          Сбросить
                        </Button>
                      )}
                    </div>

                    {/* Category */}
                    <div className="mb-6">
                      <Label className="text-sm font-medium mb-3 block">Категория</Label>
                      <Select
                        value={filters.category || SELECT_ALL}
                        onValueChange={(v) =>
                          setFilters((f) => ({
                            ...f,
                            category: v === SELECT_ALL ? '' : v,
                            specialization: '',
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Все категории" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SELECT_ALL}>Все категории</SelectItem>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mb-6">
                      <Label className="text-sm font-medium mb-3 block">Специализация</Label>
                      <Select
                        value={filters.specialization || SELECT_ALL}
                        onValueChange={(v) =>
                          setFilters((f) => ({ ...f, specialization: v === SELECT_ALL ? '' : v }))
                        }
                        disabled={!filters.category}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Сначала выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SELECT_ALL}>Все</SelectItem>
                          {(filters.category ? SPECIALIZATIONS[filters.category] ?? [] : []).map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mb-6">
                      <Label className="text-sm font-medium mb-3 block">Компания</Label>
                      <Input
                        placeholder="Название компании"
                        value={filters.companyQuery}
                        onChange={(e) => setFilters((f) => ({ ...f, companyQuery: e.target.value }))}
                      />
                    </div>

                    <div className="mb-6">
                      <Label className="text-sm font-medium mb-3 block">Город (гео, ТЗ G.1)</Label>
                      <Select
                        value={filters.city || SELECT_ALL}
                        onValueChange={(v) => setFilters((f) => ({ ...f, city: v === SELECT_ALL ? '' : v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Иерархия страна → регион → город" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          <SelectItem value={SELECT_ALL}>Все города</SelectItem>
                          {flattenCities().map((row) => (
                            <SelectItem key={`${row.country}-${row.region}-${row.city}`} value={row.city}>
                              {row.country} · {row.region} · {row.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Salary Range */}
                    <div className="mb-6">
                      <Label className="text-sm font-medium mb-3 block">
                        Зарплата: {salaryRange[0].toLocaleString()} - {salaryRange[1].toLocaleString()} ₽
                      </Label>
                      <Slider
                        value={salaryRange}
                        onValueChange={setSalaryRange}
                        min={0}
                        max={500000}
                        step={10000}
                        className="mt-2"
                      />
                    </div>

                    {/* Experience */}
                    <div className="mb-6">
                      <Label className="text-sm font-medium mb-3 block">Опыт работы</Label>
                      <div className="space-y-2">
                        {EXPERIENCE_LEVELS.map(exp => (
                          <div key={exp.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`exp-${exp.value}`}
                              checked={filters.experience.includes(exp.value)}
                              onCheckedChange={() => toggleFilter('experience', exp.value)}
                            />
                            <Label htmlFor={`exp-${exp.value}`} className="text-sm font-normal cursor-pointer">
                              {exp.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Employment Type */}
                    <div className="mb-6">
                      <Label className="text-sm font-medium mb-3 block">Тип занятости</Label>
                      <div className="space-y-2">
                        {EMPLOYMENT_TYPES.map(emp => (
                          <div key={emp.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`emp-${emp.value}`}
                              checked={filters.employment.includes(emp.value)}
                              onCheckedChange={() => toggleFilter('employment', emp.value)}
                            />
                            <Label htmlFor={`emp-${emp.value}`} className="text-sm font-normal cursor-pointer">
                              {emp.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <Label className="text-sm font-medium mb-3 block">Формат работы</Label>
                      <div className="space-y-2">
                        {(Object.entries(WORK_FORMATS) as [WorkFormat, string][]).map(([wf, label]) => (
                          <div key={wf} className="flex items-center space-x-2">
                            <Checkbox
                              id={`wf-${wf}`}
                              checked={filters.workFormats.includes(wf)}
                              onCheckedChange={() => toggleWorkFormat(wf)}
                            />
                            <Label htmlFor={`wf-${wf}`} className="text-sm font-normal cursor-pointer">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Remote */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remote"
                        checked={filters.remote}
                        onCheckedChange={(checked) => setFilters(f => ({ ...f, remote: checked as boolean }))}
                      />
                      <Label htmlFor="remote" className="text-sm font-normal cursor-pointer">
                        Только удалённый формат (remote)
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтры
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
                  )}
                </Button>
                <span className="text-muted-foreground">
                  Найдено: <strong className="text-foreground">{filteredVacancies.length}</strong> вакансий
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.city && (
                  <Badge variant="secondary" className="gap-1">
                    {CITIES.find(c => c.value === filters.city)?.label}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters(f => ({ ...f, city: '' }))} />
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary" className="gap-1">
                    {CATEGORIES.find(c => c.value === filters.category)?.label}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters(f => ({ ...f, category: '' }))} />
                  </Badge>
                )}
                {filters.experience.map(exp => (
                  <Badge key={exp} variant="secondary" className="gap-1">
                    {EXPERIENCE_LEVELS.find(e => e.value === exp)?.label}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter('experience', exp)} />
                  </Badge>
                ))}
                {filters.companyQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Компания: {filters.companyQuery}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters((f) => ({ ...f, companyQuery: '' }))} />
                  </Badge>
                )}
                {filters.specialization && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.specialization}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters((f) => ({ ...f, specialization: '' }))} />
                  </Badge>
                )}
                {filters.workFormats.map((wf) => (
                  <Badge key={wf} variant="secondary" className="gap-1">
                    {WORK_FORMATS[wf]}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleWorkFormat(wf)} />
                  </Badge>
                ))}
                {filters.remote && (
                  <Badge variant="secondary" className="gap-1">
                    Только remote
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters((f) => ({ ...f, remote: false }))} />
                  </Badge>
                )}
              </div>
            )}

            {/* Vacancy List */}
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-4'}>
              {vacanciesLoading && (
                <p className="text-sm text-muted-foreground col-span-full">Загрузка вакансий…</p>
              )}
              {filteredVacancies.map((vacancy, index) => (
                <motion.div
                  key={vacancy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md hover:border-primary/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4 flex-1">
                          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                            {vacancy.company?.logo ? (
                              <img src={vacancy.company.logo} alt="" className="w-10 h-10 object-contain" />
                            ) : (
                              <Building2 className="h-7 w-7 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <Link to={`/vacancies/${vacancy.id}`} className="hover:text-primary transition-colors">
                                <h3 className="font-semibold text-foreground text-lg line-clamp-1">
                                  <MarkQuery text={vacancy.title} q={debouncedQuery} />
                                </h3>
                              </Link>
                              <div className="flex items-center gap-2 shrink-0">
                                {vacancy.isHot && <Badge variant="destructive">Hot</Badge>}
                                {vacancy.isUrgent && <Badge variant="default">Срочно</Badge>}
                              </div>
                            </div>
                            <Link to={`/companies/${vacancy.company?.id ?? vacancy.companyId}`} className="text-muted-foreground hover:text-primary text-sm">
                              <MarkQuery text={vacancy.company?.name ?? 'Компания'} q={debouncedQuery} />
                            </Link>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {vacancy.city}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                {EXPERIENCE_LEVELS.find(e => e.value === getExperienceFilterValue(vacancy.experienceYears))?.label}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDistanceToNow(new Date(vacancy.createdAt))}
                              </span>
                            </div>
                            <div className="mt-3">
                              <span className="text-lg font-semibold text-primary">
                                {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {vacancy.skills.slice(0, 4).map(skill => (
                                <Badge key={skill.name} variant="secondary" className="text-xs">
                                  {skill.name}
                                </Badge>
                              ))}
                              {vacancy.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{vacancy.skills.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleVacancy(vacancy.id)}
                          className="shrink-0"
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              favoriteVacancies.includes(vacancy.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredVacancies.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Вакансии не найдены</h3>
                  <p className="text-muted-foreground mb-4">
                    Попробуйте изменить параметры поиска или сбросить фильтры
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Сбросить фильтры
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
