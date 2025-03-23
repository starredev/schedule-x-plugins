/**
 * Represents the structure of an event's data.
 */
interface EventData {
    id: string | number;
    start: string;
    end: string;
    [key: string]: any;
}
/**
 * Service to retrieve event data by ID.
 */
interface EventsService {
    get(id: number): EventData | undefined;
}
/**
 * A plugin for copying and dragging calendar events within ScheduleX.
 */
export declare class CopyEventPlugin {
    readonly name = "copy-event-plugin";
    private config;
    private draggedElement;
    private hoveredElement;
    /**
     * Initializes the plugin with event service and callback.
     */
    constructor(eventsService: EventsService, callback: (event: EventData) => void);
    /**
     * Attaches plugin logic to the calendar DOM.
     */
    onRender($app: any): void;
    /**
     * Handles right-clicks on events to start the copy-drag.
     */
    private handleContextMenu;
    /**
     * Clones the event element and prepares it for dragging.
     */
    private startDrag;
    /**
     * Handles dragging motion and hover feedback.
     */
    private handleDrag;
    /**
     * Handles drop logic, updates the event time, and invokes the callback.
     */
    private handleDrop;
    /**
     * Aborts the drag and removes the cloned element.
     */
    private abortDrag;
    /**
     * Clones an event element visually for dragging.
     */
    private cloneElement;
    /**
     * Moves the dragged element to a new screen position.
     */
    private moveElement;
    /**
     * Checks if coordinates are within an element’s bounding box.
     */
    private isWithinBounds;
    /**
     * Highlights the currently hovered grid day during drag.
     */
    private highlightHoveredElement;
    /**
     * Removes the background highlight from the hovered element.
     */
    private removeHoverEffect;
    /**
     * Finalizes drop, removes the clone, and prevents accidental clicks.
     */
    private cleanupAfterDrop;
    /**
     * Temporarily suppresses the next click to prevent unwanted interactions.
     */
    private suppressNextClick;
    /**
     * Converts a screen position to a datetime string.
     */
    private getDateTimeFromPosition;
    /**
     * Updates event's start and end time based on a new start.
     */
    private getUpdatedEventTime;
    /**
     * Formats a Date object into a "YYYY-MM-DD HH:mm" string.
     */
    private formatDateTime;
    /**
     * Converts human-readable time (e.g. "2:00 PM") to ISO-like time string.
     */
    private convertToISO;
}
export {};
