import { v4 as uuidv4 } from 'uuid';

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
  get(id: number | string): EventData | undefined;
}

/**
 * Configuration options for the CopyEventPlugin.
 */
interface PluginConfig {
  eventsService: EventsService;
  callback: (event: EventData) => void;
}


/**
 * A plugin for copying and dragging calendar events within ScheduleX.
 */
export class CopyEventPlugin {
  readonly name = 'copy-event-plugin';
  
  private config: PluginConfig;
  private draggedElement: { element: HTMLElement; data: EventData } | null = null;
  private hoveredElement: HTMLElement | null = null;

  /**
   * Initializes the plugin with event service and callback.
   */
  constructor(eventsService: EventsService, callback: (event: EventData) => void) {
    this.config = { eventsService, callback };
  }

  /**
   * Attaches plugin logic to the calendar DOM.
   */
  onRender($app: any): void {
    const calendarWrapper = $app.elements.calendarWrapper as HTMLElement;

    if (calendarWrapper.dataset.contextMenuListener) {
      return;
    }

    calendarWrapper.dataset.contextMenuListener = "true";

    calendarWrapper.addEventListener("contextmenu", this.handleContextMenu);
    document.addEventListener("mousemove", this.handleDrag);
    document.addEventListener("mouseup", this.handleDrop);
  }

  /**
   * Handles right-clicks on events to start the copy-drag.
   */
  private handleContextMenu = (e: MouseEvent): void => {
    const eventElement = (e.target as HTMLElement).closest(".sx__event") as HTMLElement;

    if ((e.target as HTMLElement).closest(".sx__date-grid")) {
        return;
    }

    if (!eventElement) {
        return;
    }

    e.preventDefault();

    const rawId = eventElement.getAttribute("data-event-id");
    
    if (!rawId) return;

    const parsedId = /^\d+$/.test(rawId) ? Number(rawId) : rawId;

    let eventData = this.config.eventsService.get(parsedId);

    if (eventData === undefined && typeof parsedId === "number") {
        eventData = this.config.eventsService.get(String(parsedId));
    }

    if (eventData) {
        this.startDrag(eventElement, eventData, e);
    }
  };


  /**
   * Clones the event element and prepares it for dragging.
   */
  private startDrag(
    eventElement: HTMLElement,
    data: EventData,
    e: MouseEvent
  ): void {
    const clone = this.cloneElement(eventElement);

    document.body.appendChild(clone);

    this.draggedElement = {
      element: clone,
      data: data
    };

    this.moveElement(clone, e.pageX, e.pageY);
  }

  /**
   * Handles dragging motion and hover feedback.
   */
  private handleDrag = (e: MouseEvent): void => {
    if (!this.draggedElement) {
      return;
    }

    const grid = document.querySelector(".sx__week-grid") as HTMLElement;

    if (!grid) {
      return;
    }

    if (!this.isWithinBounds(grid, e.pageX, e.pageY)) {
      return;
    }

    this.moveElement(this.draggedElement.element, e.pageX, e.pageY);
    this.highlightHoveredElement(e);
  };

  /**
   * Handles drop logic, updates the event time, and invokes the callback.
   */
  private handleDrop = (e: MouseEvent): void => {
    if (!this.draggedElement) {
      return;
    }

    if ((e.target as HTMLElement).closest(".sx__calendar-header")) {
      return;
    }

    if (e.button === 2) {
      this.abortDrag();
      return;
    }

    const newTime = this.getDateTimeFromPosition(e.pageX, e.pageY);

    if (newTime) {
      const updated = this.getUpdatedEventTime(this.draggedElement.data, newTime);
      this.config.callback(updated);
    }

    this.cleanupAfterDrop(e.target as HTMLElement);
  };

  /**
   * Aborts the drag and removes the cloned element.
   */
  private abortDrag(): void {
    if (!this.draggedElement) {
      return;
    }

    document.body.removeChild(this.draggedElement.element);

    this.removeHoverEffect();

    this.draggedElement = null;
  }

  /**
   * Clones an event element visually for dragging.
   */
  private cloneElement(el: HTMLElement): HTMLElement {
    const clone = el.cloneNode(true) as HTMLElement;

    const { width, height } = el.getBoundingClientRect();

    Object.assign(clone.style, {
      position: "absolute",
      pointerEvents: "none",
      opacity: "0.7",
      width: `${width}px`,
      height: `${height}px`
    });

    return clone;
  }

  /**
   * Moves the dragged element to a new screen position.
   */
  private moveElement(
    el: HTMLElement,
    x: number,
    y: number
  ): void {
    Object.assign(el.style, {
      left: `${x}px`,
      top: `${y}px`
    });
  }

  /**
   * Checks if coordinates are within an element’s bounding box.
   */
  private isWithinBounds(
    container: HTMLElement,
    x: number,
    y: number
  ): boolean {
    const rect = container.getBoundingClientRect();

    return (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
  }

  /**
   * Highlights the currently hovered grid day during drag.
   */
  private highlightHoveredElement(e: MouseEvent): void {
    const hovered = (e.target as HTMLElement).closest(".sx__time-grid-day") as HTMLElement;

    if (hovered === this.hoveredElement) {
      return;
    }

    this.removeHoverEffect();

    this.hoveredElement = hovered;

    if (this.hoveredElement) {
      this.hoveredElement.style.setProperty("background", "#80808014");
    }
  }

  /**
   * Removes the background highlight from the hovered element.
   */
  private removeHoverEffect(): void {
    if (this.hoveredElement) {
      this.hoveredElement.style.background = "";
      this.hoveredElement = null;
    }
  }

  /**
   * Finalizes drop, removes the clone, and prevents accidental clicks.
   */
  private cleanupAfterDrop(target: HTMLElement): void {
    if (!this.draggedElement) {
      return;
    }

    this.suppressNextClick(target);

    document.body.removeChild(this.draggedElement.element);

    this.removeHoverEffect();

    this.draggedElement = null;
  }

  /**
   * Temporarily suppresses the next click to prevent unwanted interactions.
   */
  private suppressNextClick(target: HTMLElement): void {
    const handler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      target.removeEventListener("click", handler, true);
    };

    target.addEventListener("click", handler, true);
  }

  /**
   * Converts a screen position to a datetime string.
   */
  private getDateTimeFromPosition(
    x: number,
    y: number
  ): string | null {
    const day = Array.from(document.querySelectorAll(".sx__time-grid-day"))
      .find((el) => this.isWithinBounds(el as HTMLElement, x, y)) as HTMLElement;

    const hour = Array.from(document.querySelectorAll(".sx__week-grid__hour"))
      .reduce((closest, el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const distance = Math.abs(y - rect.top);

        return distance < closest.distance
          ? { element: el as HTMLElement, distance }
          : closest;
      }, {
        element: null as HTMLElement | null,
        distance: Infinity
      }).element;

    if (!day || !hour) {
      return null;
    }

    const date = day.getAttribute("data-time-grid-date");
    const time = hour.querySelector(".sx__week-grid__hour-text")?.textContent?.trim();

    if (date && time) {
      return this.convertToISO(date, time);
    }

    return null;
  }

  /**
   * Updates event's start and end time based on a new start.
   */
  private getUpdatedEventTime(
    event: EventData,
    newStartTime: string
  ): EventData {
    const [origDate, origStart] = event.start.split(" ");
    const origEnd = event.end.split(" ")[1];

    const duration = (
      new Date(`${origDate}T${origEnd}`).getTime() -
      new Date(`${origDate}T${origStart}`).getTime()
    ) / 60000;

    const newStart = new Date(newStartTime.replace(" ", "T"));
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    return {
      ...event,
      id: uuidv4(), // 🔁 generate new ID for the copied event
      start: this.formatDateTime(newStart),
      end: this.formatDateTime(newEnd)
    };
  }


  /**
   * Formats a Date object into a "YYYY-MM-DD HH:mm" string.
   */
  private formatDateTime(date: Date): string {
    const pad = (n: number): string => String(n).padStart(2, "0");

    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
      ` ${pad(date.getHours())}:${pad(date.getMinutes())}`
    );
  }

  /**
   * Converts human-readable time (e.g. "2:00 PM") to ISO-like time string.
   */
  private convertToISO(
    date: string,
    timeText: string
  ): string {
    let [time, period] = timeText.trim().split(" ");

    let [hoursStr, minutesStr = "0"] = time.split(":");

    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }

    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return `${date} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }
}