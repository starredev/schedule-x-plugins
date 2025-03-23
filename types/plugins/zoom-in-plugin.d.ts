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
export declare class ZoomInPlugin {
    private calendarControls;
    /** Unique name for the plugin */
    name: string;
    /** Current zoom factor */
    private zoomFactor;
    /** Minimum zoom factor allowed */
    private minZoom;
    /** Maximum zoom factor allowed */
    private maxZoom;
    /** Step change in zoom factor per scroll */
    private zoomStep;
    /** Default base grid height (in pixels) */
    private baseGridHeight;
    /**
     * Creates an instance of ZoomInPlugin.
     *
     * @param calendarControls - Controls object used to update calendar settings (e.g., setWeekOptions).
     * @param options - Optional configuration for zoom behavior.
     */
    constructor(calendarControls: any, options?: ZoomInPluginOptions);
    /**
     * Registers the wheel event listener to enable zooming.
     * Should be called when the plugin is rendered/activated.
     */
    onRender(): void;
    /**
     * Clamps a numeric value between a minimum and maximum.
     *
     * @param value - The value to clamp.
     * @param min - Minimum allowed value.
     * @param max - Maximum allowed value.
     * @returns The clamped value.
     */
    private clamp;
    /**
     * Handles zoom logic based on mouse wheel input when Ctrl key is pressed.
     * Updates calendar grid height according to the current zoom factor.
     *
     * @param e - The wheel event object.
     */
    private handleZoom;
}
export {};
