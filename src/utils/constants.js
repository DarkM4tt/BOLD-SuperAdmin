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

export const rideStatusOptions = [
  { label: "All", value: "" },
  { label: "Booked", value: "BOOKED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Arrived", value: "ARRIVED" },
  { label: "Onroute", value: "ONROUTE" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Canceled", value: "CANCELED" },
  { label: "Completed", value: "COMPLETED" },
];
