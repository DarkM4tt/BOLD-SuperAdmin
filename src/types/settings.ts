export interface SettingsData {
  admin_country: string;
  admin_currency_code: string;
  admin_currency: string;
  admin_timezone: string;
  display_date_timezone: string;
  admin_phoneNumber: string;
  admin_email: string;
  default_map_load_latitude: string;
  default_map_load_longitude: string;
  driver_timeout_in_seconds: number;
  default_search_radius: number;
  Scheduled_request_pre_start_seconds: number;
  number_of_loop_for_nearest_driver: number;
  nearest_driver_type: string;
  nearby_providers_call_time: number;
  providers_realtime_location_update: number;
  send_sms_whatsapp: boolean;
  sms_notification: boolean;
  email_notification: boolean;
  draw_path_user_app: boolean;
  android_user_app_force_update: boolean;
  android_driver_app_force_update: boolean;
  ios_user_app_force_update: boolean;
  ios_driver_app_force_update: boolean;
  show_estimation_driver: boolean;
  show_estimation_user: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface SettingsFormValues {
  appSettings: {
    admin_country: string;
    admin_currency_code: string;
    admin_currency: string;
    admin_timezone: string;
    display_date_timezone: string;
    admin_phoneNumber: string;
    admin_email: string;
    default_map_load_latitude: string;
    default_map_load_longitude: string;
    driver_timeout_in_seconds: number;
    default_search_radius: number;
    Scheduled_request_pre_start_seconds: number;
    number_of_loop_for_nearest_driver: number;
    nearest_driver_type: string;
    nearby_providers_call_time: number;
    providers_realtime_location_update: number;
  };
  notificationSettings: {
    send_sms_whatsapp: boolean;
    sms_notification: boolean;
    email_notification: boolean;
    draw_path_user_app: boolean;
    android_user_app_force_update: boolean;
    android_driver_app_force_update: boolean;
    ios_user_app_force_update: boolean;
    ios_driver_app_force_update: boolean;
    show_estimation_driver: boolean;
    show_estimation_user: boolean;
  };
}
