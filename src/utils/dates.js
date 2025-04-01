import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
import countries from "world-countries";

export const formatCreatedAt = (createdAt) => {
  return format(parseISO(createdAt), "dd MMM, yyyy");
};

export const getCountryCenter = (isoCode) => {
  const country = countries.find((c) => c.cca2 === isoCode.toUpperCase());
  return country ? country.latlng : "Country not found";
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const formattedTime = format(date, "hh:mm a");

  let dayLabel;
  if (isToday(date)) {
    dayLabel = "Today";
  } else if (isYesterday(date)) {
    dayLabel = "Yesterday";
  } else {
    dayLabel = formatDistanceToNow(date, { addSuffix: true }).replace(
      "about ",
      ""
    );
  }

  return `${formattedTime} | ${dayLabel}`;
};

export const formatToTime = (isoString) => {
  const date = new Date(isoString);
  return format(date, "h:mma");
};
