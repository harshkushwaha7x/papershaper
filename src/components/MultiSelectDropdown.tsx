import React, { useState } from "react";

interface MultiSelectDropdownProps {
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (selected: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedOptions,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  const handleOptionToggle = (option: string) => {
    if (selectedOptions.includes(option)) {
      onSelectionChange(selectedOptions.filter((item) => item !== option));
    } else {
      onSelectionChange([...selectedOptions, option]);
    }
  };

  const handleRemoveTag = (option: string) => {
    onSelectionChange(selectedOptions.filter((item) => item !== option));
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="relative w-full mb-5">
      {/* Selected Tags */}
      <div
        className="flex items-center flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-gray-50 cursor-pointer focus-within:border-green-500"
        onClick={toggleDropdown}
      >
        {selectedOptions.map((option) => (
          <div
            key={option}
            className="flex items-center px-2 py-1 bg-green-600 text-white rounded-md text-sm"
          >
            {option}
            <button
              type="button"
              onClick={() => handleRemoveTag(option)}
              className="ml-1 text-green-100 hover:text-green-300 focus:outline-none"
            >
              &times;
            </button>
          </div>
        ))}
        {/* Placeholder or Input */}
        <input
          type="text"
          placeholder={selectedOptions.length === 0 ? "Select options" : ""}
          value={searchText}
          onChange={handleSearchChange}
          onClick={toggleDropdown}
          className="flex-grow p-1 bg-transparent outline-none text-gray-700"
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {/* Close Button */}
          <div className="flex items-center justify-between p-2">
            <input
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={handleSearchChange}
              className="w-full px-3 py-1 border border-gray-200 rounded-md focus:border-green-500"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
          </div>
          {/* Options */}
          {filteredOptions.map((option) => (
            <div
              key={option}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionToggle(option)}
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionToggle(option)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded-sm"
              />
              <label className="ml-2 text-gray-700">{option}</label>
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <p className="text-center text-gray-500 p-2">No options found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
