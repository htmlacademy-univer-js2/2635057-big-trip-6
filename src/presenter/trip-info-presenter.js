import dayjs from 'dayjs';
import he from 'he';
import TripInfoView from '../view/trip-info-view.js';
import { render, replace, remove, RenderPosition } from '../render.js';
import { sortByDay } from '../utils.js';

const MAX_VISIBLE_CITIES = 3;

export default class TripInfoPresenter {
  #infoContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #tripInfoComponent = null;

  constructor({ infoContainer, pointsModel, destinationsModel, offersModel }) {
    this.#infoContainer = infoContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    const points = [...this.#pointsModel.getPoints()].sort(sortByDay);
    const prevTripInfoComponent = this.#tripInfoComponent;

    if (points.length === 0) {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
      return;
    }

    this.#tripInfoComponent = new TripInfoView({
      title: this.#getTitle(points),
      dates: this.#getDates(points),
      cost: this.#getCost(points)
    });

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #getTitle(points) {
    const names = points.map((point) => {
      const destination = this.#destinationsModel.getDestinationById(point.destination);
      return he.encode(destination ? destination.name : '');
    });

    if (names.length <= MAX_VISIBLE_CITIES) {
      return names.join(' &mdash; ');
    }

    return `${names[0]} &mdash; ... &mdash; ${names[names.length - 1]}`;
  }

  #getDates(points) {
    const startDate = dayjs(points[0].dateFrom).format('D MMM').toUpperCase();
    const endDate = dayjs(points[points.length - 1].dateTo).format('D MMM').toUpperCase();

    return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
  }

  #getCost(points) {
    return points.reduce((total, point) => {
      const typeOffers = this.#offersModel.getOffersByType(point.type);
      const offersCost = typeOffers
        .filter((offer) => point.offers.includes(offer.id))
        .reduce((sum, offer) => sum + offer.price, 0);

      return total + point.basePrice + offersCost;
    }, 0);
  }

  #handleModelEvent = () => {
    this.#renderTripInfo();
  };
}
