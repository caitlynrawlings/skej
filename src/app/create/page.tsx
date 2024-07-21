"use client"

import * as React from 'react'
import { useState, ChangeEvent } from 'react'
import { 
  ChakraProvider, 
  Flex, 
  Input,
  HStack,
  Box,
  Stack,
  Card,
  Checkbox,
  Text,
  Select,
  Button as ChakraButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import {Button, Calendar, CalendarCell, CalendarGrid, CalendarGridBody, CalendarGridHeader, CalendarHeaderCell, DateInput, DatePicker, DateSegment, Dialog, Group, Heading, Label, Popover} from 'react-aria-components';
import type {ButtonProps, DateValue, PopoverProps} from 'react-aria-components';
import ChevronUpDownIcon from '@spectrum-icons/workflow/ChevronUpDown';
import ChevronLeftIcon from '@spectrum-icons/workflow/ChevronLeft';
import ChevronRightIcon from '@spectrum-icons/workflow/ChevronRight';


export default function CreatePage() {
  const [eventType, setEventType] = useState<string>('specific')

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEventType(e.target.value)
  }

  return (
    <ChakraProvider>
      <Flex flexDirection={'column'} p={4}>
        <HStack spacing={4}>
          <Text>Event Name: </Text>
          <Input placeholder='New Event Name' size='md' />
        </HStack>
        <HStack spacing={4} mt={4}>
          <Text>Select the type of event are you trying to schedule: </Text>
          <Select value={eventType} onChange={handleSelectChange}>
            <option value='specific'>Specific Dates</option>
            <option value='general'>Days of Week</option>
          </Select>
        </HStack>
        <HStack spacing={4} mt={4}>
          <Text>Select the required minimum time block selection (minutes): </Text>
          <NumberInput min={1} step={1} defaultValue={15}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
        {eventType === 'general' && <General />}
        {eventType === 'specific' && <Specific />}
      </Flex>
    </ChakraProvider>
  )
}

function General() {
  const [checkedDays, setCheckedDays] = useState<string[]>([])

  const handleCheckboxChange = (day: string) => {
    setCheckedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <Box mt={4}>
      <Stack spacing={5} direction='row'>
        {daysOfWeek.map(day => (
          <Checkbox key={day} isChecked={checkedDays.includes(day)} onChange={() => handleCheckboxChange(day)}>
            {day}
          </Checkbox>
        ))}
      </Stack>
      {checkedDays.map(day => (
        <Day key={day} day={day} />
      ))}
    </Box>
  )
}

function Specific() {
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  const handleSelectedDaysChange = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  return (
    <Box mt={4}>
      <ChakraButton>Add date or date range</ChakraButton>

      <CalendarDatePicker/>

      {selectedDays.map((day) => (
        <Day key={day} day={day} />
      ))}
    </Box>
  )
}

function CalendarDatePicker() {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null)

  const handleDateChange = (date: DateValue) => {
    setSelectedDate(date)
    console.log(`Selected date: ${date}`)
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

interface DateRange {
  startDay: number
  startMonth: number
  startYear: number
  endDay: number
  endMonth: number
  endYear: number
}

interface TimeRange {
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
  startPeriod: 'am' | 'pm'
  endPeriod: 'am' | 'pm'
}

function Day({ day }: { day: string }) {
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([])

  const addTimeRange = () => {
    setTimeRanges(prev => [...prev, { startHour: 12, startMinute: 0, endHour: 12, endMinute: 0, startPeriod: 'am', endPeriod: 'am' }])
  }

  const removeTimeRange = (index: number) => {
    setTimeRanges(prev => prev.filter((_, i) => i !== index))
  }

  const handleTimeChange = (index: number, field: 'startHour' | 'startMinute' | 'endHour' | 'endMinute' | 'startPeriod' | 'endPeriod', value: number | 'am' | 'pm') => {
    setTimeRanges(prev => {
      const updatedRanges = [...prev]
      // Correctly map field names to those used in the TimeRange interface
      updatedRanges[index] = { ...updatedRanges[index], [field]: value }
      return updatedRanges
    })
  }

  return (
    <Card p={4} mb={4}>
      <Text mb={2}>Select times that work for {day}</Text>
      {timeRanges.map((range, index) => (
        <Box key={index} mb={2}>
          <TimeRange
            range={range}
            onTimeChange={(field, value) => handleTimeChange(index, field, value)}
            onRemove={() => removeTimeRange(index)}
          />
        </Box>
      ))}
      <ChakraButton colorScheme='blue' onClick={addTimeRange}>Add time range</ChakraButton>
    </Card>
  )
}


interface TimeRangeProps {
  range: TimeRange
  onTimeChange: (field: 'startHour' | 'startMinute' | 'endHour' | 'endMinute' | 'startPeriod' | 'endPeriod', value: number | 'am' | 'pm') => void
  onRemove: () => void
}

function TimeRange({
  range,
  onTimeChange,
  onRemove
}: TimeRangeProps) {
  return (
    <Box>
      <HStack spacing={2} mb={2}>
        <Text>Start of range: </Text>
        <TimeSelect
          hour={range.startHour}
          minute={range.startMinute}
          period={range.startPeriod}
          onChange={(field, value) => onTimeChange(`start${field}`, value)}
        />
        <Text>End of range: </Text>
        <TimeSelect
          hour={range.endHour}
          minute={range.endMinute}
          period={range.endPeriod}
          onChange={(field, value) => onTimeChange(`end${field}`, value)}
        />
        <ChakraButton colorScheme='red' onClick={onRemove}>Remove</ChakraButton>
      </HStack>
    </Box>
  )
}


interface TimeSelectProps {
  hour: number
  minute: number
  period: 'am' | 'pm'
  onChange: (field: 'Hour' | 'Minute' | 'Period', value: number | 'am' | 'pm') => void
}

function TimeSelect({ hour, minute, period, onChange }: TimeSelectProps) {
  return (
    <HStack spacing={1}>
      <NumberInput
        value={hour}
        min={1} max={12}
        onChange={(value) => onChange('Hour', parseInt(value))}
      >
        <NumberInputField />
      </NumberInput>
      <Text>:</Text>
      <NumberInput
        value={minute}
        min={0} max={59}
        onChange={(value) => onChange('Minute', parseInt(value))}
      >
        <NumberInputField />
      </NumberInput>
      <Select
        value={period}
        onChange={(e) => onChange('Period', e.target.value as 'am' | 'pm')}
      >
        <option value='am'>AM</option>
        <option value='pm'>PM</option>
      </Select>
    </HStack>
  )
}
