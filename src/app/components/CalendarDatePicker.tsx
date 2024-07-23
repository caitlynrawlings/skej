import * as React from 'react'
import { useState } from 'react'

import {Button, Calendar, CalendarCell, CalendarGrid, CalendarGridBody, CalendarGridHeader, CalendarHeaderCell, DateInput, DatePicker, DateSegment, Dialog, Group, Heading, Label, Popover} from 'react-aria-components';
import type {ButtonProps, DateValue, PopoverProps} from 'react-aria-components';
import ChevronUpDownIcon from '@spectrum-icons/workflow/ChevronUpDown';
import ChevronLeftIcon from '@spectrum-icons/workflow/ChevronLeft';
import ChevronRightIcon from '@spectrum-icons/workflow/ChevronRight';

interface CalendarDatePickerProps {
    onChange: (date: DateValue) => void
}

export default function CalendarDatePicker({ onChange }: CalendarDatePickerProps) {
    // can get month, day, year fields from DateValue with dot operator (.)
  
    const handleDateChange = (date: DateValue) => {
      onChange(date)
    }
  
    return (
      <DatePicker onChange={handleDateChange} className="group flex flex-col gap-1 w-[200px]">
        <Label className="text-white cursor-default">
          Date
        </Label>
        <Group className="flex rounded-lg bg-white/90 focus-within:bg-white group-open:bg-white transition pl-3 shadow-md text-gray-700 focus-visible:ring-2 ring-black">
          <DateInput className="flex flex-1 py-2">
            {(segment) => (
              <DateSegment
                segment={segment}
                className="px-0.5 tabular-nums outline-none rounded-sm focus:bg-violet-700 focus:text-white caret-transparent placeholder-shown:italic"
              />
            )}
          </DateInput>
          <Button className="ml-2 mr-2 w-5 h-9 outline-none cursor-default bg-transparent text-gray-600 border-0 rounded-full flex items-center justify-center hover:bg-gray-100 pressed:bg-gray-200 focus-visible:ring ring-violet-600/70 ring-offset-2">
            <ChevronUpDownIcon size="XS" />
          </Button>
        </Group>
        <MyPopover>
          <Dialog className="p-6 text-gray-600">
            <Calendar>
              <header className="flex items-center gap-1 pb-4 px-1 w-full">
                <Heading className="flex-1 font-semibold text-2xl ml-2" />
                <RoundButton slot="previous">
                  <ChevronLeftIcon />
                </RoundButton>
                <RoundButton slot="next">
                  <ChevronRightIcon />
                </RoundButton>
              </header>
              <CalendarGrid className="border-spacing-1 border-separate">
                <CalendarGridHeader>
                  {(day) => (
                    <CalendarHeaderCell className="text-xs text-gray-500 font-semibold">
                      {day}
                    </CalendarHeaderCell>
                  )}
                </CalendarGridHeader>
                <CalendarGridBody>
                  {(date) => (
                    <CalendarCell
                      date={date}
                      className="w-9 h-9 outline-none cursor-default rounded-full flex items-center justify-center outside-month:text-gray-300 hover:bg-gray-100 pressed:bg-gray-200 selected:bg-violet-700 selected:text-white focus-visible:ring ring-violet-600/70 ring-offset-2"
                    />
                  )}
                </CalendarGridBody>
              </CalendarGrid>
            </Calendar>
          </Dialog>
        </MyPopover>
      </DatePicker>
    )
  }
  
  function RoundButton(props: ButtonProps) {
    return (
      <Button
        {...props}
        className="w-9 h-9 outline-none cursor-default bg-transparent text-gray-600 border-0 rounded-full flex items-center justify-center hover:bg-gray-100 pressed:bg-gray-200 focus-visible:ring-2 ring-violet-600/70 ring-offset-2"
      />
    );
  }
  
  function MyPopover(props: PopoverProps) {
    return (
      <Popover
        {...props}
        className={({ isEntering, isExiting }) => `
          overflow-auto rounded-lg drop-shadow-lg ring-1 ring-black/10 bg-white
          ${
          isEntering
            ? 'animate-in fade-in placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1 ease-out duration-200'
            : ''
        }
          ${
          isExiting
            ? 'animate-out fade-out placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1 ease-in duration-150'
            : ''
        }
        `}
      />
    );
  }

  export function getDatesBetween(start: DateValue, end: DateValue): DateValue[] {
  
    // Ensure start date is before end date
    if (start > end) {
      throw new Error("Start date must be before end date");
    }
  
    const dates: DateValue[] = [];
    let currentDate = start.copy();
  
    while (currentDate <= end) {
      dates.push(currentDate.copy());
      // Move to the next day
      currentDate.set(currentDate.add({ days: 1 }));
    }
  
    return dates;
  }
  