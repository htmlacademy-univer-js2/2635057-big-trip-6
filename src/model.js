import { DESTINATIONS } from './const.js';
import { generatePoints } from './mock/point.js';

export default class Model {
  #points = [];

  constructor() {
    this.#points = generatePoints(5);
  }

  getPoints() {
    return this.#points;
  }

  getDestinations() {
    return DESTINATIONS;
  }

  updatePoint(updatedPoint) {
    this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
  }
}