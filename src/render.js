const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend'
};

function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

class AbstractView {
  #element = null;

  get template() {
    throw new Error('Abstract method not implemented: template');
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

class AbstractStatefulView extends AbstractView {
  _state = null;

  get state() {
    return this._state;
  }

  _setState(partialState) {
    this._state = { ...this._state, ...partialState };
  }

  updateElement(partialState) {
    this._setState(partialState);
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.element;
    parent.replaceChild(newElement, prevElement);
    this._restoreHandlers();
  }

  _restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}

function render(component, container, place = RenderPosition.BEFOREEND) {
  container.insertAdjacentElement(place, component.element);
}

function replace(newComponent, oldComponent) {
  oldComponent.element.replaceWith(newComponent.element);
}

export { RenderPosition, AbstractView, AbstractStatefulView, render, replace };
