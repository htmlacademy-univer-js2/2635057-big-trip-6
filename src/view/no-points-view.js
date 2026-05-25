import { AbstractView } from '../render.js';

const createNoPointsTemplate = (message) => (`<p class="trip-events__msg">${message}</p>`);

export default class NoPointsView extends AbstractView {
  #message = '';

  constructor({ message }) {
    super();
    this.#message = message;
  }

  get template() {
    return createNoPointsTemplate(this.#message);
  }
}
