import { AbstractView } from '../render.js';
import { FilterLabel, FilterType } from '../const.js';

const createFilterItemTemplate = ({ type, count }, currentFilterType) => {
  const isChecked = type === currentFilterType;
  const isDisabled = count === 0;

  return `<div class="trip-filters__filter">
    <input
      id="filter-${type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${isChecked ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label class="trip-filters__filter-label" for="filter-${type}">${FilterLabel[type]}</label>
  </div>`;
};

const createFiltersTemplate = (filters, currentFilterType) => (
  `<form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView {
  #filters = [];
  #currentFilterType = FilterType.EVERYTHING;
  #filterTypeChangeHandler = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#filterTypeChangeHandler = onFilterTypeChange;

    this.element.addEventListener('change', this.#changeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #changeHandler = (evt) => {
    evt.preventDefault();
    this.#filterTypeChangeHandler(evt.target.value);
  };
}
