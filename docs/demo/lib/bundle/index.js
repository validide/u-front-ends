(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.validide_uFrontEnds = {}));
}(this, (function (exports) { 'use strict';

    (function (ComponentEventType) {
        ComponentEventType["BeforeCreate"] = "beforeCreate";
        ComponentEventType["Created"] = "created";
        ComponentEventType["BeforeMount"] = "beforeMount";
        ComponentEventType["Mounted"] = "mounted";
        ComponentEventType["BeforeUpdate"] = "beforeUpdate";
        ComponentEventType["Updated"] = "updated";
        ComponentEventType["BeforeDestroy"] = "beforeDestroy";
        ComponentEventType["Destroyed"] = "destroyed";
        ComponentEventType["Error"] = "error";
    })(exports.ComponentEventType || (exports.ComponentEventType = {}));
    class ComponentEvent {
        constructor(id, type, el, parentEl, error) {
            this.id = id;
            this.type = type;
            this.el = el;
            this.parentEl = parentEl;
            this.error = error;
            this.timestamp = new Date();
        }
    }

    /**
     * Return the origin of an url
     * @param document The reference to the document object
     * @param url The ´url´ for which to get the 'origin'
     * @returns A string representing the url origin
     */
    function getUrlOrigin(document, url) {
        if (!url)
            return '';
        const a = document.createElement('a');
        a.setAttribute('href', url);
        return a.protocol + "//" + a.hostname + (a.port && ":" + a.port);
    }

    /**
     * Return the full path of an url (the origin and path name)
     * @param document The reference to the document object
     * @param url The ´url´ for which to get the full path
     * @returns A string representing the url full path
     */
    function getUrlFullPath(document, url) {
        if (!url)
            return '';
        const a = document.createElement('a');
        a.setAttribute('href', url);
        return a.protocol + "//" + a.hostname + (a.port && ":" + a.port) + a.pathname;
    }

    /**
     * Get a hash code for the given string
     * @returns The has code
     */
    function getHashCode(value) {
        let hash = 0;
        let length = value.length;
        let char;
        let index = 0;
        if (length === 0)
            return hash;
        while (index < length) {
            char = value.charCodeAt(index);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
            index++;
        }
        return hash;
    }

    /**
     * Generate a random string
     * @returns A random generated string
     */
    function getRandomString() { return Math.random().toString(36).substring(2); }

    /**
     * Generate a random id that is not present in the document at this time
     * @param document The reference to the document object
     * @returns A random generated string
     */
    function generateUniqueId(document, prefix = '') {
        const prefixString = (prefix !== null && prefix !== void 0 ? prefix : '');
        while (true) {
            // The 'A-' will ensure this is always a valid JavaScript ID
            const id = prefixString + 'A-' + getRandomString() + getRandomString();
            if (document.getElementById(id) === null) {
                return id;
            }
        }
    }

    var __awaiter = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class Component {
        constructor(window, options) {
            if (!window)
                throw new Error('Missing "window" argument.');
            if (!options)
                throw new Error('Missing "options" argument.');
            this.isInitialized = false;
            this.isMounted = false;
            this.id = '';
            this.rootElement = null;
            this.window = window;
            this.options = options;
            this.disposed = false;
        }
        createRootElement() {
            if (this.rootElement)
                return;
            const parent = this.getParentElement();
            this.rootElement = this.getDocument().createElement(this.getOptions().tag);
            this.id = generateUniqueId(this.getDocument(), 'ufe-');
            this.rootElement.id = this.id;
            parent.appendChild(this.rootElement);
        }
        getParentElement() {
            let parent = null;
            const opt = this.getOptions();
            if (opt.parent) {
                if (typeof opt.parent === 'string') {
                    parent = this.getDocument().querySelector(opt.parent);
                }
                else {
                    parent = opt.parent;
                }
            }
            if (!parent)
                throw new Error(`Failed to find parent "${opt.parent}".`);
            return parent;
        }
        getOptions() {
            return this.options;
        }
        getWindow() { return this.window; }
        getDocument() { return this.getWindow().document; }
        initializeCore() { return Promise.resolve(); }
        mountCore() { return Promise.resolve(); }
        disposeCore() { return Promise.resolve(); }
        callErrorHandler(e) {
            var _a;
            const handler = (_a = this.options.handlers) === null || _a === void 0 ? void 0 : _a.error;
            if (handler) {
                try {
                    handler(new ComponentEvent(this.id, exports.ComponentEventType.Error, this.rootElement, this.getParentElement(), e));
                }
                catch (error) {
                    this.log(error);
                }
            }
            else {
                this.log(e);
            }
        }
        callHandler(type) {
            if (type === exports.ComponentEventType.Error)
                throw new Error(`For calling the "${exports.ComponentEventType.Error}" handler use the "callErrorHandler" method.`);
            const handler = this.options.handlers
                ? this.options.handlers[type]
                : null;
            if (handler) {
                try {
                    handler(new ComponentEvent(this.id, type, this.rootElement, this.getParentElement(), null));
                }
                catch (error) {
                    this.callErrorHandler(error);
                }
            }
        }
        log(message, ...optionalParams) {
            var _a, _b;
            const logMethod = (_b = (_a = this.window) === null || _a === void 0 ? void 0 : _a.console) === null || _b === void 0 ? void 0 : _b.log;
            if (logMethod)
                logMethod(message, optionalParams);
        }
        initialize() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isInitialized)
                    return;
                this.callHandler(exports.ComponentEventType.BeforeCreate);
                this.isInitialized = true;
                try {
                    this.createRootElement();
                    yield this.initializeCore();
                }
                catch (e) {
                    this.callErrorHandler(e);
                }
                this.callHandler(exports.ComponentEventType.Created);
            });
        }
        mount() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.isInitialized) {
                    this.callErrorHandler(new Error(`Call "initialize" before calling "mount".`));
                    return;
                }
                if (this.isMounted)
                    return;
                this.callHandler(exports.ComponentEventType.BeforeMount);
                this.isMounted = true;
                try {
                    yield this.mountCore();
                }
                catch (e) {
                    this.callErrorHandler(e);
                }
                // This should be called by the component implementations.
                //this.callHandler(ComponentEventType.BeforeMount)
            });
        }
        dispose() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                if (this.disposed)
                    return;
                this.callHandler(exports.ComponentEventType.BeforeDestroy);
                this.disposed = true;
                try {
                    yield this.disposeCore();
                }
                catch (e) {
                    this.callErrorHandler(e);
                }
                this.callHandler(exports.ComponentEventType.Destroyed);
                this.id = '';
                this.isInitialized = false;
                this.isMounted = false;
                (_b = (_a = this.rootElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(this.rootElement);
                this.rootElement = null;
                this.window = null;
            });
        }
    }

    class ComponentEventHandlers {
    }
    exports.ComponentEventType.BeforeCreate, exports.ComponentEventType.Created, exports.ComponentEventType.BeforeMount, exports.ComponentEventType.Mounted, exports.ComponentEventType.BeforeUpdate, exports.ComponentEventType.Updated, exports.ComponentEventType.BeforeDestroy, exports.ComponentEventType.Destroyed, exports.ComponentEventType.Error;
    class ComponentOptions {
        constructor() {
            this.parent = 'body';
            this.tag = 'div';
            this.handlers = new ComponentEventHandlers();
        }
    }

    exports.Component = Component;
    exports.ComponentEvent = ComponentEvent;
    exports.ComponentEventHandlers = ComponentEventHandlers;
    exports.ComponentOptions = ComponentOptions;
    exports.generateUniqueId = generateUniqueId;
    exports.getHashCode = getHashCode;
    exports.getRandomString = getRandomString;
    exports.getUrlFullPath = getUrlFullPath;
    exports.getUrlOrigin = getUrlOrigin;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
