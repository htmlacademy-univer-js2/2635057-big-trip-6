import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import { AbstractView } from '../render.js';

dayjs.extend(dayjsDuration);

const formatDate = (dateString) => dayjs(dateString).format('MMM D').toUpperCase();

const formatTime = (dateString) => dayjs(dateString).format('HH:mm');

const formatDuration = (startDate, endDate) => {
  const diffInMinutes = dayjs(endDate).diff(dayjs(startDate), 'minute');
  const pointDuration = dayjs.duration(diffInMinutes, 'minute');

  if (diffInMinutes < 60) {
    return `${diffInMinutes}M`;
  }

  if (diffInMinutes < 1440) {
    return `${String(pointDuration.hours()).padStart(2, '0')}H ${String(pointDuration.minutes()).padStart(2, '0')}M`;
  }

  return `${String(Math.floor(pointDuration.asDays())).padStart(2, '0')}D ${String(pointDuration.hours()).padStart(2, '0')}H ${String(pointDuration.minutes()).padStart(2, '0')}M`;
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
         ${offers.map((offer) => `<li class="event__offer">${offer.title}</li>`).join('')}
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

export default class PointView extends AbstractView {
  #point = null;
  #rollupClickHandler = null;
  #favoriteClickHandler = null;

  constructor({ point, onRollupClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#rollupClickHandler = onRollupClick;
    this.#favoriteClickHandler = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point);
  }
}