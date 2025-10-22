import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  className,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn('w-full', className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between px-4 py-2.5 text-left bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200',
            error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500',
            disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'hover:border-gray-400',
            isOpen && 'border-primary-500 ring-2 ring-primary-500/20'
          )}
        >
          <span className="flex items-center space-x-2">
            {selectedOption?.icon && <span>{selectedOption.icon}</span>}
            <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <ChevronDown
            size={20}
            className={cn(
              'text-gray-400 transition-transform duration-200',
              isOpen && 'transform rotate-180'
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No options available</div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    'w-full flex items-center space-x-2 px-4 py-2.5 text-left text-sm transition-colors',
                    option.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50',
                    option.value === value && 'bg-primary-50 text-primary-700 font-medium'
                  )}
                >
                  {option.icon && <span>{option.icon}</span>}
                  <span>{option.label}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Dropdown;
