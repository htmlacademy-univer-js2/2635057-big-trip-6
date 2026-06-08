import { FilterType } from './const.js';

const isPointFuture = (point) => new Date(point.dateFrom) > new Date();
const isPointPast = (point) => new Date(point.dateTo) < new Date();
const isPointPresent = (point) => new Date(point.dateFrom) <= new Date() && new Date(point.dateTo) >= new Date();

export const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter(isPointFuture),
  [FilterType.PRESENT]: (points) => points.filter(isPointPresent),
  [FilterType.PAST]: (points) => points.filter(isPointPast)
};

export const sortByDay = (pointA, pointB) => new Date(pointA.dateFrom) - new Date(pointB.dateFrom);

export const sortByTime = (pointA, pointB) => {
  const durationPointA = new Date(pointA.dateTo) - new Date(pointA.dateFrom);
  const durationPointB = new Date(pointB.dateTo) - new Date(pointB.dateFrom);

  return durationPointB - durationPointA;
};

export const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const capitalize = (str) => str ? `${str[0].toUpperCase()}${str.slice(1)}` : '';
