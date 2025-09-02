'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/core/lib/utils';
import { useDictionary } from '@/core/hooks/use-dictionary';

export interface List<T extends string | number> {
  value: T;
  label: string;
}

interface SearchableComboboxProps<T extends string | number> {
  options: List<T>[];
  value?: T;
  onValueChange: (value: T | undefined) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function SearchableCombobox<T extends string | number>({
  options,
  value,
  onValueChange,
  placeholder = 'انتخاب کنید...',
  label,
  disabled = false,
  error,
  className,
}: SearchableComboboxProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const { dictionary } = useDictionary();
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <label>{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between h-10',
              !selectedOption && 'text-muted-foreground',
              error && 'border-red-500'
            )}
            disabled={disabled}
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={dictionary.common.search} />
            <CommandList>
              <CommandEmpty>{dictionary.common.noResult}</CommandEmpty>
              <CommandGroup>
                {options.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onValueChange(
                        option.value === value ? undefined : option.value
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
