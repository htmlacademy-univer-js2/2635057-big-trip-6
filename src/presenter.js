import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import NoPointsView from './view/no-points-view.js';
import PointPresenter from './presenter/point-presenter.js';
import { render } from './render.js';

const EMPTY_LIST_MESSAGE = 'Click New Event to create your first point';

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

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

const createSortData = (currentSortType) => ([
  { value: SortType.DAY, name: 'Day', isChecked: currentSortType === SortType.DAY, isDisabled: false },
  { value: SortType.EVENT, name: 'Event', isChecked: currentSortType === SortType.EVENT, isDisabled: true },
  { value: SortType.TIME, name: 'Time', isChecked: currentSortType === SortType.TIME, isDisabled: false },
  { value: SortType.PRICE, name: 'Price', isChecked: currentSortType === SortType.PRICE, isDisabled: false },
  { value: SortType.OFFERS, name: 'Offers', isChecked: currentSortType === SortType.OFFERS, isDisabled: true }
]);

const sortByDay = (pointA, pointB) => new Date(pointA.startDate) - new Date(pointB.startDate);
const sortByTime = (pointA, pointB) => {
  const durationPointA = new Date(pointA.endDate) - new Date(pointA.startDate);
  const durationPointB = new Date(pointB.endDate) - new Date(pointB.startDate);

  return durationPointB - durationPointA;
};
const sortByPrice = (pointA, pointB) => pointB.price - pointA.price;

export default class Presenter {
  #model = null;
  #filtersContainer = document.querySelector('.trip-controls__filters');
  #sortContainer = document.querySelector('.trip-events');
  #eventsList = document.querySelector('.trip-events__list');
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor(model) {
    this.#model = model;
  }

  get points() {
    const points = [...this.#model.getPoints()];

    switch (this.#currentSortType) {
      case SortType.TIME:
        return points.sort(sortByTime);
      case SortType.PRICE:
        return points.sort(sortByPrice);
      case SortType.DAY:
      default:
        return points.sort(sortByDay);
    }
  }

  #renderPoint = (point, destinations) => {
    const pointPresenter = new PointPresenter({
      eventsListContainer: this.#eventsList,
      destinations,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    const destinations = this.#model.getDestinations();
    this.points.forEach((point) => this.#renderPoint(point, destinations));
  };

  #clearPointList = () => {
    this.#eventsList.innerHTML = '';
    this.#pointPresenters.clear();
  };

  #handlePointChange = (updatedPoint) => {
    this.#model.updatePoint(updatedPoint);
    this.#clearPointList();
    this.#renderPoints();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (evt) => {
    const sortType = evt.target.dataset.sortType;

    if (!sortType || sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPoints();
  };

  init() {
    const sourcePoints = this.#model.getPoints();

    const filtersComponent = new FiltersView({ filters: createFilterData(sourcePoints) });
    render(filtersComponent, this.#filtersContainer);

    if (sourcePoints.length === 0) {
      const noPointsComponent = new NoPointsView({ message: EMPTY_LIST_MESSAGE });
      render(noPointsComponent, this.#sortContainer);
      return;
    }

    const sortComponent = new SortView({
      sortItems: createSortData(this.#currentSortType),
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(sortComponent, this.#sortContainer);

    this.#renderPoints();
  }
}
