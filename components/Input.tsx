import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="mb-5 group">
      {label && <label className="block text-green-900 font-semibold mb-2 ml-1 text-sm tracking-wide transition-colors group-focus-within:text-primary">{label}</label>}
      <input 
        className={`w-full px-5 py-4 rounded-2xl bg-green-50/80 border-2 border-transparent text-green-900 placeholder-green-700/30 focus:bg-white focus:border-primary focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-300 ease-out font-medium shadow-sm hover:bg-green-50 ${className}`}
        {...props}
      />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
    return (
      <div className="mb-5 group">
        {label && <label className="block text-green-900 font-semibold mb-2 ml-1 text-sm tracking-wide transition-colors group-focus-within:text-primary">{label}</label>}
        <div className="relative">
            <select 
            className={`w-full px-5 py-4 rounded-2xl bg-green-50/80 border-2 border-transparent text-green-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-300 appearance-none font-medium shadow-sm cursor-pointer hover:bg-green-50 ${className}`}
            {...props}
            >
                <option value="">-- {label} --</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-green-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>
      </div>
    );
  };