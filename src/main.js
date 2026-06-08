import './styles/shake.css';
import PointsApiService from './points-api-service.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import Presenter from './presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const tripMainContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({ pointsApiService });
const destinationsModel = new DestinationsModel({ pointsApiService });
const offersModel = new OffersModel({ pointsApiService });
const filterModel = new FilterModel();

const presenter = new Presenter({
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel
});

const tripInfoPresenter = new TripInfoPresenter({
  infoContainer: tripMainContainer,
  pointsModel,
  destinationsModel,
  offersModel
});

tripInfoPresenter.init();
filterPresenter.init();
presenter.init();

const bootstrap = async () => {
  try {
    await Promise.all([destinationsModel.init(), offersModel.init()]);
    await pointsModel.init();
  } catch (err) {
    pointsModel.setLoadFailed();
  }
};

bootstrap();
