import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { OFFERS, TYPES } from '../const.js';
import { AbstractStatefulView } from '../render.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

const formatDateForInput = (date) => dayjs(date).format(DATE_FORMAT);

const createDestinationOptionsTemplate = (destinations) => destinations
  .map((destination) => `<option value="${destination.name}"></option>`)
  .join('');

const createEventTypeItemTemplate = (type, currentType, pointId) => {
  const lowerType = type.toLowerCase();

  return `<div class="event__type-item">
    <input id="event-type-${lowerType}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${lowerType}" for="event-type-${lowerType}-${pointId}">${type}</label>
  </div>`;
};

const createOffersTemplate = (point) => {
  const offersByType = OFFERS.find((offerGroup) => offerGroup.type === point.type);
  const typeOffers = offersByType ? offersByType.offers : [];

  if (typeOffers.length === 0) {
    return '';
  }

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${typeOffers.map((offer) => `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${offer.id}-${point.id}"
          type="checkbox"
          name="event-offer-${offer.id}"
        >
        <label class="event__offer-label" for="event-offer-${offer.id}-${point.id}">
          <span class="event__offer-title">${offer.title}</span>
          +€&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join('')}
    </div>
  </section>`;
};

const createDestinationSectionTemplate = (destination) => {
  if (!destination || (!destination.description && destination.pictures.length === 0)) {
    return '';
  }

  const photosMarkup = destination.pictures.length > 0
    ? `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>`
    : '';

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description || ''}</p>

    ${photosMarkup}
  </section>`;
};

const createEditFormTemplate = ({ point, destinations }) => {
  const selectedDestination = destinations.find((destination) => destination.name === point.destination);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${point.id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${point.id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${TYPES.map((type) => createEventTypeItemTemplate(type, point.type, point.id)).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${point.id}">${point.type}</label>
          <input class="event__input  event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${point.destination}" list="destination-list-${point.id}">
          <datalist id="destination-list-${point.id}">
            ${createDestinationOptionsTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${point.id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${formatDateForInput(point.startDate)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${formatDateForInput(point.endDate)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="visually-hidden" for="event-price-${point.id}">Price</label>
          <input class="event__input  event__input--price" id="event-price-${point.id}" type="text" name="event-price" value="${point.price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        ${createOffersTemplate(point)}
        ${createDestinationSectionTemplate(selectedDestination)}
      </section>
    </form>
  </li>`;
};

export default class EditFormView extends AbstractStatefulView {
  #destinations = [];
  #formSubmitHandler = null;
  #rollupClickHandler = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point, destinations, onFormSubmit, onRollupClick }) {
    super();
    this._state = EditFormView.parsePointToState(point);
    this.#destinations = destinations;
    this.#formSubmitHandler = onFormSubmit;
    this.#rollupClickHandler = onRollupClick;

    this._setInnerHandlers();
    this.#setDatepickers();
  }

  get template() {
    return createEditFormTemplate({ point: this._state, destinations: this.#destinations });
  }

  _restoreHandlers() {
    this._setInnerHandlers();
    this.#setDatepickers();
  }

  _setInnerHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
  }

  #setDatepickers() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.startDate,
        onChange: this.#dateFromChangeHandler
      }
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.endDate,
        minDate: this._state.startDate,
        onChange: this.#dateToChangeHandler
      }
    );
  }

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({ startDate: userDate.toISOString() });
    if (this.#datepickerTo) {
      this.#datepickerTo.set('minDate', userDate);
    }
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({ endDate: userDate.toISOString() });
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value
    });
  };

  #destinationChangeHandler = (evt) => {
    const nextDestination = this.#destinations.find((destination) => destination.name === evt.target.value);

    if (!nextDestination) {
      return;
    }

    this.updateElement({
      destination: nextDestination.name,
      destinationId: nextDestination.id
    });
  };

  static parsePointToState(point) {
    return { ...point };
  }
}