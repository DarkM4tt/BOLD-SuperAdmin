import { useField } from "formik";

interface SwitchInputProps {
  name: string;
  label: string;
}

export const SwitchInput = ({ name, label }: SwitchInputProps) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = () => {
    helpers.setValue(!field.value);
  };

  return (
    <div className="flex items-center justify-between py-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <button
        type="button"
        role="switch"
        aria-checked={field.value}
        onClick={handleChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          field.value ? "bg-black" : "bg-gray-400"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            field.value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};
