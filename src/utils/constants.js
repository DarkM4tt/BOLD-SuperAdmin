export function getCarType(carType) {
  if (carType === "REGULAR") {
    return "5 seater car";
  }
  if (carType === "XL") {
    return "7 seater";
  }
  if (carType === "PREMIUM") {
    return "Luxury car";
  }
  if (carType === "ELECTRIC") {
    return "Electric car";
  }
  if (carType === "VAN") {
    return "9 seater car";
  }
  return "Null";
}
