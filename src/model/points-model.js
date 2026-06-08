import Observable from '../observable.js';
import { generatePoints } from '../mock/point.js';

export default class PointsModel extends Observable {
  #points = [];

  constructor() {
    super();
    this.#points = generatePoints(5);
  }

  getPoints() {
    return this.#points;
  }

  setPoints(points) {
    this.#points = [...points];
  }

  updatePoint(updateType, update) {
    this.#points = this.#points.map((point) => point.id === update.id ? update : point);
    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [update, ...this.#points];
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    this.#points = this.#points.filter((point) => point.id !== update.id);
    this._notify(updateType, update);
  }
}
