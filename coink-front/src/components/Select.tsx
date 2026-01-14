interface SelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ id: number; name: string }>;
  error?: string;
  placeholder?: string;
}

export default function Select({ label, value, onChange, options, error, placeholder }: SelectProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'input-error' : ''}`}
      >
        <option value="">{placeholder || `Seleccione ${label.toLowerCase()}`}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
