import SortView from './view/sort-view.js';
import NoPointsView from './view/no-points-view.js';
import LoadingView from './view/loading-view.js';
import PointsListView from './view/points-list-view.js';
import PointPresenter from './presenter/point-presenter.js';
import NewPointPresenter from './presenter/new-point-presenter.js';
import { render, remove } from './render.js';
import { SortType, UserAction, UpdateType, FilterType, EmptyListMessage, Message } from './const.js';
import { filter, sortByDay, sortByTime, sortByPrice } from './utils.js';

const createSortData = (currentSortType) => ([
  { value: SortType.DAY, name: 'Day', isChecked: currentSortType === SortType.DAY, isDisabled: false },
  { value: SortType.EVENT, name: 'Event', isChecked: currentSortType === SortType.EVENT, isDisabled: true },
  { value: SortType.TIME, name: 'Time', isChecked: currentSortType === SortType.TIME, isDisabled: false },
  { value: SortType.PRICE, name: 'Price', isChecked: currentSortType === SortType.PRICE, isDisabled: false },
  { value: SortType.OFFERS, name: 'Offers', isChecked: currentSortType === SortType.OFFERS, isDisabled: true }
]);

export default class Presenter {
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #sortContainer = document.querySelector('.trip-events');
  #newEventButton = document.querySelector('.trip-main__event-add-btn');

  #pointsListComponent = new PointsListView();
  #sortComponent = null;
  #noPointsComponent = null;
  #loadingComponent = new LoadingView();

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #isLoading = true;
  #isLoadingError = false;

  constructor({ pointsModel, destinationsModel, offersModel, filterModel }) {
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.getFilter();
    const points = this.#pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.DAY:
      default:
        return filteredPoints.sort(sortByDay);
    }
  }

  init() {
    this.#newEventButton.addEventListener('click', this.#handleNewEventButtonClick);
    this.#newEventButton.disabled = true;
    this.#renderBoard();
  }

  createNewPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.points.length === 0) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
      render(this.#pointsListComponent, this.#sortContainer);
    }

    this.#newPointPresenter = new NewPointPresenter({
      eventsListContainer: this.#pointsListComponent.element,
      destinations: this.#destinationsModel.getDestinations(),
      offers: this.#offersModel.getOffers(),
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointFormClose
    });

    this.#newPointPresenter.init();
    this.#newEventButton.disabled = true;
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      sortItems: createSortData(this.#currentSortType),
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#sortContainer);
  }

  #renderMessage(message) {
    this.#noPointsComponent = new NoPointsView({ message });
    render(this.#noPointsComponent, this.#sortContainer);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#sortContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      eventsListContainer: this.#pointsListComponent.element,
      destinations: this.#destinationsModel.getDestinations(),
      offers: this.#offersModel.getOffers(),
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isLoadingError) {
      this.#renderMessage(Message.FAILED);
      return;
    }

    const points = this.points;

    if (points.length === 0) {
      this.#renderMessage(EmptyListMessage[this.#filterModel.getFilter()]);
      return;
    }

    this.#renderSort();
    render(this.#pointsListComponent, this.#sortContainer);
    points.forEach((point) => this.#renderPoint(point));
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter?.destroy();

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);
    remove(this.#loadingComponent);
    remove(this.#pointsListComponent);
    this.#sortComponent = null;
    this.#noPointsComponent = null;

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#isLoadingError = data.isError;
        remove(this.#loadingComponent);
        this.#newEventButton.disabled = data.isError;
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter?.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (evt) => {
    const sortType = evt.target.dataset.sortType;

    if (!sortType || sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleNewEventButtonClick = () => {
    this.createNewPoint();
  };

  #handleNewPointFormClose = () => {
    this.#newPointPresenter = null;
    this.#newEventButton.disabled = false;

    if (this.points.length === 0) {
      remove(this.#pointsListComponent);
      this.#renderMessage(EmptyListMessage[this.#filterModel.getFilter()]);
    }
  };
}
