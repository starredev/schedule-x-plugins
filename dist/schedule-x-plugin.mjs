class h {
  constructor({ plugins: r = [] } = {}) {
    Object.defineProperty(this, "plugins", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.plugins = r;
  }
  onRender(r) {
    this.plugins.forEach((t) => {
      var e, n;
      (e = t.beforeRender) === null || e === void 0 || e.call(t, r), (n = t.onRender) === null || n === void 0 || n.call(t, r);
    });
  }
}
class g {
  /**
   * Initializes the plugin with event service and callback.
   */
  constructor(r, t) {
    Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "copy-event-plugin"
    }), Object.defineProperty(this, "config", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "draggedElement", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: null
    }), Object.defineProperty(this, "hoveredElement", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: null
    }), Object.defineProperty(this, "handleContextMenu", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => {
        const n = e.target.closest(".sx__event");
        if (e.target.closest(".sx__date-grid") || !n)
          return;
        e.preventDefault();
        const i = Number(n.getAttribute("data-event-id")), o = this.config.eventsService.get(i);
        o && this.startDrag(n, o, e);
      }
    }), Object.defineProperty(this, "handleDrag", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => {
        if (!this.draggedElement)
          return;
        const n = document.querySelector(".sx__week-grid");
        n && this.isWithinBounds(n, e.pageX, e.pageY) && (this.moveElement(this.draggedElement.element, e.pageX, e.pageY), this.highlightHoveredElement(e));
      }
    }), Object.defineProperty(this, "handleDrop", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => {
        if (!this.draggedElement || e.target.closest(".sx__calendar-header"))
          return;
        if (e.button === 2) {
          this.abortDrag();
          return;
        }
        const n = this.getDateTimeFromPosition(e.pageX, e.pageY);
        if (n) {
          const i = this.getUpdatedEventTime(this.draggedElement.data, n);
          this.config.callback(i);
        }
        this.cleanupAfterDrop(e.target);
      }
    }), this.config = { eventsService: r, callback: t };
  }
  /**
   * Attaches plugin logic to the calendar DOM.
   */
  onRender(r) {
    const t = r.elements.calendarWrapper;
    t.dataset.contextMenuListener || (t.dataset.contextMenuListener = "true", t.addEventListener("contextmenu", this.handleContextMenu), document.addEventListener("mousemove", this.handleDrag), document.addEventListener("mouseup", this.handleDrop));
  }
  /**
   * Clones the event element and prepares it for dragging.
   */
  startDrag(r, t, e) {
    const n = this.cloneElement(r);
    document.body.appendChild(n), this.draggedElement = {
      element: n,
      data: t
    }, this.moveElement(n, e.pageX, e.pageY);
  }
  /**
   * Aborts the drag and removes the cloned element.
   */
  abortDrag() {
    this.draggedElement && (document.body.removeChild(this.draggedElement.element), this.removeHoverEffect(), this.draggedElement = null);
  }
  /**
   * Clones an event element visually for dragging.
   */
  cloneElement(r) {
    const t = r.cloneNode(!0), { width: e, height: n } = r.getBoundingClientRect();
    return Object.assign(t.style, {
      position: "absolute",
      pointerEvents: "none",
      opacity: "0.7",
      width: `${e}px`,
      height: `${n}px`
    }), t;
  }
  /**
   * Moves the dragged element to a new screen position.
   */
  moveElement(r, t, e) {
    Object.assign(r.style, {
      left: `${t}px`,
      top: `${e}px`
    });
  }
  /**
   * Checks if coordinates are within an element’s bounding box.
   */
  isWithinBounds(r, t, e) {
    const n = r.getBoundingClientRect();
    return t >= n.left && t <= n.right && e >= n.top && e <= n.bottom;
  }
  /**
   * Highlights the currently hovered grid day during drag.
   */
  highlightHoveredElement(r) {
    const t = r.target.closest(".sx__time-grid-day");
    t !== this.hoveredElement && (this.removeHoverEffect(), this.hoveredElement = t, this.hoveredElement && this.hoveredElement.style.setProperty("background", "#80808014"));
  }
  /**
   * Removes the background highlight from the hovered element.
   */
  removeHoverEffect() {
    this.hoveredElement && (this.hoveredElement.style.background = "", this.hoveredElement = null);
  }
  /**
   * Finalizes drop, removes the clone, and prevents accidental clicks.
   */
  cleanupAfterDrop(r) {
    this.draggedElement && (this.suppressNextClick(r), document.body.removeChild(this.draggedElement.element), this.removeHoverEffect(), this.draggedElement = null);
  }
  /**
   * Temporarily suppresses the next click to prevent unwanted interactions.
   */
  suppressNextClick(r) {
    const t = (e) => {
      e.preventDefault(), e.stopPropagation(), r.removeEventListener("click", t, !0);
    };
    r.addEventListener("click", t, !0);
  }
  /**
   * Converts a screen position to a datetime string.
   */
  getDateTimeFromPosition(r, t) {
    var e, n;
    const i = Array.from(document.querySelectorAll(".sx__time-grid-day")).find((s) => this.isWithinBounds(s, r, t)), o = Array.from(document.querySelectorAll(".sx__week-grid__hour")).reduce((s, d) => {
      const m = d.getBoundingClientRect(), c = Math.abs(t - m.top);
      return c < s.distance ? { element: d, distance: c } : s;
    }, {
      element: null,
      distance: 1 / 0
    }).element;
    if (!i || !o)
      return null;
    const a = i.getAttribute("data-time-grid-date"), l = (n = (e = o.querySelector(".sx__week-grid__hour-text")) === null || e === void 0 ? void 0 : e.textContent) === null || n === void 0 ? void 0 : n.trim();
    return a && l ? this.convertToISO(a, l) : null;
  }
  /**
   * Updates event's start and end time based on a new start.
   */
  getUpdatedEventTime(r, t) {
    const [e, n] = r.start.split(" "), i = r.end.split(" ")[1], o = ((/* @__PURE__ */ new Date(`${e}T${i}`)).getTime() - (/* @__PURE__ */ new Date(`${e}T${n}`)).getTime()) / 6e4, a = new Date(t.replace(" ", "T")), l = new Date(a.getTime() + o * 6e4);
    return {
      ...r,
      start: this.formatDateTime(a),
      end: this.formatDateTime(l)
    };
  }
  /**
   * Formats a Date object into a "YYYY-MM-DD HH:mm" string.
   */
  formatDateTime(r) {
    const t = (e) => String(e).padStart(2, "0");
    return `${r.getFullYear()}-${t(r.getMonth() + 1)}-${t(r.getDate())} ${t(r.getHours())}:${t(r.getMinutes())}`;
  }
  /**
   * Converts human-readable time (e.g. "2:00 PM") to ISO-like time string.
   */
  convertToISO(r, t) {
    let [e, n] = t.trim().split(" "), [i, o = "0"] = e.split(":"), a = parseInt(i, 10), l = parseInt(o, 10);
    return n === "PM" && a !== 12 && (a += 12), n === "AM" && a === 12 && (a = 0), `${r} ${String(a).padStart(2, "0")}:${String(l).padStart(2, "0")}`;
  }
}
class b {
  /**
   * Creates an instance of ZoomInPlugin.
   *
   * @param calendarControls - Controls object used to update calendar settings (e.g., setWeekOptions).
   * @param options - Optional configuration for zoom behavior.
   */
  constructor(r, t = {}) {
    var e, n, i, o, a;
    Object.defineProperty(this, "calendarControls", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: r
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "zoom-in-plugin"
    }), Object.defineProperty(this, "zoomFactor", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "minZoom", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "maxZoom", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "zoomStep", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "baseGridHeight", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.zoomFactor = (e = t.zoomFactor) !== null && e !== void 0 ? e : 1, this.minZoom = (n = t.minZoom) !== null && n !== void 0 ? n : 0.5, this.maxZoom = (i = t.maxZoom) !== null && i !== void 0 ? i : 2, this.zoomStep = (o = t.zoomStep) !== null && o !== void 0 ? o : 0.2, this.baseGridHeight = (a = t.baseGridHeight) !== null && a !== void 0 ? a : 900;
  }
  /**
   * Registers the wheel event listener to enable zooming.
   * Should be called when the plugin is rendered/activated.
   */
  onRender() {
    document.addEventListener("wheel", this.handleZoom.bind(this), {
      passive: !1
    });
  }
  /**
   * Clamps a numeric value between a minimum and maximum.
   *
   * @param value - The value to clamp.
   * @param min - Minimum allowed value.
   * @param max - Maximum allowed value.
   * @returns The clamped value.
   */
  clamp(r, t, e) {
    return Math.max(t, Math.min(e, r));
  }
  /**
   * Handles zoom logic based on mouse wheel input when Ctrl key is pressed.
   * Updates calendar grid height according to the current zoom factor.
   *
   * @param e - The wheel event object.
   */
  handleZoom(r) {
    if (!r.ctrlKey)
      return;
    r.preventDefault();
    const e = r.deltaY < 0 ? this.zoomStep : -this.zoomStep, n = this.zoomFactor + e;
    this.zoomFactor = this.clamp(n, this.minZoom, this.maxZoom);
    const i = this.baseGridHeight * this.zoomFactor, o = {
      ...this.calendarControls,
      gridHeight: i
    };
    this.calendarControls.setWeekOptions(o);
  }
}
export {
  g as CopyEventPlugin,
  h as ScheduleXPlugin,
  b as ZoomInPlugin
};
