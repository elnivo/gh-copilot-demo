import type { Album } from '../types.js'

export const seedAlbums: Album[] = [
  {
    id: 1,
    title: 'You, Me and an App Id',
    artist: {
      name: 'Daprize',
      birthdate: '1990-04-12',
      birthPlace: 'Seattle, USA',
    },
    year: 2020,
    price: 10.99,
    image_url: 'https://aka.ms/albums-daprlogo',
  },
  {
    id: 2,
    title: 'Seven Revision Army',
    artist: {
      name: 'The Blue-Green Stripes',
      birthdate: '1988-09-23',
      birthPlace: 'Portland, USA',
    },
    year: 2021,
    price: 13.99,
    image_url: 'https://aka.ms/albums-containerappslogo',
  },
  {
    id: 3,
    title: 'Scale It Up',
    artist: {
      name: 'KEDA Club',
      birthdate: '1992-02-15',
      birthPlace: 'Austin, USA',
    },
    year: 2022,
    price: 13.99,
    image_url: 'https://aka.ms/albums-kedalogo',
  },
  {
    id: 4,
    title: 'Lost in Translation',
    artist: {
      name: 'MegaDNS',
      birthdate: '1986-11-07',
      birthPlace: 'Dublin, Ireland',
    },
    year: 2020,
    price: 12.99,
    image_url: 'https://aka.ms/albums-envoylogo',
  },
  {
    id: 5,
    title: 'Lock Down Your Love',
    artist: {
      name: 'V is for VNET',
      birthdate: '1991-06-30',
      birthPlace: 'London, UK',
    },
    year: 2021,
    price: 12.99,
    image_url: 'https://aka.ms/albums-vnetlogo',
  },
  {
    id: 6,
    title: "Sweet Container O' Mine",
    artist: {
      name: 'Guns N Probeses',
      birthdate: '1989-01-19',
      birthPlace: 'Los Angeles, USA',
    },
    year: 2022,
    price: 14.99,
    image_url: 'https://aka.ms/albums-containerappslogo',
  },
]