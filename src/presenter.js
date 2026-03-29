import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import PointView from './view/point-view.js';
import EditFormView from './view/edit-form-view.js';
import { render } from './render.js';

export default class Presenter {
  constructor() {
    this.filtersContainer = document.querySelector('.trip-controls__filters');
    this.sortContainer = document.querySelector('.trip-events');
    this.eventsList = document.querySelector('.trip-events__list');
  }

  init() {
    // Отрисовка фильтров
    const filtersComponent = new FiltersView();
    render(filtersComponent, this.filtersContainer);

    // Отрисовка сортировки
    const sortComponent = new SortView();
    render(sortComponent, this.sortContainer);

    // Отрисовка формы редактирования (первой в списке)
    const editFormComponent = new EditFormView();
    render(editFormComponent, this.eventsList);

    // Отрисовка 3 точек маршрута
    for (let i = 0; i < 3; i++) {
      const pointComponent = new PointView();
      render(pointComponent, this.eventsList);
    }
  }
}