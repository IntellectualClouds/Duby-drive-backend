const { v4: uuidv4 } = require('uuid');

class Car {
  constructor(data) {
    this.carId = uuidv4();
    this.image = data.image;
    this.modelNo = data.modelNo;
    this.licencePlate = data.licencePlate;
    this.brandId = data.carBrandId;
    this.typeId = data.CarTypeId;
    this.featureIds = data.CarFeatureId;
    this.dealerId = data.dealerId;
    this.status = data.status;
    this.description = data.description;
    this.doors = data.doors;
    this.rentalDays = data.rentalDays;
    this.seats = data.seats;
    this.lugage = data.lugage;
    this.fuelTypeId = data.FuelTypeId;
    this.gssType = data.gssType;
    this.autoTransmission = data.autoTransmission;
    this.additionalMillageCharges = data.additionalMillageCharges;
    this.salikTollCharges = data.salikTollCharges;
    this.additionalDriverInsurance = data.additionalDriverInsurance;
    this.insuranceTypeId = data.InsuranceTypeId;
    this.interiorColor = data.interiorColor;
    this.exteriorColor = data.exteriorColor;
    this.dayBasisRent = data.dayBasisRent;
    this.weekly = data.weekly;
    this.monthly = data.monthly;
    this.discountOffer = data.discountOffer;
    this.securityDeposit = data.securityDeposit;
    this.selectRefund = data.selectRefund;
    this.driverAge = data.driverAge;
    this.seoMeta = data.seoMeta;
    this.metaKeywords = data.metaKeywords;
    this.carImages = data.carImages;
    this.carVideo = data.carVideo;
  }
}

module.exports = Car;
