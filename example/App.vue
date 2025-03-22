<template>
    <ScheduleXCalendar :calendar-app="calendarApp" />
</template>

<script setup lang="ts">
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
    createCalendar,
    createViewDay,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
    type CalendarEvent
} from '@schedule-x/calendar'
import { createEventsServicePlugin, type EventsServicePlugin } from '@schedule-x/events-service'
import { createCalendarControlsPlugin, type CalendarControlsPlugin } from '@schedule-x/calendar-controls'
import { ScheduleXPlugin, CopyEventPlugin, ZoomInPlugin } from '../src'

import '@schedule-x/theme-default/dist/index.css'

const eventsServicePlugin: EventsServicePlugin = createEventsServicePlugin()
const calendarControls: CalendarControlsPlugin = createCalendarControlsPlugin()

const calendarApp = createCalendar({
    selectedDate: '2023-12-19',

    weekOptions: {
        gridHeight: window.innerHeight - 370,
        timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' }
    },

    views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda()
    ],

    plugins: [
        eventsServicePlugin,
        calendarControls,
        new ScheduleXPlugin({
            plugins: [
                new CopyEventPlugin(eventsServicePlugin, (event: CalendarEvent) => {
                    console.log(event)
                    eventsServicePlugin.add(event)
                }),
                new ZoomInPlugin(calendarControls)
            ]
        })
    ],

    events: [
        { id: 1, title: 'Event 1', start: '2023-12-19 08:00', end: '2023-12-19 12:00' },
        { id: 2, title: 'Event 2', start: '2023-12-20 12:00', end: '2023-12-20 13:00' }
    ]
})
</script>