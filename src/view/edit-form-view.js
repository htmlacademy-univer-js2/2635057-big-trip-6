import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';
import { TYPES } from '../const.js';
import { AbstractStatefulView } from '../render.js';
import { capitalize } from '../utils.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

const formatDateForInput = (date) => date ? dayjs(date).format(DATE_FORMAT) : '';

const createDestinationOptionsTemplate = (destinations) => destinations
  .map((destination) => `<option value="${he.encode(destination.name)}"></option>`)
  .join('');

const createEventTypeItemTemplate = (type, currentType, pointId, isDisabled) => `<div class="event__type-item">
    <input id="event-type-${type}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${pointId}">${capitalize(type)}</label>
  </div>`;

const createOffersTemplate = (point, offers) => {
  const offersByType = offers.find((offerGroup) => offerGroup.type === point.type);
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
          data-offer-id="${offer.id}"
          ${point.offers.includes(offer.id) ? 'checked' : ''}
          ${point.isDisabled ? 'disabled' : ''}
        >
        <label class="event__offer-label" for="event-offer-${offer.id}-${point.id}">
          <span class="event__offer-title">${he.encode(offer.title)}</span>
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
        ${destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${he.encode(picture.description)}">`).join('')}
      </div>
    </div>`
    : '';

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${he.encode(destination.description || '')}</p>

    ${photosMarkup}
  </section>`;
};

const createResetButtonTemplate = (isNewPoint, isDeleting) => {
  if (isNewPoint) {
    return '<button class="event__reset-btn" type="reset">Cancel</button>';
  }

  return `<button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'}</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;
};

const createEditFormTemplate = ({ point, destinations, offers, isNewPoint }) => {
  const selectedDestination = destinations.find((destination) => destination.id === point.destination);
  const destinationName = selectedDestination ? selectedDestination.name : '';
  const { isDisabled, isSaving, isDeleting } = point;
  const disabledAttr = isDisabled ? 'disabled' : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${point.id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${point.id}" type="checkbox" ${disabledAttr}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${TYPES.map((type) => createEventTypeItemTemplate(type, point.type, point.id, isDisabled)).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${point.id}">${capitalize(point.type)}</label>
          <input class="event__input  event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${he.encode(destinationName)}" list="destination-list-${point.id}" ${disabledAttr}>
          <datalist id="destination-list-${point.id}">
            ${createDestinationOptionsTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${point.id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${formatDateForInput(point.dateFrom)}" ${disabledAttr}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${formatDateForInput(point.dateTo)}" ${disabledAttr}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="visually-hidden" for="event-price-${point.id}">Price</label>
          <input class="event__input  event__input--price" id="event-price-${point.id}" type="text" name="event-price" value="${point.basePrice}" ${disabledAttr}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${disabledAttr}>${isSaving ? 'Saving...' : 'Save'}</button>
        ${createResetButtonTemplate(isNewPoint, isDeleting)}
      </header>

      <section class="event__details">
        ${createOffersTemplate(point, offers)}
        ${createDestinationSectionTemplate(selectedDestination)}
      </section>
    </form>
  </li>`;
};

export default class EditFormView extends AbstractStatefulView {
  #destinations = [];
  #offers = [];
  #isNewPoint = false;
  #onFormSubmit = null;
  #onRollupClick = null;
  #onDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point, destinations, offers, isNewPoint = false, onFormSubmit, onRollupClick, onDeleteClick }) {
    super();
    this._state = EditFormView.parsePointToState(point);
    this.#destinations = destinations;
    this.#offers = offers;
    this.#isNewPoint = isNewPoint;
    this.#onFormSubmit = onFormSubmit;
    this.#onRollupClick = onRollupClick;
    this.#onDeleteClick = onDeleteClick;

    this._setInnerHandlers();
    this.#setDatepickers();
  }

  get template() {
    return createEditFormTemplate({
      point: this._state,
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: this.#isNewPoint
    });
  }

  reset(point) {
    this.updateElement(EditFormView.parsePointToState(point));
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this._setInnerHandlers();
    this.#setDatepickers();
  }

  _setInnerHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#resetClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);

    const offersElement = this.element.querySelector('.event__available-offers');
    if (offersElement) {
      offersElement.addEventListener('change', this.#offersChangeHandler);
    }

    if (!this.#isNewPoint) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    }
  }

  #setDatepickers() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler
      }
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler
      }
    );
  }

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({ dateFrom: userDate.toISOString() });
    if (this.#datepickerTo) {
      this.#datepickerTo.set('minDate', userDate);
    }
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({ dateTo: userDate.toISOString() });
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    const nextDestination = this.#destinations.find((destination) => destination.name === evt.target.value);

    if (!nextDestination) {
      const currentDestination = this.#destinations.find((destination) => destination.id === this._state.destination);
      evt.target.value = currentDestination ? currentDestination.name : '';
      return;
    }

    this.updateElement({
      destination: nextDestination.id
    });
  };

  #priceInputHandler = (evt) => {
    evt.target.value = evt.target.value.replace(/\D/g, '');
    this._setState({ basePrice: Number(evt.target.value) });
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }

    const offerId = evt.target.dataset.offerId;
    const offers = evt.target.checked
      ? [...this._state.offers, offerId]
      : this._state.offers.filter((id) => id !== offerId);

    this._setState({ offers });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    if (this._state.isDisabled) {
      return;
    }
    this.#onFormSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    if (this._state.isDisabled) {
      return;
    }
    this.#onDeleteClick(EditFormView.parseStateToPoint(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    if (this._state.isDisabled) {
      return;
    }
    this.#onRollupClick(evt);
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
