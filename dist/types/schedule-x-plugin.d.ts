export interface Plugin {
    name: string;
    beforeRender?($app: any): void;
    onRender($app: any): void;
}
export interface ScheduleXPluginOptions {
    plugins?: Plugin[];
}
export declare class ScheduleXPlugin {
    private plugins;
    constructor({ plugins }?: ScheduleXPluginOptions);
    onRender($app: any): void;
}
