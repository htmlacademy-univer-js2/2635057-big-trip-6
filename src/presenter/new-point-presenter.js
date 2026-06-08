import EditFormView from '../view/edit-form-view.js';
import { render, remove, RenderPosition } from '../render.js';
import { UserAction, UpdateType, TYPES } from '../const.js';

const createBlankPoint = () => {
  const now = new Date().toISOString();

  return {
    type: TYPES[0],
    destination: '',
    destinationId: null,
    startDate: now,
    endDate: now,
    price: 0,
    offers: [],
    isFavorite: false
  };
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
      point: createBlankPoint(),
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

  #handleFormSubmit = (point) => {
    this.#onDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      { ...point, id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() }
    );
    this.destroy();
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
