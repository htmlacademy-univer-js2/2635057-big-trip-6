import Model from './model.js';
import Presenter from './presenter.js';

const model = new Model();
const presenter = new Presenter(model);
presenter.init();