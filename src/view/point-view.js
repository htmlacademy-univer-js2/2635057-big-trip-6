import { createElement } from '../render.js';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('en', { month: 'short' }).toUpperCase();
  const day = date.getDate();
  return `${month} ${day}`;
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const formatDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMinutes = Math.round((end - start) / 60000);
  
  if (durationMinutes < 60) {
    return `${durationMinutes}M`;
  }
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours < 24) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${String(days).padStart(2, '0')}D ${String(remainingHours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
};

const createPointTemplate = (point) => {
  const { type, destination, startDate, endDate, price, offers, isFavorite } = point;
  
  const date = formatDate(startDate);
  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);
  const duration = formatDuration(startDate, endDate);
  
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  
  const offersHtml = offers.length > 0 
    ? `<h4 class="visually-hidden">Offers:</h4>
       <ul class="event__selected-offers">
         ${offers.map(offer => `<li class="event__offer">${offer.title}</li>`).join('')}
       </ul>`
    : '';
  
  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${startDate.split('T')[0]}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDate}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDate}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${price}</span>
        </p>
        ${offersHtml}
        <button class="event__favorite-btn ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.228 4.326 1.572-9.163L0 9.674l9.195-1.336L14 0l4.805 8.338L28 9.674l-7.344 6.489 1.572 9.163L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class PointView {
  constructor(point) {
    this.point = point;
  }

  getTemplate() {
    return createPointTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}