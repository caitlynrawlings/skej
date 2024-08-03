import { useRef } from "react";
import { useDateRangePickerState } from "react-stately";
import { useDateRangePicker } from "react-aria";
import { FieldButton } from "./calendar_components/Button";
import { RangeCalendar } from "./calendar_components/RangeCalendar";
import { DateField, StyledField, TimeField } from "./calendar_components/DateField";
import { Popover } from "./calendar_components/Popover";
import { Dialog } from "./calendar_components/Dialog";
import { CalendarIcon, NotAllowedIcon } from "@chakra-ui/icons";
import {
  FormLabel,
  InputGroup,
  Box,
  InputRightElement
} from "@chakra-ui/react";

export default function CalendarRangePicker(props) {
  let state = useDateRangePickerState({
    ...props,
    shouldCloseOnSelect: false
  });
  let ref = useRef();
  let {
    groupProps,
    labelProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps
  } = useDateRangePicker(props, state, ref);

  return (
    <Box position="relative" display="inline-flex" flexDirection="column">
      <FormLabel {...labelProps}>{props.label}</FormLabel>
      <InputGroup {...groupProps} ref={ref} width="auto" display="inline-flex">
        <StyledField pr="5.5rem">
          <DateField {...startFieldProps} />
          <Box as="span" aria-hidden="true" paddingX="2">
            –
          </Box>
          <DateField {...endFieldProps} />
          {state.isInvalid && (
            <NotAllowedIcon color="red.600" position="absolute" right="12" />
          )}
        </StyledField>
        <InputRightElement>
          <FieldButton {...buttonProps} isPressed={state.isOpen}>
            <CalendarIcon />
          </FieldButton>
        </InputRightElement>
      </InputGroup>
      {state.isOpen && (
        <Popover triggerRef={ref} state={state} placement="bottom start">
          <Dialog {...dialogProps}>
            <RangeCalendar {...calendarProps} />
          </Dialog>
        </Popover>
      )}
    </Box>
  );
}