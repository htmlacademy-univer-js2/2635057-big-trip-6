import { OFFERS } from '../const.js';

export default class OffersModel {
  #offers = OFFERS;

  getOffers() {
    return this.#offers;
  }

  getOffersByType(type) {
    const offersByType = this.#offers.find((offerGroup) => offerGroup.type === type);
    return offersByType ? offersByType.offers : [];
  }
}
