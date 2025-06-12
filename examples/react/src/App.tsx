import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createScrollControllerPlugin } from '@schedule-x/scroll-controller'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { CopyEventPlugin } from '../../../src'

import '@schedule-x/theme-default/dist/index.css'

const eventsServicePlugin = createEventsServicePlugin();

function App() {

  const calendarApp = useCalendarApp({
    selectedDate: '2025-06-07',
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

    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2025-06-07 09:00',
        end: '2025-06-07 10:00'
      }
    ],

    callbacks: {
      onEventUpdate(updatedEvent) {
        console.log('onEventUpdate', updatedEvent)
      }
    },
    
    plugins: [
      createDragAndDropPlugin(30),
      createScrollControllerPlugin(),
      eventsServicePlugin,
      new CopyEventPlugin(eventsServicePlugin, event => {
        console.log('CopyEventPlugin', event);
        eventsServicePlugin.add(event);
    })
    ]
  });

  return (
    <div className="calendar">
      <ScheduleXCalendar
        calendarApp={calendarApp}
      />
    </div>
  )
}

export default App