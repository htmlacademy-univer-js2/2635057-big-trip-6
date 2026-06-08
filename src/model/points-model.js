import Observable from '../observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  getPoints() {
    return this.#points;
  }

  async init() {
    try {
      this.#points = await this.#pointsApiService.points;
    } catch (err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const updatedPoint = await this.#pointsApiService.updatePoint(update);
    this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
    this._notify(updateType, updatedPoint);
  }

  async addPoint(updateType, update) {
    const newPoint = await this.#pointsApiService.addPoint(update);
    this.#points = [newPoint, ...this.#points];
    this._notify(updateType, newPoint);
  }

  async deletePoint(updateType, update) {
    await this.#pointsApiService.deletePoint(update);
    this.#points = this.#points.filter((point) => point.id !== update.id);
    this._notify(updateType);
  }
}
