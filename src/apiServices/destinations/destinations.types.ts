export interface Title {
  ar: string;
  en: string;
  fr: string;
}

interface Code {
  alpha_3: string;
  alpha_2: string;
}
export interface FeaturedImage {
  owner?: string | number;
  image_uuid: string;
}

export interface Country {
  pkey: number;
  slug: string;
  total_cities: number;
  code: Code;
  title: Title;
  featured_image: FeaturedImage;
}
export interface Continent {
  title: Title;
  countries: Country[];
  pkey: number;
  total_countries: number;
}
