import EditFormView from '../view/edit-form-view.js';
import { render, remove, RenderPosition } from '../render.js';
import { UserAction, UpdateType } from '../const.js';

const DEFAULT_TYPE = 'flight';

const BLANK_POINT = {
  type: DEFAULT_TYPE,
  destination: null,
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  offers: [],
  isFavorite: false
};

export default class NewPointPresenter {
  #eventsListContainer = null;
  #destinations = [];
  #offers = [];
  #onDataChange = null;
  #onDestroy = null;

  #editFormComponent = null;

  constructor({ eventsListContainer, destinations, offers, onDataChange, onDestroy }) {
    this.#eventsListContainer = eventsListContainer;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }

  init() {
    if (this.#editFormComponent !== null) {
      return;
    }

    this.#editFormComponent = new EditFormView({
      point: { ...BLANK_POINT },
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: true,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleCancelClick
    });

    render(this.#editFormComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#editFormComponent === null) {
      return;
    }

    remove(this.#editFormComponent);
    this.#editFormComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#onDestroy();
  }

  setSaving() {
    this.#editFormComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    this.#editFormComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    });

    this.#editFormComponent.shake();
  }

  #handleFormSubmit = (point) => {
    // Форма скроется автоматически при перерисовке после успешного ответа сервера
    this.#onDataChange(UserAction.ADD_POINT, UpdateType.MAJOR, point);
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
