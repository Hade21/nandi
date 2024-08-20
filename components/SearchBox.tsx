"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { cn } from "@/lib/utils";
import { setSearchQuery } from "@/services/unitService";
import { UnitTypes } from "@/types";
import { CommandInput } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const SearchBox = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchQuery = useAppSelector((state) => state.units.searchQuery);
  const units = useAppSelector((state) => state.units.units);
  const dispatch = useAppDispatch();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          area-expanded={isOpen}
          className={cn(
            "justify-between w-full",
            !searchQuery && "text-muted-foreground"
          )}
        >
          {searchQuery
            ? units.find((unit) => unit.id === searchQuery)?.name
            : "Search Unit Number"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command>
          <CommandInput
            placeholder="Search unit number"
            className="p-2 bg-transparent"
          ></CommandInput>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {units.map((unit: UnitTypes) => (
                <CommandItem
                  key={unit.id}
                  value={unit.name}
                  onSelect={(currentValue) => {
                    dispatch(
                      setSearchQuery(
                        units.find((unit) => unit.name === currentValue)?.id ===
                          searchQuery
                          ? ""
                          : units.find((unit) => unit.name === currentValue)
                              ?.id!
                      )
                    );
                    setIsOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      searchQuery === unit.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {unit.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBox;
