import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { replace, render, remove } from '../render.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #eventsListContainer = null;
  #destinations = [];
  #offers = [];
  #onDataChange = null;
  #onModeChange = null;

  #point = null;
  #pointComponent = null;
  #editFormComponent = null;
  #mode = Mode.DEFAULT;

  constructor({ eventsListContainer, destinations, offers, onDataChange, onModeChange }) {
    this.#eventsListContainer = eventsListContainer;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    const destination = this.#destinations.find((item) => item.id === point.destination);
    const offerGroup = this.#offers.find((group) => group.type === point.type);
    const typeOffers = offerGroup ? offerGroup.offers : [];
    const selectedOffers = typeOffers.filter((offer) => point.offers.includes(offer.id));

    this.#pointComponent = new PointView({
      point: this.#point,
      destination,
      offers: selectedOffers,
      onRollupClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editFormComponent = new EditFormView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
      onDeleteClick: this.#handleDeleteClick
    });

    if (!prevPointComponent || !prevEditFormComponent) {
      render(this.#pointComponent, this.#eventsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevEditFormComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#mode !== Mode.EDITING) {
      return;
    }

    this.#replaceFormToPoint();
  }

  #replacePointToForm = () => {
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = (evt) => {
    evt.preventDefault();
    this.#onModeChange();
    this.#replacePointToForm();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (update) => {
    // Форма скроется автоматически при перерисовке после успешного ответа сервера
    this.#onDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, update);
  };

  #handleDeleteClick = (point) => {
    this.#onDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };

  #handleFavoriteClick = (evt) => {
    evt.preventDefault();
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite }
    );
  };
}
