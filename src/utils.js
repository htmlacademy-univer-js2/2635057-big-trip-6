import { FilterType } from './const.js';

const isPointFuture = (point) => new Date(point.startDate) > new Date();
const isPointPast = (point) => new Date(point.endDate) < new Date();
const isPointPresent = (point) => new Date(point.startDate) <= new Date() && new Date(point.endDate) >= new Date();

export const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter(isPointFuture),
  [FilterType.PRESENT]: (points) => points.filter(isPointPresent),
  [FilterType.PAST]: (points) => points.filter(isPointPast)
};

export const sortByDay = (pointA, pointB) => new Date(pointA.startDate) - new Date(pointB.startDate);

export const sortByTime = (pointA, pointB) => {
  const durationPointA = new Date(pointA.endDate) - new Date(pointA.startDate);
  const durationPointB = new Date(pointB.endDate) - new Date(pointB.startDate);

  return durationPointB - durationPointA;
};

export const sortByPrice = (pointA, pointB) => pointB.price - pointA.price;
