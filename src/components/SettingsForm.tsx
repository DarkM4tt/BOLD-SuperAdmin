import * as Yup from "yup";
import { useFormik } from "formik";
import { SettingsFormData } from "../types/settings";

interface SettingsFormProps {
  initialData: SettingsFormData;
  onSubmit: (values: SettingsFormData) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const validationSchema = Yup.object().shape({
    adminCountry: Yup.string().required("Required"),
    adminCurrencyCode: Yup.string().required("Required"),
    adminCurrency: Yup.string().required("Required"),
    adminTimezone: Yup.string().required("Required"),
    displayDateTimezone: Yup.string().required("Required"),
    adminPhoneNumber: Yup.string().required("Required"),
    adminEmailAddress: Yup.string().email("Invalid email").required("Required"),
    defaultMapLoadLatitude: Yup.number().required("Required"),
    defaultMapLoadLongitude: Yup.number().required("Required"),
    driverTimeoutInSeconds: Yup.number().required("Required"),
    defaultSearchRadius: Yup.number().required("Required"),
    scheduledRequestPreStartSeconds: Yup.number().required("Required"),
    numberOfLoopForFindNearestDriver: Yup.number().required("Required"),
    nearestDriverType: Yup.string().required("Required"),
    nextByProvidersApiCallTime: Yup.number().required("Required"),
    providersRealTimeLocationUpdateTime: Yup.number().required("Required"),
  });

  const formik = useFormik<SettingsFormData>({
    initialValues: initialData,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Column */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="adminCountry"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Country
              </label>
              <input
                type="text"
                id="adminCountry"
                name="adminCountry"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.adminCountry}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.adminCountry && formik.errors.adminCountry ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.adminCountry}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="adminCurrencyCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Currency Code
              </label>
              <input
                type="text"
                id="adminCurrencyCode"
                name="adminCurrencyCode"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.adminCurrencyCode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.adminCurrencyCode &&
              formik.errors.adminCurrencyCode ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.adminCurrencyCode}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="adminCurrency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Currency
              </label>
              <input
                type="text"
                id="adminCurrency"
                name="adminCurrency"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.adminCurrency}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.adminCurrency && formik.errors.adminCurrency ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.adminCurrency}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="adminTimezone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Timezone
              </label>
              <select
                id="adminTimezone"
                name="adminTimezone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.adminTimezone}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Timezone</option>
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
              </select>
              {formik.touched.adminTimezone && formik.errors.adminTimezone ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.adminTimezone}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="displayDateTimezone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Display DateTimezone
              </label>
              <select
                id="displayDateTimezone"
                name="displayDateTimezone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.displayDateTimezone}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Timezone</option>
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
              </select>
              {formik.touched.displayDateTimezone &&
              formik.errors.displayDateTimezone ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.displayDateTimezone}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="adminPhoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Phone Number
              </label>
              <input
                type="text"
                id="adminPhoneNumber"
                name="adminPhoneNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.adminPhoneNumber}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.adminPhoneNumber &&
              formik.errors.adminPhoneNumber ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.adminPhoneNumber}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="adminEmailAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Email Address
              </label>
              <input
                type="email"
                id="adminEmailAddress"
                name="adminEmailAddress"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.adminEmailAddress}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.adminEmailAddress &&
              formik.errors.adminEmailAddress ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.adminEmailAddress}
                </div>
              ) : null}
            </div>
          </div>

          {/* Second Column */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="defaultMapLoadLatitude"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Default Map Load Latitude
              </label>
              <input
                type="number"
                id="defaultMapLoadLatitude"
                name="defaultMapLoadLatitude"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.defaultMapLoadLatitude}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.defaultMapLoadLatitude &&
              formik.errors.defaultMapLoadLatitude ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.defaultMapLoadLatitude}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="defaultMapLoadLongitude"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Default Map Load Longitude
              </label>
              <input
                type="number"
                id="defaultMapLoadLongitude"
                name="defaultMapLoadLongitude"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.defaultMapLoadLongitude}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.defaultMapLoadLongitude &&
              formik.errors.defaultMapLoadLongitude ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.defaultMapLoadLongitude}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="driverTimeoutInSeconds"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Driver Timeout in seconds
              </label>
              <input
                type="number"
                id="driverTimeoutInSeconds"
                name="driverTimeoutInSeconds"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.driverTimeoutInSeconds}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.driverTimeoutInSeconds &&
              formik.errors.driverTimeoutInSeconds ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.driverTimeoutInSeconds}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="defaultSearchRadius"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Default Search Radius
              </label>
              <input
                type="number"
                id="defaultSearchRadius"
                name="defaultSearchRadius"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.defaultSearchRadius}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.defaultSearchRadius &&
              formik.errors.defaultSearchRadius ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.defaultSearchRadius}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="scheduledRequestPreStartSeconds"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Scheduled Request Pre Start Seconds
              </label>
              <input
                type="number"
                id="scheduledRequestPreStartSeconds"
                name="scheduledRequestPreStartSeconds"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.scheduledRequestPreStartSeconds}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.scheduledRequestPreStartSeconds &&
              formik.errors.scheduledRequestPreStartSeconds ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.scheduledRequestPreStartSeconds}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="numberOfLoopForFindNearestDriver"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Number of loop for find nearest driver
              </label>
              <input
                type="number"
                id="numberOfLoopForFindNearestDriver"
                name="numberOfLoopForFindNearestDriver"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.numberOfLoopForFindNearestDriver}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.numberOfLoopForFindNearestDriver &&
              formik.errors.numberOfLoopForFindNearestDriver ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.numberOfLoopForFindNearestDriver}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="nearestDriverType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nearest Driver Type
              </label>
              <select
                id="nearestDriverType"
                name="nearestDriverType"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nearestDriverType}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Driver Type</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="both">Both</option>
              </select>
              {formik.touched.nearestDriverType &&
              formik.errors.nearestDriverType ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.nearestDriverType}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="nextByProvidersApiCallTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Next By Providers Api Call Time
              </label>
              <input
                type="number"
                id="nextByProvidersApiCallTime"
                name="nextByProvidersApiCallTime"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nextByProvidersApiCallTime}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.nextByProvidersApiCallTime &&
              formik.errors.nextByProvidersApiCallTime ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.nextByProvidersApiCallTime}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="providersRealTimeLocationUpdateTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Providers Real Time Location Update Time
              </label>
              <input
                type="number"
                id="providersRealTimeLocationUpdateTime"
                name="providersRealTimeLocationUpdateTime"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.providersRealTimeLocationUpdateTime}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.providersRealTimeLocationUpdateTime &&
              formik.errors.providersRealTimeLocationUpdateTime ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.providersRealTimeLocationUpdateTime}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
