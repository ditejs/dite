import { IOpts as ICommandOpts } from './command';
import { IOpts as IHookOpts } from './hook';
import { Service } from './service';
declare const resolveConfigModes: readonly ["strict", "loose"];
export declare type ResolveConfigMode = typeof resolveConfigModes[number];
import { Plugin } from './plugin';
export declare class PluginAPI {
    plugin: Plugin;
    service: Service;
    constructor(opts: {
        plugin: Plugin;
        service: Service;
    });
    register(opts: Omit<IHookOpts, 'plugin'>): void;
    registerMethod(opts: {
        name: string;
        fn?: Function;
    }): void;
    registerCommand(opts: Omit<ICommandOpts, 'plugin'> & {
        alias?: string | string[];
    }): void;
    static proxyPluginAPI(opts: {
        pluginAPI: PluginAPI;
        service: Service;
        serviceProps: string[];
        staticProps: Record<string, any>;
    }): PluginAPI;
    registerPresets(source: Plugin[], presets: any[]): void;
    registerPlugins(source: Plugin[], plugins: any[]): void;
    skipPlugins(keys: string[]): void;
}
export { Plugin };
//# sourceMappingURL=pluginApi.d.ts.map