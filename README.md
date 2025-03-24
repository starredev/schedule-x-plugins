![Schedule-X](https://schedule-x.s3.eu-west-1.amazonaws.com/schedule-x-logo.png)

# @starredev/schedule-x-plugins

[ScheduleX](https://github.com/schedule-x) is a powerful calendar application, similar as outlook/google calendar, allowing users to manage events and schedules with ease. While Schedule-X offers a solid foundation, it intentionally leaves out certain advanced features to remain lightweight and flexible.

## 🚀 Why These Plugins?

Thanks to its robust plugin system, I've been able to build a few custom plugins that extend Schedule-X's functionality in meaningful ways. These plugins enhance the user experience, unlock new capabilities, and tailor the calendar to fit more specific needs—features that aren't included out of the box.

- 🖱 **Drag-to-Copy**: Users often need to duplicate existing events rather than create new ones from scratch.
- 🔍 **Zoom Control**: In dense schedules, users want to zoom in for focus or zoom out for a broader overview.

Example at: https://starredev.github.io/schedule-x-plugins/

---

## 📦 Installation

Install the package via npm or yarn:

```bash
npm install @starredev/schedule-x-plugins
```

## ⚠️ Don’t Forget to Instantiate Required Plugins
Some plugins depend on shared services such as eventsServicePlugin and calendarControls. Make sure to instantiate them and pass them in before initializing your calendar. You can get them below

- [Events Service Plugin](https://schedule-x.dev/docs/calendar/plugins/events-service)
- [Calendar controls](https://schedule-x.dev/docs/calendar/plugins/calendar-controls)

### `Boilerplates`
[VueJS Example](https://schedule-x.dev/docs/calendar/plugins/events-service)

### `CopyEventPlugin`

🧠 **Purpose**: Enables users to right-click and drag to **duplicate** existing events in the calendar.

#### ✅ Features

- Right-click on an event to begin copy-drag
- Drag the cloned event to a new time slot
- Automatically calculates updated start and end times
- Executes a callback with the new event
- Visual feedback on hover/drop target
- Supports switch between days

---

#### 🧩 Usage
```ts
import { createCalendar } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { CopyEventPlugin } from '@starredev/schedule-x-plugins'

const eventsServicePlugin = createEventsServicePlugin()

const calendarApp = createCalendar({
  // calendar config...

  plugins: [
    eventsServicePlugin,
    new CopyEventPlugin(eventsServicePlugin, event => {
        console.log(event);
        eventsServicePlugin.add(event);
    })
  ]
})
```

### `ZoomInPlugin`

🔎 **Purpose**: Adds mouse wheel zooming (with `Ctrl`) to the calendar time grid.

#### ✅ Features

- `Ctrl + Mouse Wheel` zooms in and out
- Configurable zoom factor, step, and height
- Defaults provided — no setup needed!

#### 🧩 Usage

```ts
import { createCalendar } from '@schedule-x/calendar'
import { ZoomInPlugin } from '@starredev/schedule-x-plugins'
import { createCalendarControlsPlugin} from '@schedule-x/calendar-controls'

const calendarControls = createCalendarControlsPlugin()

const calendarApp = createCalendar({
  // calendar config...

  plugins: [
    eventsServicePlugin,
    calendarControls,
    new ZoomInPlugin(calendarControls)
  ],
})

// Optional: Custom zoom settings
new ZoomInPlugin(calendarControls, {
  zoomFactor: 1,         // Initial zoom (default: 1)
  minZoom: 0.5,          // Minimum zoom (default: 0.5)
  maxZoom: 2,            // Maximum zoom (default: 2)
  zoomStep: 0.2,         // Step per scroll (default: 0.2)
  baseGridHeight: 900    // Base height in px (default: 900)
});
```