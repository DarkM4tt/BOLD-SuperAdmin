import { Field, ErrorMessage } from "formik";

interface TextInputProps {
  name: string;
  label: string;
  type?: string;
}

export const TextInput = ({ name, label, type = "text" }: TextInputProps) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <Field
        name={name}
        type={type}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      <ErrorMessage name={name}>
        {(msg) => <p className="mt-1 text-sm text-red-600">{msg}</p>}
      </ErrorMessage>
    </div>
  );
};
