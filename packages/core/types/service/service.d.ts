import { yParser } from '@dite/utils';
import { Config } from '../config/config';
import { ApplyPluginsType, ConfigChangeType, EnableBy, Env, IEvent, IModify, ServiceStage } from '../types';
import { Command } from './command';
import { Hook } from './hook';
import { Plugin } from './pluginApi';
export declare function getPkg({ cwd }: {
    cwd: string;
}): {
    pkg: Record<string, string | Record<string, any>>;
    pkgPath: string;
};
interface IOpts {
    cwd: string;
    env: Env;
    plugins?: string[];
    presets?: string[];
    frameworkName?: string;
    defaultConfigFiles?: string[];
}
export declare class Service {
    name: string;
    cwd: string;
    config: Record<string, any>;
    appData: {
        deps?: Record<string, {
            version: string;
            matches: string[];
            subpaths: string[];
            external?: boolean;
        }>;
        [key: string]: any;
    };
    args: yParser.Arguments;
    pluginMethods: Record<string, {
        plugin: Plugin;
        fn: Function;
    }>;
    pkgPath: string;
    commands: Record<string, Command>;
    pkg: {
        name?: string;
        version?: string;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        [key: string]: any;
    };
    keyToPluginMap: Record<string, Plugin>;
    stage: ServiceStage;
    configDefaults: Record<string, any>;
    configOnChanges: Record<string, any>;
    skipPluginIds: Set<string>;
    env: Env;
    hooks: Record<string, Hook[]>;
    private opts;
    plugins: Record<string, Plugin>;
    paths: {
        cwd?: string;
        absSrcPath?: string;
        absPagesPath?: string;
        absApiRoutesPath?: string;
        absTmpPath?: string;
        absNodeModulesPath?: string;
        absOutputPath?: string;
    };
    configManager: Config | null;
    configSchemas: Record<string, any>;
    userConfig: Record<string, any>;
    constructor(opts: IOpts);
    isPluginEnable(hook: Hook | string): boolean;
    initPreset(opts: {
        preset: Plugin;
        presets: Plugin[];
        plugins: Plugin[];
    }): Promise<void>;
    initPlugin(opts: {
        plugin: Plugin;
        presets?: Plugin[];
        plugins: Plugin[];
    }): Promise<any>;
    run(opts: {
        name: string;
        args?: any;
    }): Promise<void>;
    applyPlugins<T>(opts: {
        key: string;
        type?: ApplyPluginsType.event;
        initialValue?: any;
        args?: any;
        sync: true;
    }): typeof opts.initialValue | T;
    applyPlugins<T>(opts: {
        key: string;
        type?: ApplyPluginsType;
        initialValue?: any;
        args?: any;
    }): Promise<typeof opts.initialValue | T>;
    resolveConfig(): Promise<{
        config: any;
        defaultConfig: any;
    }>;
}
export interface IServicePluginAPI {
    appData: typeof Service.prototype.appData;
    applyPlugins: typeof Service.prototype.applyPlugins;
    args: typeof Service.prototype.args;
    config: typeof Service.prototype.config;
    cwd: typeof Service.prototype.cwd;
    pkg: typeof Service.prototype.pkg;
    pkgPath: typeof Service.prototype.pkgPath;
    name: typeof Service.prototype.name;
    paths: Required<typeof Service.prototype.paths>;
    userConfig: typeof Service.prototype.userConfig;
    env: typeof Service.prototype.env;
    isPluginEnable: typeof Service.prototype.isPluginEnable;
    onCheck: IEvent<null>;
    onStart: IEvent<null>;
    modifyAppData: IModify<typeof Service.prototype.appData, null>;
    modifyConfig: IModify<typeof Service.prototype.config, {
        paths: Record<string, string>;
    }>;
    modifyDefaultConfig: IModify<typeof Service.prototype.config, null>;
    modifyPaths: IModify<typeof Service.prototype.paths, null>;
    ApplyPluginsType: typeof ApplyPluginsType;
    ConfigChangeType: typeof ConfigChangeType;
    EnableBy: typeof EnableBy;
    ServiceStage: typeof ServiceStage;
    registerPresets: (presets: any[]) => void;
    registerPlugins: (plugins: (Plugin | {})[]) => void;
}
export {};
//# sourceMappingURL=service.d.ts.map