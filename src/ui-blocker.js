export default class UiBlocker {
  #element = null;

  constructor() {
    this.#element = document.createElement('div');
    this.#element.classList.add('ui-blocker');
  }

  block() {
    document.body.append(this.#element);
    document.body.classList.add('ui-blocker-active');
  }

  unblock() {
    this.#element.remove();
    document.body.classList.remove('ui-blocker-active');
  }
}
