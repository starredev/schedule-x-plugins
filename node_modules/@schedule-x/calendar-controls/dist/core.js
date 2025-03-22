var PluginName;
(function (PluginName) {
    PluginName["DragAndDrop"] = "dragAndDrop";
    PluginName["EventModal"] = "eventModal";
    PluginName["ScrollController"] = "scrollController";
    PluginName["EventRecurrence"] = "eventRecurrence";
    PluginName["Resize"] = "resize";
    PluginName["CalendarControls"] = "calendarControls";
    PluginName["CurrentTime"] = "currentTime";
})(PluginName || (PluginName = {}));

// regex for strings between 00:00 and 23:59
const timeStringRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
const dateStringRegex = /^(\d{4})-(\d{2})-(\d{2})$/;

class InvalidTimeStringError extends Error {
    constructor(timeString) {
        super(`Invalid time string: ${timeString}`);
    }
}

class NumberRangeError extends Error {
    constructor(min, max) {
        super(`Number must be between ${min} and ${max}.`);
        Object.defineProperty(this, "min", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: min
        });
        Object.defineProperty(this, "max", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: max
        });
    }
}

const doubleDigit = (number) => {
    if (number < 0 || number > 99)
        throw new NumberRangeError(0, 99);
    return String(number).padStart(2, '0');
};

const minuteTimePointMultiplier = 1.6666666666666667; // 100 / 60
const timePointsFromString = (timeString) => {
    if (!timeStringRegex.test(timeString) && timeString !== '24:00')
        throw new InvalidTimeStringError(timeString);
    const [hoursInt, minutesInt] = timeString
        .split(':')
        .map((time) => parseInt(time, 10));
    let minutePoints = (minutesInt * minuteTimePointMultiplier).toString();
    if (minutePoints.split('.')[0].length < 2)
        minutePoints = `0${minutePoints}`;
    return Number(hoursInt + minutePoints);
};
const timeStringFromTimePoints = (timePoints) => {
    const hours = Math.floor(timePoints / 100);
    const minutes = Math.round((timePoints % 100) / minuteTimePointMultiplier);
    return `${doubleDigit(hours)}:${doubleDigit(minutes)}`;
};

const definePlugin = (name, definition) => {
    definition.name = name;
    return definition;
};

class CalendarControlsPluginImpl {
    constructor() {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: PluginName.CalendarControls
        });
        Object.defineProperty(this, "$app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "getDate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => this.$app.datePickerState.selectedDate.value
        });
        Object.defineProperty(this, "getView", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => this.$app.calendarState.view.value
        });
        Object.defineProperty(this, "getFirstDayOfWeek", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => this.$app.config.firstDayOfWeek.value
        });
        Object.defineProperty(this, "getLocale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => this.$app.config.locale.value
        });
        Object.defineProperty(this, "getViews", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => this.$app.config.views.value
        });
        Object.defineProperty(this, "getDayBoundaries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => ({
                start: timeStringFromTimePoints(this.$app.config.dayBoundaries.value.start),
                end: timeStringFromTimePoints(this.$app.config.dayBoundaries.value.end),
            })
        });
        Object.defineProperty(this, "getWeekOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => this.$app.config.weekOptions.value
        });
        Object.defineProperty(this, "getCalendars", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => this.$app.config.calendars.value
        });
        Object.defineProperty(this, "getMinDate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => this.$app.config.minDate.value
        });
        Object.defineProperty(this, "getMaxDate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => this.$app.config.maxDate.value
        });
        Object.defineProperty(this, "getMonthGridOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => this.$app.config.monthGridOptions.value
        });
        Object.defineProperty(this, "getRange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => this.$app.calendarState.range.value
        });
    }
    beforeRender($app) {
        this.$app = $app;
    }
    onRender($app) {
        this.$app = $app;
    }
    setDate(date) {
        if (!dateStringRegex.test(date))
            throw new Error('Invalid date. Expected format YYYY-MM-DD');
        this.$app.datePickerState.selectedDate.value = date;
    }
    setView(view) {
        const viewToSet = this.$app.config.views.value.find((v) => v.name === view);
        if (!viewToSet)
            throw new Error(`Invalid view name. Expected one of ${this.$app.config.views.value.map((v) => v.name).join(', ')}`);
        this.$app.calendarState.setView(view, this.$app.datePickerState.selectedDate.value);
    }
    setFirstDayOfWeek(firstDayOfWeek) {
        this.$app.config.firstDayOfWeek.value = firstDayOfWeek;
    }
    setLocale(locale) {
        this.$app.config.locale.value = locale;
    }
    setViews(views) {
        const currentViewName = this.$app.calendarState.view.value;
        const isCurrentViewInViews = views.some((view) => view.name === currentViewName);
        if (!isCurrentViewInViews)
            throw new Error(`Currently active view is not in given views. Expected to find ${currentViewName} in ${views.map((view) => view.name).join(',')}`);
        this.$app.config.views.value = views;
    }
    setDayBoundaries(dayBoundaries) {
        this.$app.config.dayBoundaries.value = {
            start: timePointsFromString(dayBoundaries.start),
            end: timePointsFromString(dayBoundaries.end),
        };
    }
    setWeekOptions(weekOptions) {
        this.$app.config.weekOptions.value = {
            ...this.$app.config.weekOptions.value,
            ...weekOptions,
        };
    }
    setCalendars(calendars) {
        this.$app.config.calendars.value = calendars;
    }
    setMinDate(minDate) {
        this.$app.config.minDate.value = minDate;
    }
    setMaxDate(maxDate) {
        this.$app.config.maxDate.value = maxDate;
    }
    setMonthGridOptions(monthGridOptions) {
        this.$app.config.monthGridOptions.value = monthGridOptions;
    }
}
const createCalendarControlsPlugin = () => {
    return definePlugin('calendarControls', new CalendarControlsPluginImpl());
};

export { createCalendarControlsPlugin };
