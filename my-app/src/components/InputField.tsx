// components/InputField.tsx
import { Field, ErrorMessage } from 'formik';

const InputField = ({ label, name, type, placeholder, autoComplete }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-[#d4ef00]">{label}:</label>
    <Field
      id={name}
      name={name}
      type={type}
      className="bg-[#3a3a3a] text-white p-2 rounded-md border border-[#d4ef00]"
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

export default InputField;
