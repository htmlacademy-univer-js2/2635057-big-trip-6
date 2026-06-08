import { AbstractView } from '../render.js';
import { Message } from '../const.js';

export default class LoadingView extends AbstractView {
  get template() {
    return `<p class="trip-events__msg">${Message.LOADING}</p>`;
  }
}
