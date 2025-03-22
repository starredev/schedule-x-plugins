![Schedule-X](https://schedule-x.s3.eu-west-1.amazonaws.com/schedule-x-logo.png)

# @starredev/schedule-x-plugins

[ScheduleX](https://github.com/schedule-x) is a powerful calendar application, similar as outlook/google calendar, allowing users to manage events and schedules with ease. While Schedule-X offers a solid foundation, it intentionally leaves out certain advanced features to remain lightweight and flexible.

## 🚀 Why These Plugins?

Thanks to its robust plugin system, I've been able to build a few custom plugins that extend Schedule-X's functionality in meaningful ways. These plugins enhance the user experience, unlock new capabilities, and tailor the calendar to fit more specific needs—features that aren't included out of the box.

- 🖱 **Drag-to-Copy**: Users often need to duplicate existing events rather than create new ones from scratch.
- 🔍 **Zoom Control**: In dense schedules, users want to zoom in for focus or zoom out for a broader overview.

---

## 📦 Installation

Install the package via npm or yarn:

```bash
npm install @starredev/schedule-x-plugins
```

## ⚠️ Don’t Forget to Instantiate Required Plugins
Some plugins depend on shared services such as eventsServicePlugin and calendarControls. Make sure to instantiate them and pass them in before initializing your calendar. Here’s an example:

```js
const calendarApp = createCalendar({
    // Your calendar config...

    plugins: [
        eventsServicePlugin,
        calendarControls,
        new ScheduleXPlugin({
            plugins: [
                new CopyEventPlugin(eventsServicePlugin, event => {
                    /* 
                        {
                            "id": 2,
                            "start": "2023-12-23 06:00",
                            "end": "2023-12-23 07:00",
                            "title": "Event 2"
                        }
                    */
                    console.log(event);
                    eventsServicePlugin.add(event);
                }),
                new ZoomInPlugin(calendarControls)
            ]
        })
    ]
})
```

