export default class OffersModel {
  #pointsApiService = null;
  #offers = [];

  constructor({ pointsApiService }) {
    this.#pointsApiService = pointsApiService;
  }

  getOffers() {
    return this.#offers;
  }

  getOffersByType(type) {
    const offersByType = this.#offers.find((offerGroup) => offerGroup.type === type);
    return offersByType ? offersByType.offers : [];
  }

  async init() {
    try {
      this.#offers = await this.#pointsApiService.offers;
    } catch (err) {
      this.#offers = [];
    }
  }
}
