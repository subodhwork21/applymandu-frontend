'use client';

import * as React from 'react';
import { useState, useRef } from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface DropdownWithAddOptionProps {
    options: {value: string, label: string, id: string}[] | string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    addOptionText?: string;
    addNewPlaceholder?: string;
    onAddNewOption?: (newOption: string) => Promise<boolean>; // New prop for server-side saving
  }

const DropdownWithAddOption = React.forwardRef<
  HTMLDivElement,
  DropdownWithAddOptionProps
>(({
  options: initialOptions,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  addOptionText = "+ Add new option...",
  addNewPlaceholder = "Type new option...",
  onAddNewOption,
}, ref) => {
  const [options, setOptions] = useState(initialOptions);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newOption, setNewOption] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Function to get the label of the selected option
  const getSelectedLabel = () => {
    if (!value) return '';
    
    const selectedOption = options.find(option => {
      if (typeof option === 'string') {
        return option === value;
      } else {
        return option.id === value;
      }
    });
    
    if (!selectedOption) return value;
    
    return typeof selectedOption === 'string' 
      ? selectedOption 
      : selectedOption.label;
  };
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAdding(false);
        setNewOption('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle selection from dropdown
  const handleSelect = (selectedValue: string) => {
    // If "Add new option..." is selected
    if (selectedValue === "add_new") {
      setIsAdding(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
      return;
    }
    
    onChange(selectedValue);
    setIsOpen(false);
  };
  
  const addNewOption = async () => {
    if (newOption.trim() === '') return;
    
    // Check if option already exists
    const optionExists = Array.isArray(options) && options.some(option => {
      if (typeof option === 'string') {
        return option === newOption;
      } else if (typeof option === 'object' && 'label' in option) {
        return option.label === newOption;
      }
      return false;
    });
    
    if (!optionExists) {
      // If onAddNewOption is provided, call it first
      if (onAddNewOption) {
        const success = await onAddNewOption(newOption);
        if (!success) {
          // If server-side saving failed, don't add to local options
          return;
        }
      }
      
      // Add to options list
      const newOptionObj = typeof options[0] === 'string' 
        ? newOption 
        : { value: newOption, label: newOption, id: `new-${Date.now()}` };
      
      setOptions([...options, newOptionObj]);
      
      // Select the newly added option
      onChange(typeof newOptionObj === 'string' ? newOptionObj : newOptionObj.id);
    }
    
    // Reset add new mode
    setNewOption('');
    setIsAdding(false);
    setIsOpen(false);
  };
  
  // Handle key press in the new option input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addNewOption();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewOption('');
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className={cn(
        "relative w-full",
        className
      )}
    >
      {/* Dropdown trigger */}
      {!isAdding && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "cursor-pointer"
          )}
        >
          <span className={value ? "" : "text-muted-foreground"}>
            {getSelectedLabel() || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      )}
      
      {/* Input field for adding new option */}
      {isAdding && (
        <div className="flex">
          <Input
            ref={inputRef}
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={addNewPlaceholder}
            className="rounded-r-none"
            autoFocus
          />
          <Button
            onClick={addNewOption}
            className="rounded-l-none"
          >
            Add
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsAdding(false);
              setNewOption('');
            }}
            className="ml-2"
          >
            Cancel
          </Button>
        </div>
      )}
      
      {/* Dropdown menu */}
      {isOpen && !isAdding && (
        <div className={cn(
          "absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80",
        )}>
          <div className="max-h-60 overflow-auto">
            {/* Add new option item */}
            <div
              className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                "cursor-pointer text-blue-600"
              )}
              onClick={() => handleSelect("add_new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              {addOptionText}
            </div>
            
            {/* Divider */}
            <div className="-mx-1 my-1 h-px bg-muted" />
            
            {/* Options list */}
            {options.map((option, index) => {
              const optionId = typeof option === 'string' ? option : option.id;
              const optionLabel = typeof option === 'string' ? option : option.label;
              
              return (
                <div
                  key={index}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    "cursor-pointer",
                    optionId === value && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handleSelect(optionId)}
                >
                  {optionLabel}
                  {optionId === value && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

DropdownWithAddOption.displayName = 'DropdownWithAddOption';

export { DropdownWithAddOption };
