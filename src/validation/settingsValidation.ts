import * as yup from "yup";

export const settingsValidationSchema = yup.object().shape({
  appSettings: yup.object().shape({
    admin_country: yup.string().required("Admin country is required"),
    admin_currency_code: yup.string().required("Currency code is required"),
    admin_currency: yup.string().required("Currency is required"),
    admin_timezone: yup.string().required("Timezone is required"),
    display_date_timezone: yup
      .string()
      .required("Display timezone is required"),
    admin_phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(/^\+[1-9]\d{1,14}$/, "Phone number must be in E.164 format"),
    admin_email: yup
      .string()
      .email("Invalid email")
      .required("Email is required"),
    default_map_load_latitude: yup
      .string()
      .required("Latitude is required")
      .matches(/^-?\d{1,3}\.\d+$/, "Invalid latitude format"),
    default_map_load_longitude: yup
      .string()
      .required("Longitude is required")
      .matches(/^-?\d{1,3}\.\d+$/, "Invalid longitude format"),
    driver_timeout_in_seconds: yup
      .number()
      .required("Driver timeout is required")
      .positive("Must be positive number")
      .integer("Must be integer"),
    default_search_radius: yup
      .number()
      .required("Search radius is required")
      .positive("Must be positive number"),
    Scheduled_request_pre_start_seconds: yup
      .number()
      .required("Pre-start seconds is required")
      .positive("Must be positive number")
      .integer("Must be integer"),
    number_of_loop_for_nearest_driver: yup
      .number()
      .required("Number of loops is required")
      .positive("Must be positive number")
      .integer("Must be integer"),
    nearest_driver_type: yup.string().required("Driver type is required"),
    nearby_providers_call_time: yup
      .number()
      .required("Call time is required")
      .positive("Must be positive number")
      .integer("Must be integer"),
    providers_realtime_location_update: yup
      .number()
      .required("Update time is required")
      .positive("Must be positive number")
      .integer("Must be integer"),
  }),
});
