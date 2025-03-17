import { Constructor, Provider } from '@loopback/context';
import { RateLimitMetadata } from '../types';
export declare class RateLimitMetadataProvider implements Provider<RateLimitMetadata | undefined> {
    private readonly controllerClass;
    private readonly methodName;
    constructor(controllerClass: Constructor<{}>, methodName: string);
    value(): RateLimitMetadata | undefined;
}
export declare function getRateLimitMetadata(controllerClass: Constructor<{}>, methodName: string): RateLimitMetadata | undefined;
