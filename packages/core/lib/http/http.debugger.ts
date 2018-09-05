export class HttpDebugger {
    /*
    Called when http request is started
    */
    debugStartHttpRequest(): void {
    }

    /*
    Called when http request is resolved
    */
    debugResolveHttpRequest(): void {
    }

    /*
    Called when http request errored out
    */
    debugFailedHttpRequest(): void {
    }
}

export const httpDebugger = new HttpDebugger();
