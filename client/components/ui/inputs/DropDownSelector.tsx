import React, { useState, useMemo } from "react";
import { Combobox } from "@headlessui/react";
import {
  HiOutlineSearch,
  HiOutlineCheck,
  HiOutlineChevronDown,
} from "react-icons/hi";
import getInitials from "@/utils/getInitials";

// Option type for general use
export type DropDownOption = {
  value: string;
  label: string;
  subtext?: string;
};

type DropDownSelectorProps = {
  options: DropDownOption[];
  value: DropDownOption | null;
  onChange: (option: DropDownOption | null) => void;
  placeholder?: string;
  getOptionLabel?: (option: DropDownOption) => string;
  getOptionValue?: (option: DropDownOption) => string;
  className?: string;
};

const DropDownSelector: React.FC<DropDownSelectorProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.value,
  className = "",
}) => {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    const lowerQuery = query.toLowerCase();
    return options.filter(
      (option) =>
        getOptionLabel(option).toLowerCase().includes(lowerQuery) ||
        option.subtext?.toLowerCase().includes(lowerQuery)
    );
  }, [options, query, getOptionLabel]);

  return (
    <Combobox value={value} onChange={onChange} nullable>
      <div className={`relative w-full ${className}`}>
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 shadow-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-10 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 bg-transparent outline-none"
            displayValue={(option: DropDownOption) =>
              option ? getOptionLabel(option) : ""
            }
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            autoComplete="off"
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <HiOutlineSearch
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <HiOutlineChevronDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-x-hidden overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredOptions.length === 0 && (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              No options found.
            </div>
          )}
          {filteredOptions.map((option) => (
            <Combobox.Option
              key={getOptionValue(option)}
              value={option}
              className={({ active, selected, disabled }) =>
                `relative flex items-center gap-3 cursor-pointer select-none py-2 px-4 transition-colors rounded-md
                ${active ? "bg-primary-100 text-primary-900" : "text-gray-900"}
                ${selected ? "font-semibold" : ""}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                hover:bg-gray-100`
              }
            >
              {/* Avatar as initials from label */}
              <span className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-sm">
                {getInitials(getOptionLabel(option))}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="block truncate text-sm font-medium">
                    {getOptionLabel(option)}
                  </span>
                </div>
                {option.subtext && (
                  <span className="block text-xs text-gray-500 truncate">
                    {option.subtext}
                  </span>
                )}
              </div>
              <span className="ml-2 flex items-center">
                <HiOutlineCheck
                  className="h-5 w-5 text-primary-600 opacity-0 group-data-[selected=true]:opacity-100"
                  aria-hidden="true"
                />
              </span>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
      {/* Selected client feedback */}
      {value && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">
          <span className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-lg">
            {getInitials(getOptionLabel(value))}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">
              {getOptionLabel(value)}
            </div>
            {value.subtext && (
              <div className="text-xs text-gray-500 truncate">
                {value.subtext}
              </div>
            )}
          </div>
        </div>
      )}
    </Combobox>
  );
};

export default DropDownSelector;
