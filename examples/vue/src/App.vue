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
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { CopyEventPlugin, ZoomInPlugin } from '../../../src';
 
import '@schedule-x/theme-default/dist/index.css'

const eventsServicePlugin = createEventsServicePlugin();
const calendarControls = createCalendarControlsPlugin()

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
        createViewMonthAgenda(),
    ],

    plugins: [
        createDragAndDropPlugin(30),
        eventsServicePlugin,
        calendarControls,
        new CopyEventPlugin(eventsServicePlugin, event => {
            console.log(event);
            eventsServicePlugin.add(event);
        }),
        new ZoomInPlugin(calendarControls, {
            onZoom: (event) => {
                console.log(event);
            }
        })
    ],

    events: [
        {
            id: 1,
            title: 'Event 1',
            start: '2023-12-19',
            end: '2023-12-19',
        },
        {
            id: 2,
            title: 'Event 2',
            start: '2023-12-20 12:00',
            end: '2023-12-20 13:00',
        },
    ],
    
})
</script>


<style>
  body {
    font-family: 'Montserrat'
  }
</style>