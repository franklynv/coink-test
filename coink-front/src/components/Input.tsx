interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}

export default function Input({ label, value, onChange, error, type = "text", placeholder }: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${error ? 'input-error' : ''}`}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
