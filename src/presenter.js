import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import PointView from './view/point-view.js';
import EditFormView from './view/edit-form-view.js';
import { render, replace } from './render.js';

export default class Presenter {
  #model = null;
  #filtersContainer = document.querySelector('.trip-controls__filters');
  #sortContainer = document.querySelector('.trip-events');
  #eventsList = document.querySelector('.trip-events__list');

  #pointComponents = [];

  constructor(model) {
    this.#model = model;
  }

  #handleEscKeyDown = (evt) => {
    if (evt.key !== 'Escape') {
      return;
    }

    const openedPair = this.#pointComponents.find(({ isEditing }) => isEditing);

    if (!openedPair) {
      return;
    }

    this.#replaceFormToPoint(openedPair);
  };

  #replacePointToForm = (pair) => {
    replace(pair.editFormComponent, pair.pointComponent);
    pair.isEditing = true;
  };

  #replaceFormToPoint = (pair) => {
    replace(pair.pointComponent, pair.editFormComponent);
    pair.isEditing = false;
  };

  init() {
    const filtersComponent = new FiltersView();
    render(filtersComponent, this.#filtersContainer);

    const sortComponent = new SortView();
    render(sortComponent, this.#sortContainer);

    const points = this.#model.getPoints();

    this.#pointComponents = points.map((point) => {
      const pair = { isEditing: false };

      const pointComponent = new PointView({
        point,
        onRollupClick: (evt) => {
          evt.preventDefault();
          this.#replacePointToForm(pair);
        }
      });

      const editFormComponent = new EditFormView({
        onFormSubmit: (evt) => {
          evt.preventDefault();
          this.#replaceFormToPoint(pair);
        },
        onRollupClick: (evt) => {
          evt.preventDefault();
          this.#replaceFormToPoint(pair);
        }
      });

      pair.pointComponent = pointComponent;
      pair.editFormComponent = editFormComponent;

      return pair;
    });

    this.#pointComponents.forEach(({ pointComponent }) => render(pointComponent, this.#eventsList));

    window.addEventListener('keydown', this.#handleEscKeyDown);
  }
}