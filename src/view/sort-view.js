import { AbstractView } from '../render.js';

const createSortItemTemplate = ({ value, name, isChecked, isDisabled }) => (
  `<div class="trip-sort__item  trip-sort__item--${value}">
    <input
      id="sort-${value}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="${value}"
      ${isChecked ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label class="trip-sort__btn" for="sort-${value}">${name}</label>
  </div>`
);

const createSortTemplate = (sortItems) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortItems.map((sortItem) => createSortItemTemplate(sortItem)).join('')}
  </form>`
);

export default class SortView extends AbstractView {
  #sortItems = [];

  constructor({ sortItems }) {
    super();
    this.#sortItems = sortItems;
  }

  get template() {
    return createSortTemplate(this.#sortItems);
  }
}