export interface TerritoryDef {
  id: string;
  name: string;
  vertical: string;
  marginType: 'high-freq-low-margin' | 'mid-freq-mid-margin' | 'low-freq-high-margin' | 'mid-freq-high-margin';
}

export const TERRITORY_DEFS: TerritoryDef[] = [
  { id: 'food',      name: 'Food',      vertical: 'High freq / Low margin',  marginType: 'high-freq-low-margin' },
  { id: 'salon',     name: 'Salon',     vertical: 'Mid freq / Mid margin',   marginType: 'mid-freq-mid-margin' },
  { id: 'cleaning',  name: 'Cleaning',  vertical: 'Low freq / High margin',  marginType: 'low-freq-high-margin' },
  { id: 'repairs',   name: 'Repairs',   vertical: 'Low freq / High margin',  marginType: 'low-freq-high-margin' },
  { id: 'tutoring',  name: 'Tutoring',  vertical: 'Mid freq / High margin',  marginType: 'mid-freq-high-margin' },
  { id: 'grocery',   name: 'Grocery',   vertical: 'High freq / Low margin',  marginType: 'high-freq-low-margin' },
  { id: 'fitness',   name: 'Fitness',   vertical: 'Mid freq / Mid margin',   marginType: 'mid-freq-mid-margin' },
  { id: 'logistics', name: 'Logistics', vertical: 'High freq / Low margin',  marginType: 'high-freq-low-margin' },
];
