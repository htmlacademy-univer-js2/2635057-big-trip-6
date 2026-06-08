import { AbstractView } from '../render.js';

export default class PointsListView extends AbstractView {
  get template() {
    return '<ul class="trip-events__list"></ul>';
  }
}
