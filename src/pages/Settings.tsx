import { useState } from "react";
import { Formik, Form } from "formik";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../services/settingsApi";
import { settingsValidationSchema } from "../validation/settingsValidation";
import { TextInput } from "../components/ui/TextInput";
import { SwitchInput } from "../components/ui/SwitchInput";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<"app" | "notification">("app");
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  if (isLoading) return <div>Loading...</div>;

  const initialValues = {
    appSettings: {
      admin_country: settings?.admin_country || "",
      admin_currency_code: settings?.admin_currency_code || "",
      admin_currency: settings?.admin_currency || "",
      admin_timezone: settings?.admin_timezone || "",
      display_date_timezone: settings?.display_date_timezone || "",
      admin_phoneNumber: settings?.admin_phoneNumber || "",
      admin_email: settings?.admin_email || "",
      default_map_load_latitude: settings?.default_map_load_latitude || "",
      default_map_load_longitude: settings?.default_map_load_longitude || "",
      driver_timeout_in_seconds: settings?.driver_timeout_in_seconds || 60,
      default_search_radius: settings?.default_search_radius || 5000,
      Scheduled_request_pre_start_seconds:
        settings?.Scheduled_request_pre_start_seconds || 300,
      number_of_loop_for_nearest_driver:
        settings?.number_of_loop_for_nearest_driver || 3,
      nearest_driver_type: settings?.nearest_driver_type || "SINGLE",
      nearby_providers_call_time: settings?.nearby_providers_call_time || 30,
      providers_realtime_location_update:
        settings?.providers_realtime_location_update || 15,
    },
    notificationSettings: {
      send_sms_whatsapp: settings?.send_sms_whatsapp || false,
      sms_notification: settings?.sms_notification || false,
      email_notification: settings?.email_notification || false,
      draw_path_user_app: settings?.draw_path_user_app || false,
      android_user_app_force_update:
        settings?.android_user_app_force_update || false,
      android_driver_app_force_update:
        settings?.android_driver_app_force_update || false,
      ios_user_app_force_update: settings?.ios_user_app_force_update || false,
      ios_driver_app_force_update:
        settings?.ios_driver_app_force_update || false,
      show_estimation_driver: settings?.show_estimation_driver || false,
      show_estimation_user: settings?.show_estimation_user || false,
    },
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const payload = {
        ...values.appSettings,
        ...values.notificationSettings,
      };
      await updateSettings({ payload, id: settings!.id }).unwrap();
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={settingsValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="flex border-b border-gray-200 mb-6">
              <button
                type="button"
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "app"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("app")}
              >
                App Setting
              </button>
              <button
                type="button"
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "notification"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("notification")}
              >
                Notification Setting
              </button>
            </div>

            {activeTab === "app" && (
              <div className="space-y-6">
                <TextInput
                  name="appSettings.admin_country"
                  label="Admin Country"
                />

                <TextInput
                  name="appSettings.admin_currency_code"
                  label="Admin Currency Code"
                />

                <TextInput
                  name="appSettings.admin_currency"
                  label="Admin Currency"
                />

                <TextInput
                  name="appSettings.admin_timezone"
                  label="Admin Timezone"
                />

                <TextInput
                  name="appSettings.display_date_timezone"
                  label="Display Date Timezone"
                />

                <TextInput
                  name="appSettings.admin_phoneNumber"
                  label="Admin Phone Number"
                />

                <TextInput
                  name="appSettings.admin_email"
                  label="Admin Email Address"
                  type="email"
                />

                <TextInput
                  name="appSettings.default_map_load_latitude"
                  label="Default Map Load Latitude"
                />

                <TextInput
                  name="appSettings.default_map_load_longitude"
                  label="Default Map Load Longitude"
                />

                <TextInput
                  name="appSettings.driver_timeout_in_seconds"
                  label="Driver Timeout in seconds"
                  type="number"
                />

                <TextInput
                  name="appSettings.default_search_radius"
                  label="Default Search Radius"
                  type="number"
                />

                <TextInput
                  name="appSettings.Scheduled_request_pre_start_seconds"
                  label="Scheduled Request Pre Start Seconds"
                  type="number"
                />

                <TextInput
                  name="appSettings.number_of_loop_for_nearest_driver"
                  label="Number of loop for find nearest driver"
                  type="number"
                />

                <TextInput
                  name="appSettings.nearest_driver_type"
                  label="Nearest Driver Type"
                />

                <TextInput
                  name="appSettings.nearby_providers_call_time"
                  label="Near By Providers Api Call Time"
                  type="number"
                />

                <TextInput
                  name="appSettings.providers_realtime_location_update"
                  label="Providers Real Time Location Update Time"
                  type="number"
                />
              </div>
            )}

            {activeTab === "notification" && (
              <div className="space-y-4">
                <SwitchInput
                  name="notificationSettings.send_sms_whatsapp"
                  label="Send SMS via Whatsapp"
                />
                <SwitchInput
                  name="notificationSettings.sms_notification"
                  label="SMS Notification"
                />
                <SwitchInput
                  name="notificationSettings.email_notification"
                  label="Email Notification"
                />
                <SwitchInput
                  name="notificationSettings.draw_path_user_app"
                  label="Draw road path in User app"
                />
                <SwitchInput
                  name="notificationSettings.android_user_app_force_update"
                  label="Android User App Force Update"
                />
                <SwitchInput
                  name="notificationSettings.android_driver_app_force_update"
                  label="Android Driver App Force Update"
                />
                <SwitchInput
                  name="notificationSettings.ios_user_app_force_update"
                  label="IOS User App Force Update"
                />
                <SwitchInput
                  name="notificationSettings.ios_driver_app_force_update"
                  label="IOS Driver App Force Update"
                />
                <SwitchInput
                  name="notificationSettings.show_estimation_driver"
                  label="Show Estimation in Driver App"
                />
                <SwitchInput
                  name="notificationSettings.show_estimation_user"
                  label="Show Estimation in User App"
                />
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-black text-white rounded-md hover:opacity-80"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Settings;
