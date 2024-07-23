"use client"

import * as React from 'react'
import { useState, ChangeEvent } from 'react'
import {
  Flex, 
  Input,
  HStack,
  Box,
  Stack,
  Card,
  Checkbox,
  Text,
  Select,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import CalendarDatePicker, { getDatesBetween } from '../components/CalendarDatePicker'
import CalendarDateRangePicker from '../components/CalendarDateRangePicker'
import { DateValue } from 'react-aria-components'

export default function CreatePage() {
  const [eventType, setEventType] = useState<string>('specific')

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEventType(e.target.value)
  }

  return (
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
      <Button>Add date or date range</Button>

      <DateRangePicker/>

      {selectedDays.map((day) => (
        <Day key={day} day={day} />
      ))}
    </Box>
  )
}

function DateRangePicker() {
  const [isRange, setIsRange] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<DateRange | null>(null)

  const handleIsRangeChange = () => {
    setIsRange(!isRange)
  }

  const handleDateRangeChange = (sideOfRange: 'start' | 'end', date: DateValue) => {
    setDateRange(prev => {
      if (!prev) {
        // Initialize dateRange if it was null
        return {
          start: date,
          end: date
        }
      }
      return {
        ...prev,
        [sideOfRange]: date
      }
    })
  }

  // Function to get all dates between start and end
  const getDates = dateRange ? getDatesBetween(dateRange.start, dateRange.end) : [];

  return (
    <Card>
      <HStack>
        <Text>Pick a date or date range: </Text>
        <CalendarDateRangePicker/>
      </HStack>
    </Card>
  )
}



interface DateRange {
  start: DateValue
  end: DateValue
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
      <Button colorScheme='blue' onClick={addTimeRange}>Add time range</Button>
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
        <Button colorScheme='red' onClick={onRemove}>Remove</Button>
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
