import {Button, CalendarCell, CalendarGrid, DateInput, DateRangePicker, DateSegment, Dialog, Group, Heading, Label, Popover, RangeCalendar} from 'react-aria-components';

export default function CalendarDateRangePicker() {
    return (
        <DateRangePicker className="group flex flex-col gap-1 w-[200px]">
            <Label className="text-white cursor-default">Trip dates</Label>
            <Group className="flex rounded-lg bg-white/90 focus-within:bg-white group-open:bg-white transition pl-3 shadow-md text-gray-700 focus-visible:ring-2 ring-black">
                <DateInput className="flex flex-1 py-2" slot="start">
                {(segment) => <DateSegment segment={segment} className="px-0.5 tabular-nums outline-none rounded-sm focus:bg-violet-700 focus:text-white caret-transparent placeholder-shown:italic" />}
                </DateInput>
                <span aria-hidden="true">–</span>
                <DateInput  className="flex flex-1 py-2" slot="end">
                {(segment) => <DateSegment segment={segment} className="px-0.5 tabular-nums outline-none rounded-sm focus:bg-violet-700 focus:text-white caret-transparent placeholder-shown:italic"/>}
                </DateInput>
                <Button>▼</Button>
            </Group>
            <Popover>
                <Dialog className="p-6 text-gray-600">
                <RangeCalendar>
                    <header className="flex items-center gap-1 pb-4 px-1 w-full">
                    <Button slot="previous">◀</Button>
                    <Heading />
                    <Button slot="next">▶</Button>
                    </header>
                    <CalendarGrid className="border-spacing-1 border-separate">
                    {(date) => <CalendarCell date={date} />}
                    </CalendarGrid>
                </RangeCalendar>
                </Dialog>
            </Popover>
            </DateRangePicker>
    )
}