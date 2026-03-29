import { generatePoints } from './mock/point.js';

export default class Model {
  constructor() {
    this.points = generatePoints(5);
  }

  getPoints() {
    return this.points;
  }
}