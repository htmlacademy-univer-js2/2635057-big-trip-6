import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import NoPointsView from './view/no-points-view.js';
import PointPresenter from './presenter/point-presenter.js';
import { render } from './render.js';

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
  #pointPresenters = new Map();

  constructor(model) {
    this.#model = model;
  }

  #handlePointChange = (updatedPoint) => {
    this.#model.updatePoint(updatedPoint);

    const pointPresenter = this.#pointPresenters.get(updatedPoint.id);
    pointPresenter.init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
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

    const destinations = this.#model.getDestinations();

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        eventsListContainer: this.#eventsList,
        destinations,
        onDataChange: this.#handlePointChange,
        onModeChange: this.#handleModeChange
      });

      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }
}