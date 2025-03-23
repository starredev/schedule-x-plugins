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
}

/**
 * Manages ScheduleX plugins and their lifecycle hooks.
 */
export class ScheduleXPlugin {
    /**
     * Internal list of registered plugins.
     */
    private plugins: Plugin[];

    /**
     * Creates a new instance of ScheduleXPlugin.
     * 
     * @param options - Options for configuring plugins.
     */
    constructor({ plugins = [] }: ScheduleXPluginOptions = {}) {
        this.plugins = plugins;
    }

    /**
     * Calls lifecycle hooks (beforeRender and onRender) of all registered plugins.
     * 
     * @param $app - The application instance passed to plugins.
     */
    onRender($app: any) {
        this.plugins.forEach(plugin => {
            plugin.beforeRender?.($app);
            plugin.onRender?.($app);
        });
    }
}