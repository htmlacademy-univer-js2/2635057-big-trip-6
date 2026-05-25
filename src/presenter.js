import { DESTINATIONS } from './const.js';
import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import PointView from './view/point-view.js';
import EditFormView from './view/edit-form-view.js';
import NoPointsView from './view/no-points-view.js';
import { render, replace } from './render.js';

const EMPTY_LIST_MESSAGE = 'Click New Event to create your first point';

const createFilterData = (points) => {
  const now = new Date();
  const hasFuture = points.some((point) => new Date(point.startDate) > now);
  const hasPast = points.some((point) => new Date(point.endDate) < now);
  const hasPresent = points.some((point) => new Date(point.startDate) <= now && new Date(point.endDate) >= now);

  return [
    { value: 'everything', name: 'Everything', isChecked: true, isDisabled: false },
    { value: 'future', name: 'Future', isChecked: false, isDisabled: !hasFuture },
    { value: 'present', name: 'Present', isChecked: false, isDisabled: !hasPresent },
    { value: 'past', name: 'Past', isChecked: false, isDisabled: !hasPast }
  ];
};

const createSortData = () => ([
  { value: 'day', name: 'Day', isChecked: true, isDisabled: false },
  { value: 'event', name: 'Event', isChecked: false, isDisabled: true },
  { value: 'time', name: 'Time', isChecked: false, isDisabled: false },
  { value: 'price', name: 'Price', isChecked: false, isDisabled: false },
  { value: 'offers', name: 'Offers', isChecked: false, isDisabled: true }
]);

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
    const points = this.#model.getPoints();

    const filtersComponent = new FiltersView({ filters: createFilterData(points) });
    render(filtersComponent, this.#filtersContainer);

    if (points.length === 0) {
      const noPointsComponent = new NoPointsView({ message: EMPTY_LIST_MESSAGE });
      render(noPointsComponent, this.#sortContainer);
      return;
    }

    const sortComponent = new SortView({ sortItems: createSortData() });
    render(sortComponent, this.#sortContainer);

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
        point,
        destinations: DESTINATIONS,
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