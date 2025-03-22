export interface Plugin {
    name: string;
    beforeRender?($app: any): void;
    onRender($app: any): void;
}
  
export interface ScheduleXPluginOptions {
    plugins?: Plugin[];
}
  
export class ScheduleXPlugin {
    private plugins: Plugin[];
  
    constructor({ plugins = [] }: ScheduleXPluginOptions = {}) {
        this.plugins = plugins;
    }
  
    onRender($app: any) {
        this.plugins.forEach(plugin => {
            plugin.beforeRender?.($app);
            plugin.onRender?.($app);
        });
    }
}
  