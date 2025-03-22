import { Signal } from "@preact/signals";
declare enum WeekDay {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}
/**
 * This interface serves as a bridge between the config interface for the date picker amd the calendar.
 * */
interface Config {
    locale: Signal<string>;
    firstDayOfWeek: Signal<WeekDay>;
}
declare enum Placement {
    TOP_START = "top-start",
    TOP_END = "top-end",
    BOTTOM_START = "bottom-start",
    BOTTOM_END = "bottom-end"
}
type WeekWithDates = Date[];
type MonthWithDates = Date[][];
declare enum Month {
    JANUARY = 0,
    FEBRUARY = 1,
    MARCH = 2,
    APRIL = 3,
    MAY = 4,
    JUNE = 5,
    JULY = 6,
    AUGUST = 7,
    SEPTEMBER = 8,
    OCTOBER = 9,
    NOVEMBER = 10,
    DECEMBER = 11
}
interface TimeUnits {
    firstDayOfWeek: WeekDay;
    getMonthWithTrailingAndLeadingDays(year: number, month: Month): MonthWithDates;
    getWeekFor(date: Date): WeekWithDates;
    getMonthsFor(year: number): Date[];
}
declare enum DatePickerView {
    MONTH_DAYS = "month-days",
    YEARS = "years"
}
interface DatePickerState {
    isOpen: Signal<boolean>;
    isDisabled: Signal<boolean>;
    selectedDate: Signal<string>;
    inputDisplayedValue: Signal<string>;
    datePickerDate: Signal<string>;
    datePickerView: Signal<DatePickerView>;
    inputWrapperElement: Signal<HTMLDivElement | undefined>;
    isDark: Signal<boolean>;
    open(): void;
    close(): void;
    toggle(): void;
    setView(view: DatePickerView): void;
}
type TranslationVariables = {
    [key: string]: string | number;
};
type TranslateFn = (key: string, variables?: TranslationVariables) => string;
/**
 * This interface serves as a bridge between the AppSingleton for the date picker and calendar
 * */
interface AppSingleton {
    timeUnitsImpl: TimeUnits;
    datePickerState: DatePickerState;
    translate: TranslateFn;
}
interface DatePickerAppSingleton extends AppSingleton {
    config: DatePickerConfigInternal;
}
type DatePickerListeners = {
    onChange?: (date: string) => void;
    onEscapeKeyDown?: ($app: DatePickerAppSingleton) => void;
};
type DatePickerStyle = {
    dark?: boolean;
    fullWidth?: boolean;
};
interface DatePickerConfigInternal extends Config {
    min: string;
    max: string;
    placement: Placement;
    listeners: DatePickerListeners;
    style: DatePickerStyle;
    teleportTo?: HTMLElement;
    label?: string;
    name?: string;
    disabled?: boolean;
}
interface DatePickerConfigExternal extends Partial<Omit<DatePickerConfigInternal, "placement" | "firstDayOfWeek" | "locale">> {
    selectedDate?: string;
    placement?: Placement | string;
    firstDayOfWeek?: WeekDay;
    locale?: string;
}
declare class DatePickerApp {
    private $app;
    constructor($app: DatePickerAppSingleton);
    render(el: HTMLElement): void;
    get value(): string;
    set value(value: string);
    get disabled(): boolean;
    set disabled(value: boolean);
    setTheme(theme: "light" | "dark"): void;
    getTheme(): "light" | "dark";
}
declare const createDatePicker: (config?: DatePickerConfigExternal) => DatePickerApp;
declare const createDatePickerInternal: ($app: DatePickerAppSingleton) => DatePickerApp;
type DatePickerConfig = DatePickerConfigExternal;
interface IDatePickerConfig extends DatePickerConfig {
}
export { createDatePicker, createDatePickerInternal, DatePickerConfig, IDatePickerConfig };
