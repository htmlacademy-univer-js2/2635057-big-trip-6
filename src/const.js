export const TYPES = [
  'Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'
];

export const DESTINATIONS = [
  {
    id: '1',
    name: 'Amsterdam',
    description: 'Amsterdam is the capital of the Netherlands, known for its artistic heritage, elaborate canal system and narrow houses.',
    pictures: [
      { src: 'https://loremflickr.com/248/152?random=1', description: 'Amsterdam canal' },
      { src: 'https://loremflickr.com/248/152?random=2', description: 'Amsterdam street' }
    ]
  },
  {
    id: '2',
    name: 'Geneva',
    description: 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva).',
    pictures: [
      { src: 'https://loremflickr.com/248/152?random=3', description: 'Lake Geneva' },
      { src: 'https://loremflickr.com/248/152?random=4', description: 'Geneva fountain' }
    ]
  },
  {
    id: '3',
    name: 'Chamonix',
    description: 'Chamonix-Mont-Blanc is a resort area near the junction of France, Switzerland and Italy.',
    pictures: [
      { src: 'https://loremflickr.com/248/152?random=5', description: 'Mont Blanc' }
    ]
  }
];

export const OFFERS = [
  {
    id: '1',
    type: 'Flight',
    offers: [
      { id: '1', title: 'Add luggage', price: 50 },
      { id: '2', title: 'Switch to comfort', price: 80 },
      { id: '3', title: 'Add meal', price: 15 },
      { id: '4', title: 'Choose seats', price: 5 }
    ]
  },
  {
    id: '2',
    type: 'Taxi',
    offers: [
      { id: '5', title: 'Order Uber', price: 20 },
      { id: '6', title: 'Rent a car', price: 200 }
    ]
  },
  {
    id: '3',
    type: 'Bus',
    offers: [
      { id: '7', title: 'Travel by bus', price: 40 }
    ]
  },
  {
    id: '4',
    type: 'Check-in',
    offers: [
      { id: '8', title: 'Add breakfast', price: 50 },
      { id: '9', title: 'Add parking', price: 30 }
    ]
  }
];