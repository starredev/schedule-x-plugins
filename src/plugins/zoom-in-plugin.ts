/**
 * Configuration options for the ZoomInPlugin.
 * All options are optional and have sensible defaults.
 */
type ZoomInPluginOptions = {
  /** Initial zoom factor (default: 1) */
  zoomFactor?: number;

  /** Minimum zoom factor allowed (default: 0.5) */
  minZoom?: number;

  /** Maximum zoom factor allowed (default: 2) */
  maxZoom?: number;

  /** Amount to change zoom factor per scroll step (default: 0.2) */
  zoomStep?: number;

  /** Base height of the grid before zooming (default: 900) */
  baseGridHeight?: number;
};

/**
 * ZoomInPlugin adds zooming functionality to a calendar grid using the mouse wheel + Ctrl key.
 * It adjusts the height of the grid based on a zoom factor within defined bounds.
 */
export class ZoomInPlugin {
  /** Unique name for the plugin */
  name = 'zoom-in-plugin';

  /** Current zoom factor */
  private zoomFactor: number;

  /** Minimum zoom factor allowed */
  private minZoom: number;

  /** Maximum zoom factor allowed */
  private maxZoom: number;

  /** Step change in zoom factor per scroll */
  private zoomStep: number;

  /** Default base grid height (in pixels) */
  private baseGridHeight: number;

  /**
   * Creates an instance of ZoomInPlugin.
   * 
   * @param calendarControls - Controls object used to update calendar settings (e.g., setWeekOptions).
   * @param options - Optional configuration for zoom behavior.
   */
  constructor(
    private calendarControls: any,
    options: ZoomInPluginOptions = {}
  ) {
    this.zoomFactor = options.zoomFactor ?? 1;
    this.minZoom = options.minZoom ?? 0.5;
    this.maxZoom = options.maxZoom ?? 2;
    this.zoomStep = options.zoomStep ?? 0.2;
    this.baseGridHeight = options.baseGridHeight ?? 900;
  }

  /**
   * Registers the wheel event listener to enable zooming.
   * Should be called when the plugin is rendered/activated.
   */
  onRender(): void {
    document.addEventListener('wheel', this.handleZoom.bind(this), {
      passive: false,
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
  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Handles zoom logic based on mouse wheel input when Ctrl key is pressed.
   * Updates calendar grid height according to the current zoom factor.
   *
   * @param e - The wheel event object.
   */
  private handleZoom(e: WheelEvent): void {
    if (!e.ctrlKey) return;

    e.preventDefault();

    const isZoomingIn = e.deltaY < 0;
    const zoomDelta = isZoomingIn ? this.zoomStep : -this.zoomStep;
    const proposedZoom = this.zoomFactor + zoomDelta;

    this.zoomFactor = this.clamp(proposedZoom, this.minZoom, this.maxZoom);

    const proposedHeight = this.baseGridHeight * this.zoomFactor;

    const updatedOptions = {
      ...this.calendarControls,
      gridHeight: proposedHeight,
    };

    this.calendarControls.setWeekOptions(updatedOptions);
  }
}
