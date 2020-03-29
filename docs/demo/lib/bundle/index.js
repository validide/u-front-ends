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

    function noop() { }

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

    function loadResource(document, url, isScript = true, attributes) {
        return new Promise((resolve, reject) => {
            let resource;
            if (isScript) {
                resource = document.createElement('script');
                resource.src = url;
            }
            else {
                resource = document.createElement('link');
                resource.href = url;
            }
            if (attributes) {
                const keys = Object.keys(attributes);
                for (let index = 0; index < keys.length; index++) {
                    const key = keys[index];
                    resource.setAttribute(key, attributes[key]);
                }
            }
            resource.addEventListener('load', () => resolve());
            resource.addEventListener('error', () => reject(new Error(`Script load error for url: ${url}.`)));
            document.head.appendChild(resource);
        });
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
            this.resourcesLoaded = false;
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
        loadResources() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.resourcesLoaded)
                    return;
                this.resourcesLoaded = true;
                const options = this.getOptions();
                if (options.resources && options.resources.length > 0) {
                    const document = this.getDocument();
                    for (let index = 0; index < options.resources.length; index++) {
                        const resource = options.resources[index];
                        // DO NOT LOAD ALL T ONCE AS YOU MIHGT HAVE DEPENDENCIES
                        // AND LA RESOURCE MIGHT LOAD BEFORE IT'S DEPENDENCY
                        yield loadResource(document, resource.url, resource.isScript, resource.attributes);
                    }
                }
            });
        }
        getOptions() {
            return this.options;
        }
        getWindow() { return this.window; }
        getDocument() { return this.getWindow().document; }
        initializeCore() { return Promise.resolve(); }
        mountCore() {
            // This needs to be handled by each component
            // this.callHandler(ComponentEventType.Mounted);
            return Promise.resolve();
        }
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
                    return this;
                this.callHandler(exports.ComponentEventType.BeforeCreate);
                this.isInitialized = true;
                try {
                    yield this.loadResources();
                    this.createRootElement();
                    yield this.initializeCore();
                }
                catch (e) {
                    this.callErrorHandler(e);
                }
                this.callHandler(exports.ComponentEventType.Created);
                return this;
            });
        }
        mount() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.isInitialized) {
                    this.callErrorHandler(new Error(`Call "initialize" before calling "mount".`));
                    return this;
                }
                if (this.isMounted)
                    return this;
                this.callHandler(exports.ComponentEventType.BeforeMount);
                this.isMounted = true;
                try {
                    yield this.mountCore();
                }
                catch (e) {
                    this.callErrorHandler(e);
                }
                return this;
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
                this.resourcesLoaded = false;
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
            this.resources = [];
        }
    }

    class ResourceConfiguration {
        constructor() {
            this.url = '';
            this.isScript = true;
        }
    }

    var ChildComponentType;
    (function (ChildComponentType) {
        ChildComponentType["Script"] = "script";
        ChildComponentType["Iframe"] = "iframe";
        ChildComponentType["CustomElement"] = "customElement";
    })(ChildComponentType || (ChildComponentType = {}));

    class ChildContentBridge {
        constructor(signalMounted, signalBeforeUpdate, signalUpdated, signalDispose, setDisposeAction) {
            this.signalMounted = signalMounted;
            this.signalBeforeUpdate = signalBeforeUpdate;
            this.signalUpdated = signalUpdated;
            this.signalDispose = signalDispose;
            this.setDisposeAction = setDisposeAction;
        }
    }

    var __awaiter$1 = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class ChildComponent extends Component {
        constructor(window, options, rootFacade) {
            super(window, options);
            this.rootFacade = rootFacade;
            this.childContentBridge = new ChildContentBridge(() => this.callHandler(exports.ComponentEventType.Mounted), () => this.callHandler(exports.ComponentEventType.BeforeUpdate), () => this.callHandler(exports.ComponentEventType.Updated), () => this.signalDispose(), (cb) => this.setContentDisposeCallback(cb));
            this.childContentDisposeAction = null;
            this.contentDisposePromise = null;
        }
        getChildContentBridge() {
            return this.childContentBridge;
        }
        getOptions() {
            return super.getOptions();
        }
        beginContentDispose() {
            if (this.contentDisposePromise !== null)
                return; // Dispose was already requested.
            if (this.childContentDisposeAction) {
                this.contentDisposePromise = Promise
                    .race([
                    this.childContentDisposeAction(),
                    new Promise((resolveTimeout, rejectTimeout) => {
                        this
                            .getWindow()
                            .setTimeout(() => resolveTimeout(), this.getOptions().contentDisposeTimeout);
                    })
                ])
                    .catch((err) => {
                    this.callErrorHandler(err);
                });
            }
            else {
                this.contentDisposePromise = Promise.resolve();
            }
        }
        setContentDisposeCallback(callback) {
            if (this.childContentDisposeAction)
                return;
            this.childContentDisposeAction = callback;
        }
        signalDispose() {
            if (this.contentDisposePromise !== null)
                return; // Dispose was initiated by "this".
            // Set the promise so we do not trigger it again;
            this.contentDisposePromise = Promise.resolve();
            this.rootFacade.signalDispose(this);
        }
        disposeCore() {
            const _super = Object.create(null, {
                disposeCore: { get: () => super.disposeCore }
            });
            return __awaiter$1(this, void 0, void 0, function* () {
                this.beginContentDispose();
                yield this.contentDisposePromise;
                this.childContentBridge = null;
                this.childContentDisposeAction = null;
                this.contentDisposePromise = null;
                yield _super.disposeCore.call(this);
            });
        }
    }

    var __awaiter$2 = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class ScriptChildComponent extends ChildComponent {
        constructor(window, options, rootFacade) {
            super(window, options, rootFacade);
        }
        mountCore() {
            const _super = Object.create(null, {
                mountCore: { get: () => super.mountCore }
            });
            return __awaiter$2(this, void 0, void 0, function* () {
                const options = this.getOptions();
                options.injectBridge(this.getChildContentBridge());
                yield _super.mountCore.call(this);
            });
        }
    }

    class ChildComponentFactory {
        createComponent(window, options, rootFacade) {
            switch (options.type) {
                case ChildComponentType.Script:
                    return new ScriptChildComponent(window, options, rootFacade);
                default:
                    throw new Error(`The "${options.type}" is not configured.`);
            }
        }
    }

    class RootComponentFacade {
        constructor(signalDispose) {
            this.signalDispose = signalDispose;
        }
    }

    class RootComponent extends Component {
        constructor(window, options) {
            super(window, options);
            this.children = {};
        }
        scheduleDisposeChild(child) {
            // Schedule this later
            this.getWindow().setTimeout(() => {
                this.disposeChildByRef(child);
            }, 0);
        }
        getChildId(child) {
            const childIds = Object.keys(this.children);
            for (let index = 0; index < childIds.length; index++) {
                const id = childIds[index];
                if (this.children[id] === child) {
                    return id;
                }
            }
            return null;
        }
        disposeChildByRef(child) {
            return this.disposeChild(this.getChildId(child));
        }
        disposeChild(childId) {
            const child = childId
                ? this.children[childId]
                : null;
            if (!child)
                return Promise.resolve();
            return child
                .dispose()
                .then(() => {
                this.children[childId] = null;
            });
        }
        mountCore() {
            this.callHandler(exports.ComponentEventType.Mounted);
            return super.mountCore();
        }
        addChild(options) {
            if (!this.isMounted)
                throw new Error('Wait for the component to mount before starting to add children.');
            const factory = new ChildComponentFactory();
            const child = factory.createComponent(this.getWindow(), options, new RootComponentFacade((child) => this.scheduleDisposeChild(child)));
            let id;
            do {
                id = 'c_' + getRandomString();
            } while (Object.keys(this.children).indexOf(id) !== -1);
            this.children[id] = child;
            this.getWindow().setTimeout(() => {
                child
                    .initialize()
                    .then((t) => t.mount());
            }, 0);
            return id;
        }
        removeChild(childId) {
            this.getWindow().setTimeout(() => {
                this.disposeChild(childId);
            }, 0);
        }
    }

    class RootComponentOptions extends ComponentOptions {
        constructor() {
            super();
            this.tag = 'script';
        }
    }

    exports.ChildContentBridge = ChildContentBridge;
    exports.Component = Component;
    exports.ComponentEvent = ComponentEvent;
    exports.ComponentEventHandlers = ComponentEventHandlers;
    exports.ComponentOptions = ComponentOptions;
    exports.ResourceConfiguration = ResourceConfiguration;
    exports.RootComponent = RootComponent;
    exports.RootComponentFacade = RootComponentFacade;
    exports.RootComponentOptions = RootComponentOptions;
    exports.ScriptChildComponent = ScriptChildComponent;
    exports.generateUniqueId = generateUniqueId;
    exports.getHashCode = getHashCode;
    exports.getRandomString = getRandomString;
    exports.getUrlFullPath = getUrlFullPath;
    exports.getUrlOrigin = getUrlOrigin;
    exports.noop = noop;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
