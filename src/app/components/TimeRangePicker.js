import { useRef } from "react";
import { Box as ChakraBox } from "@chakra-ui/react";
import { useDateRangePickerState } from "react-stately";
import { useDateRangePicker } from "react-aria";
import { TimeField } from "./calendar_components/DateField";

export function TimeRangePicker(props) {
    // Initialize state with time granularity
    const state = useDateRangePickerState({
        ...props,
        granularity: "minute",
    });

    const ref = useRef(null);
    const { groupProps, startFieldProps, endFieldProps } = useDateRangePicker(
        props,
        state,
        ref
    );

    return (
        <ChakraBox {...groupProps} ref={ref} display="flex" gap="2">
            <TimeField
                {...startFieldProps}
                label="Start time"
                value={state.start}
                onChange={(v) => state.setTime("start", v)}
            />
            <TimeField
                {...endFieldProps}
                label="End time"
                value={state.end}
                onChange={(v) => state.setTime("end", v)}
            />
        </ChakraBox>
    );
}
