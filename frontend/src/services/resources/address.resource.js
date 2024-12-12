import {CrudService} from "@/services/api/crud.service";

export class AddressResource extends CrudService {
  constructor() {
    super("/api/addresses");
  }

  getAddresses() {
    return this.get();
  }

  addAddresses(address) {
    return this.post(address);
  }

  updateAddress(address) {
    return this.updateAddress(address);
  }

  removeAddress(addressId) {
    return this.delete(addressId);
  }
}