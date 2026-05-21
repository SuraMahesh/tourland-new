export interface Destination {
  id: string;
  name: string;
  region: string;
  tag: string;
  lat: number;
  lng: number;
  img: string;
  desc: string;
  best: string;
  fee: string;
  nearby: string[];
}

export interface Region {
  id: string;
  name: string;
  blurb: string;
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  duration: string;
  difficulty: string;
  price: string;
  img: string;
  overview: string;
  steps: string[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  price: string;
  stars: number;
  amenities: string[];
  img: string;
  blurb: string;
  recommended: boolean;
}

export interface Season {
  month: string;
  region: string;
  weather: string;
  pick: string;
  festival: string;
}

export interface Review {
  id: number;
  name: string;
  from: string;
  stars: number;
  when: string;
  text: string;
}

export interface HowItWorks {
  n: string;
  t: string;
  d: string;
}

export interface Tweaks {
  cardLayout: 'grid' | 'asym' | 'carousel';
  accent: string;
}

export interface PageParams {
  id?: string;
  [key: string]: any;
}
