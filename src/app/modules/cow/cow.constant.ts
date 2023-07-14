export const location = [
  'Dhaka',
  'Chattogram',
  'Barishal',
  'Rajshahi',
  'Sylhet',
  'Comilla',
  'Rangpur',
  'Mymensingh',
];
export const breed = [
  'Brahman',
  'Nellore',
  'Sahiwal',
  'Gir',
  'Indigenous',
  'Tharparkar',
  'Kankrej',
];

export const label = ['for sale', 'sold out'] as const;
export type CowLabel = (typeof label)[number];

export const category = ['Dairy', 'Beef', 'DualPurpose'];

export const cowSearchableFields = ['name', 'location', 'breed', 'category'];

export const cowFilterableFields = [
  'searchTerm',
  'name',
  'age',
  'location',
  'breed',
  'maxPrice',
  'minPrice',
];
