/**
 * Interface representing a plugin for ScheduleX.
 */
export interface Plugin {
    /**
     * The name of the plugin.
     */
    name: string;
    /**
     * Hook that runs before the render lifecycle.
     * @param $app - The application instance.
     */
    beforeRender?($app: any): void;
    /**
     * Hook that runs during the render lifecycle.
     * @param $app - The application instance.
     */
    onRender($app: any): void;
}
/**
 * Options for initializing the ScheduleXPlugin class.
 */
export interface ScheduleXPluginOptions {
    /**
     * An optional array of plugins to register.
     */
    plugins?: Plugin[];
    /**
     * Optional custom name for the plugin manager.
     */
    name?: string;
}
/**
 * Manages ScheduleX plugins and their lifecycle hooks.
 */
export declare class ScheduleXPlugin implements Plugin {
    /**
     * The name of the plugin manager.
     */
    name: string;
    /**
     * Internal list of registered plugins.
     */
    private plugins;
    /**
     * Creates a new instance of ScheduleXPlugin.
     *
     * @param options - Options for configuring plugins.
     */
    constructor({ plugins, name }?: ScheduleXPluginOptions);
    /**
     * Calls the beforeRender lifecycle hook of all registered plugins.
     *
     * @param $app - The application instance passed to plugins.
     */
    beforeRender($app: any): void;
    /**
     * Calls the onRender lifecycle hook of all registered plugins.
     *
     * @param $app - The application instance passed to plugins.
     */
    onRender($app: any): void;
}
