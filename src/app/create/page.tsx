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
import CalendarRangePicker from '../components/CalendarRangePicker.jsx'
import { DateValue } from 'react-aria-components'
import { TimeRangePicker } from '../components/TimeRangePicker.js'

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
  const [num, setNum] = useState<number>(1)

  const handleSelectedDaysChange = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleAddDateOrDateRange = () => {
    setNum(prev => prev + 1);
  }

  return (
    <Box mt={4}>
      <Button onClick={handleAddDateOrDateRange}>Add date or date range</Button>

      {Array.from({ length: num }).map((_, index) => (
        <DateRange key={index} />
      ))}

      {selectedDays.map((day) => (
        <Day key={day} day={day} />
      ))}
    </Box>
  )
}

function DateRange() {
  return (
    <Card>
      <CalendarRangePicker/>
      <Day day='placeholder day name'></Day>
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
  onRemove
}: TimeRangeProps) {
  return (
    <Box>
      <HStack spacing={2} mb={2}>
        {/* <Text>Start of range: </Text>
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
        /> */}
        <TimeRangePicker></TimeRangePicker>
        <Button colorScheme='red' onClick={onRemove}>Remove</Button>
      </HStack>
    </Box>
  )
}
