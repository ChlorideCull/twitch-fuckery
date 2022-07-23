export default class ContentScriptAbstraction {
    private static _inContentScript: boolean | null = null;
    private static inContentScript() {
        if (this._inContentScript != null) {
            return this._inContentScript;
        }

        if ('wrappedJSObject' in globalThis.window) {
            this._inContentScript = true;
            return true;
        }
        this._inContentScript = false;
        return false;
    }

    public static get window() : Window {
        if (this.inContentScript()) {
            return (<any>globalThis.window).wrappedJSObject;
        }
        return globalThis.window;
    }
    
    public static get document() : Document {
        if (this.inContentScript()) {
            return (<any>globalThis.window).document.wrappedJSObject;
        }
        return globalThis.window.document;
    }

    public static fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
        if (!this.inContentScript()) {
            return globalThis.fetch(input, init);
        }

        if (typeof input == "string") {
            return (<any>globalThis.window).wrappedJSObject.fetch(input, init ? this.exposeObject(init) : undefined);
        } else {
            return (<any>globalThis.window).wrappedJSObject.fetch(this.exposeObject(input), init ? this.exposeObject(init) : undefined);
        }
    }

    public static exposeObject<T>(obj: T): T {
        if (this.inContentScript()) {
            // @ts-expect-error: cloneInto is non-standard API as provided by firefox
            return cloneInto(obj, window, {});
        }
        return obj;
    }

    public static exposeFunction<T>(obj: T): T {
        if (this.inContentScript()) {
            // @ts-expect-error: exportFunction is non-standard API as provided by firefox
            return exportFunction(obj, window, {});
        }
        return obj;
    }
}
