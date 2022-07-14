import { yParser } from '@dite/utils';
import { Plugin } from './plugin';
import { ResolveConfigMode } from './pluginApi';
export interface IOpts {
    name: string;
    description?: string;
    options?: string;
    details?: string;
    fn: {
        ({ args }: {
            args: yParser.Arguments;
        }): void;
    };
    plugin: Plugin;
    configResolveMode?: ResolveConfigMode;
}
export declare class Command {
    name: string;
    description?: string;
    options?: string;
    details?: string;
    configResolveMode: ResolveConfigMode;
    fn: {
        ({ args }: {
            args: yParser.Arguments;
        }): void | Promise<void>;
    };
    plugin: Plugin;
    constructor(opts: IOpts);
}
//# sourceMappingURL=command.d.ts.map