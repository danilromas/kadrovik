/** Иерархия Country → Region → City (Крым) */

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
        id: 'ru-crimea',
        name: 'Республика Крым',
        cities: [
          { id: 'simferopol', name: 'Симферополь' },
          { id: 'yalta', name: 'Ялта' },
          { id: 'evpatoria', name: 'Евпатория' },
          { id: 'kerch', name: 'Керчь' },
          { id: 'feodosia', name: 'Феодосия' },
          { id: 'alushta', name: 'Алушта' },
          { id: 'sudak', name: 'Судак' },
          { id: 'bahchisaray', name: 'Бахчисарай' },
          { id: 'dzhankoy', name: 'Джанкой' },
          { id: 'saki', name: 'Саки' },
          { id: 'krasnoperekopsk', name: 'Красноперекопск' },
          { id: 'belogorsk', name: 'Белогорск' },
          { id: 'armyansk', name: 'Армянск' },
          { id: 'shchelkino', name: 'Щёлкино' },
          { id: 'chernomorskoe', name: 'Черноморское' },
        ],
      },
      {
        id: 'ru-sevastopol',
        name: 'Севастополь',
        cities: [
          { id: 'sevastopol', name: 'Севастополь' },
          { id: 'inkerman', name: 'Инкерман' },
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
