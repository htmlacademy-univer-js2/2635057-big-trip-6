import { AbstractView } from '../render.js';

const createDestinationOptionsTemplate = (destinations) => destinations
  .map((destination) => `<option value="${destination.name}"></option>`)
  .join('');

const createEditFormTemplate = ({ point, destinations }) => (
  `<li class="trip-events__item">
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
              <!-- типы событий -->
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
          <input class="event__input  event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${point.startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${point.endDate}">
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
    </form>
  </li>`
);

export default class EditFormView extends AbstractView {
  #point = null;
  #destinations = [];
  #formSubmitHandler = null;
  #rollupClickHandler = null;

  constructor({ point, destinations, onFormSubmit, onRollupClick }) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#formSubmitHandler = onFormSubmit;
    this.#rollupClickHandler = onRollupClick;

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  }

  get template() {
    return createEditFormTemplate({ point: this.#point, destinations: this.#destinations });
  }
}