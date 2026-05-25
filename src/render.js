const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
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

function render(component, container, place = RenderPosition.BEFOREEND) {
  container.insertAdjacentElement(place, component.element);
}

function replace(newComponent, oldComponent) {
  oldComponent.element.replaceWith(newComponent.element);
}

export {RenderPosition, AbstractView, render, replace};