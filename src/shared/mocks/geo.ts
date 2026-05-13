/** Иерархия Country → Region → City (демо для ТЗ G.1) */

export interface GeoCity {
  id: string
  name: string
}

export interface GeoRegion {
  id: string
  name: string
  cities: GeoCity[]
}

export interface GeoCountry {
  id: string
  name: string
  regions: GeoRegion[]
}

export const mockGeoCountries: GeoCountry[] = [
  {
    id: 'ru',
    name: 'Россия',
    regions: [
      {
        id: 'ru-mow',
        name: 'Москва и область',
        cities: [
          { id: 'moscow', name: 'Москва' },
          { id: 'khimki', name: 'Химки' },
        ],
      },
      {
        id: 'ru-spb',
        name: 'Санкт-Петербург и ЛО',
        cities: [
          { id: 'spb', name: 'Санкт-Петербург' },
          { id: 'vsevolozhsk', name: 'Всеволожск' },
        ],
      },
      {
        id: 'ru-sfo',
        name: 'Сибирский ФО',
        cities: [
          { id: 'nsk', name: 'Новосибирск' },
          { id: 'ekb', name: 'Екатеринбург' },
        ],
      },
    ],
  },
  {
    id: 'kz',
    name: 'Казахстан',
    regions: [
      {
        id: 'kz-al',
        name: 'Алматы',
        cities: [
          { id: 'almaty', name: 'Алматы' },
          { id: 'astana', name: 'Астана' },
        ],
      },
    ],
  },
]

export function flattenCities(): { country: string; region: string; city: string }[] {
  const out: { country: string; region: string; city: string }[] = []
  for (const c of mockGeoCountries) {
    for (const r of c.regions) {
      for (const city of r.cities) {
        out.push({ country: c.name, region: r.name, city: city.name })
      }
    }
  }
  return out
}
