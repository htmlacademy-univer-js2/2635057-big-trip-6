import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { replace, render } from '../render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #eventsListContainer = null;
  #destinations = [];
  #onDataChange = null;
  #onModeChange = null;

  #point = null;
  #pointComponent = null;
  #editFormComponent = null;
  #mode = Mode.DEFAULT;

  constructor({ eventsListContainer, destinations, onDataChange, onModeChange }) {
    this.#eventsListContainer = eventsListContainer;
    this.#destinations = destinations;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      onRollupClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editFormComponent = new EditFormView({
      point: this.#point,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick
    });

    if (!prevPointComponent || !prevEditFormComponent) {
      render(this.#pointComponent, this.#eventsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }
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

  #handleRollupClick = (evt) => {
    evt.preventDefault();
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (evt) => {
    evt.preventDefault();
    this.#replaceFormToPoint();
  };

  #handleFavoriteClick = (evt) => {
    evt.preventDefault();
    this.#onDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };
}
