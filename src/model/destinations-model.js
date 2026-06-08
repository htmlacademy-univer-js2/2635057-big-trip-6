export default class DestinationsModel {
  #pointsApiService = null;
  #destinations = [];

  constructor({ pointsApiService }) {
    this.#pointsApiService = pointsApiService;
  }

  getDestinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  getDestinationByName(name) {
    return this.#destinations.find((destination) => destination.name === name);
  }

  async init() {
    try {
      this.#destinations = await this.#pointsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }
  }
}
