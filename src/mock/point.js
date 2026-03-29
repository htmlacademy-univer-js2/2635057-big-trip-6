import { TYPES, DESTINATIONS, OFFERS } from '../const.js';

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomDate = (startDate, endDate) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const generatePoint = () => {
  const type = getRandomItem(TYPES);
  const destination = getRandomItem(DESTINATIONS);
  const offersForType = OFFERS.find((offer) => offer.type === type)?.offers || [];
  const selectedOffers = offersForType.filter(() => Math.random() > 0.5);
  
  const startDate = getRandomDate('2025-03-10', '2025-03-20');
  const duration = getRandomInt(30, 180); // minutes
  const endDate = new Date(startDate.getTime() + duration * 60000);

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
    type,
    destination: destination.name,
    destinationId: destination.id,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    price: getRandomInt(20, 500),
    offers: selectedOffers,
    isFavorite: Math.random() > 0.7
  };
};

export const generatePoints = (count) => {
  return Array.from({ length: count }, generatePoint).sort((a, b) => 
    new Date(a.startDate) - new Date(b.startDate)
  );
};