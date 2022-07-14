import { Env } from '../types';
declare type ISchema = Record<string, any>;
declare type IOnChangeTypes = Record<string, string | Function>;
export interface IConfig {
    port: number;
    dir: string;
    version: string;
    cwd: string;
    ssl: string;
}
export declare function defineConfig(options: Partial<IConfig>): Partial<IConfig>;
export declare function loadConfig(): Promise<IConfig>;
interface IOpts {
    cwd: string;
    env: Env;
    specifiedEnv?: string;
    defaultConfigFiles?: string[];
}
export declare class Config {
    opts: IOpts;
    mainConfigFile: string | null;
    prevConfig: any;
    files: string[];
    constructor(opts: IOpts);
    getConfig(opts: {
        schemas: ISchema;
    }): {
        config: {};
        files: string[];
    };
    watch(opts: {
        schemas: ISchema;
        onChangeTypes: IOnChangeTypes;
        onChange: (opts: {
            data: ReturnType<typeof Config.diffConfigs>;
            event: string;
            path: string;
        }) => Promise<void>;
    }): () => Promise<void>;
    static getMainConfigFile(opts: {
        cwd: string;
        defaultConfigFiles?: string[];
    }): string | null;
    static getConfigFiles(opts: {
        mainConfigFile: string | null;
        env: Env;
        specifiedEnv?: string;
    }): string[];
    getUserConfig(): {
        config: {};
        files: string[];
    };
    static getUserConfig(opts: {
        configFiles: string[];
    }): {
        config: {};
        files: string[];
    };
    static validateConfig(opts: {
        config: any;
        schemas: ISchema;
    }): void;
    static diffConfigs(opts: {
        origin: any;
        updated: any;
        onChangeTypes: IOnChangeTypes;
    }): {
        changes: Record<string, string[]>;
        fns: Function[];
    };
}
export {};
//# sourceMappingURL=config.d.ts.map