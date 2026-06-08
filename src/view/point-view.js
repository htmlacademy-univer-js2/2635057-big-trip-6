import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import { AbstractView } from '../render.js';
import { capitalize } from '../utils.js';

dayjs.extend(dayjsDuration);

const formatDate = (dateString) => dayjs(dateString).format('MMM D').toUpperCase();

const formatTime = (dateString) => dayjs(dateString).format('HH:mm');

const formatDuration = (dateFrom, dateTo) => {
  const diffInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
  const pointDuration = dayjs.duration(diffInMinutes, 'minute');

  if (diffInMinutes < 60) {
    return `${diffInMinutes}M`;
  }

  if (diffInMinutes < 1440) {
    return `${String(pointDuration.hours()).padStart(2, '0')}H ${String(pointDuration.minutes()).padStart(2, '0')}M`;
  }

  return `${String(Math.floor(pointDuration.asDays())).padStart(2, '0')}D ${String(pointDuration.hours()).padStart(2, '0')}H ${String(pointDuration.minutes()).padStart(2, '0')}M`;
};

const createPointTemplate = (point, destination, offers) => {
  const { type, dateFrom, dateTo, basePrice, isFavorite } = point;

  const date = formatDate(dateFrom);
  const startTime = formatTime(dateFrom);
  const endTime = formatTime(dateTo);
  const duration = formatDuration(dateFrom, dateTo);
  const destinationName = destination ? destination.name : '';

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  const offersHtml = offers.length > 0
    ? `<h4 class="visually-hidden">Offers:</h4>
       <ul class="event__selected-offers">
         ${offers.map((offer) => `<li class="event__offer">
           <span class="event__offer-title">${offer.title}</span>
           +€&nbsp;<span class="event__offer-price">${offer.price}</span>
         </li>`).join('')}
       </ul>`
    : '';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom.split('T')[0]}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalize(type)} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${basePrice}</span>
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

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = [];
  #rollupClickHandler = null;
  #favoriteClickHandler = null;

  constructor({ point, destination, offers, onRollupClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#rollupClickHandler = onRollupClick;
    this.#favoriteClickHandler = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#offers);
  }
}
