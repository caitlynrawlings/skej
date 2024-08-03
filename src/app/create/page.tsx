"use client"

import * as React from 'react'
import {Time} from '@internationalized/date';
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
import { TimeValue } from 'react-aria-components'
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
  const [num, setNum] = useState<number>(1)

  const handleAddDateOrDateRange = () => {
    setNum(prev => prev + 1);
  }

  return (
    <Box mt={4}>
      <Button onClick={handleAddDateOrDateRange}>Add date or date range</Button>

      {Array.from({ length: num }).map((_, index) => (
        <CalendarRange key={index} />
      ))}
    </Box>
  )
}

function CalendarRange() {
  return (
    <Card>
      <CalendarRangePicker/>
      <Day day='placeholder day name'></Day>
    </Card>
  )
}

function Day({ day }: { day: string }) {
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([{start: new Time(0, 0), end: new Time(0, 0)}])

  const addTimeRange = () => {
    setTimeRanges(prev => [...prev, {start: new Time(0, 0), end: new Time(0, 0)}])
  }

  const removeTimeRange = (index: number) => {
    setTimeRanges(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Card p={4} mb={4}>
      <Text mb={2}>Select times that work for {day}</Text>
      {timeRanges.map((range, index) => (
        <HStack spacing={2} mb={2}>
          <TimeRangePicker></TimeRangePicker>
          <Button colorScheme='red' onClick={() => removeTimeRange(index)}>Remove</Button>
        </HStack>
      ))}
      <Button colorScheme='blue' onClick={addTimeRange}>Add time range</Button>
    </Card>
  )
}

interface TimeRange {
  start: TimeValue;
  end: TimeValue;
}