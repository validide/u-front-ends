(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.validide_uFrontEnds = {}));
}(this, (function (exports) { 'use strict';

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
     * Generate a v4 UUID/GUID
     * @returns A random generated string
     */
    function getUuidV4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    /**
     * Generate a random string
     * @returns A random generated string
     */
    function getRandomString() { return Math.random().toString(36).substring(2); }

    /**
     * A function that does nothing.
     */
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
     * A function to load a resource and wait for it to load.
     * @param document The reference to the document object.
     * @param url The resource URL.
     * @param isScript Is this resource a script or a stylesheet?
     * @param skipLoading Function to determine if the resource should not be loaded.
     * @param attributes Extra attributes to add on the HTML element before attaching it to the document.
     */
    function loadResource(document, url, isScript = true, skipLoading, attributes) {
        if (skipLoading && skipLoading())
            return Promise.resolve();
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

    /**
     * Lifecycle event types.
     */
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
        ComponentEventType["Data"] = "data";
    })(exports.ComponentEventType || (exports.ComponentEventType = {}));
    /**
     * Evnts triggered by the components
     */
    class ComponentEvent {
        /**
         * COnstructor.
         * @param id Component unique idnetifyer.
         * @param type The type of event.
         * @param el The componenet root element.
         * @param parentEl The parent element of the component.
         * @param error The error data in case this is an error event.
         */
        constructor(id, type, el, parentEl, error) {
            this.id = id;
            this.type = type;
            this.el = el;
            this.parentEl = parentEl;
            this.error = error;
            this.timestamp = new Date();
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
    /**
     * Base class for all components.
     */
    class Component {
        /**
         * Constructor
         * @param window The reference to the window object
         * @param options The component options
         */
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
        /**
         * Create the root element hat will "encapsulate" the rest of the elements.
         */
        createRootElement() {
            if (this.rootElement)
                return;
            const parent = this.getParentElement();
            this.rootElement = this.getDocument().createElement(this.getOptions().tag);
            this.id = generateUniqueId(this.getDocument(), 'ufe-');
            this.rootElement.id = this.id;
            parent.appendChild(this.rootElement);
        }
        /**
         * Get the parent element that hosts this component.
         */
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
        /**
         * Load the resources required by the compoent.
         */
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
                        // DO NOT LOAD ALL AT ONCE AS YOU MIHGT HAVE DEPENDENCIES
                        // AND A RESOURCE MIGHT LOAD BEFORE IT'S DEPENDENCY
                        yield loadResource(document, resource.url, resource.isScript, resource.skip, resource.attributes);
                    }
                }
            });
        }
        /**
         * Get the optons data.
         */
        getOptions() {
            return this.options;
        }
        /**
         * Get the wndow reference.
         */
        getWindow() { return this.window; }
        /**
         * Get the document refrence.
         */
        getDocument() { return this.getWindow().document; }
        /**
         * Core initialization function.
         * Any component derived should override this to add extra functionality.
         */
        initializeCore() { return Promise.resolve(); }
        /**
         * Core mount function.
         * Any component derived should override this to add extra functionality.
         */
        mountCore() {
            // This needs to be handled by each component
            // this.callHandler(ComponentEventType.Mounted);
            return Promise.resolve();
        }
        /**
         * Core dispose function.
         * Any component derived should override this to add clean-up after itself.
         */
        disposeCore() { return Promise.resolve(); }
        /**
         * Call the global error handler.
         * @param e The error object
         */
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
        /**
         * Call a specific event handler.
         * @param type The type of handler to call.
         */
        callHandler(type, data) {
            if (type === exports.ComponentEventType.Error)
                throw new Error(`For calling the "${exports.ComponentEventType.Error}" handler use the "callErrorHandler" method.`);
            const handler = this.options.handlers
                ? this.options.handlers[type]
                : null;
            if (handler) {
                try {
                    const event = new ComponentEvent(this.id, type, this.rootElement, this.getParentElement(), null);
                    event.data = data;
                    handler(event);
                }
                catch (error) {
                    this.callErrorHandler(error);
                }
            }
        }
        /**
         * Logging method.
         * @param message The message.
         * @param optionalParams Optional parameters.
         */
        log(message, ...optionalParams) {
            var _a, _b;
            const logMethod = (_b = (_a = this.window) === null || _a === void 0 ? void 0 : _a.console) === null || _b === void 0 ? void 0 : _b.log;
            if (logMethod)
                logMethod(message, optionalParams);
        }
        /**
         * Method invoked to initialize the component.
         * It should create the root element and any base dependencies.
         */
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
        /**
         * Method invoked to mount the actual content of the component.
         */
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
        /**
         * Method invoked to dispose of the component.
         */
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

    (function (CommunicationsEventKind) {
        CommunicationsEventKind["Mounted"] = "mounted";
        CommunicationsEventKind["BeforeUpdate"] = "beforeUpdate";
        CommunicationsEventKind["Updated"] = "updated";
        CommunicationsEventKind["BeforeDispose"] = "beforeDispose";
        CommunicationsEventKind["Disposed"] = "disposed";
        CommunicationsEventKind["Data"] = "data";
    })(exports.CommunicationsEventKind || (exports.CommunicationsEventKind = {}));
    /**
     * Event used to comunicate between content and container component.
     */
    class CommunicationsEvent {
        /**
         * Constructor.
         * @param kind The kind of event.
         */
        constructor(kind) {
            this.kind = kind;
            this.uuid = getUuidV4();
            this.timestamp = new Date().getTime();
            this.contentId = '';
        }
    }
    /**
     * The type of event dispatched by the child component.
     */
    CommunicationsEvent.CONTENT_EVENT_TYPE = 'content_event.communication.children.validide_micro_front_ends';
    /**
     * The type of event dispatched by the content.
     */
    CommunicationsEvent.CONTAINER_EVENT_TYPE = 'container_event.communication.children.validide_micro_front_ends';

    var _a, _b, _c, _d, _e, _f;
    /**
     * The communication handler methods.
     */
    class ContainerCommunicationHandlerMethods {
        constructor() {
            /**
             * Call the container to signal that the content finished mounting.
             */
            this[_a] = noop;
            /**
             * Call the container to signal an update is about to happen.
             */
            this[_b] = noop;
            /**
             * Call the container to signal an update finished.
             */
            this[_c] = noop;
            /**
             * Call the container to signal dispose started.
             */
            this[_d] = noop;
            /**
             * Call the container to signal the component has disposed(almost).
             */
            this[_e] = noop;
            /**
             * Call the container to signal the component has disposed(almost).
             */
            this[_f] = noop;
        }
    }
    _a = exports.CommunicationsEventKind.Mounted, _b = exports.CommunicationsEventKind.BeforeUpdate, _c = exports.CommunicationsEventKind.Updated, _d = exports.CommunicationsEventKind.BeforeDispose, _e = exports.CommunicationsEventKind.Disposed, _f = exports.CommunicationsEventKind.Data;
    /**
     * Handle the communications on the child component side.
     */
    class ContainerCommunicationHandler {
        /**
         * Constructor
         * @param communicationsManager A communications manager.
         * @param handlerMethods A collection of handler methods.
         */
        constructor(communicationsManager, handlerMethods) {
            this.communicationsManager = communicationsManager;
            this.handlerMethods = handlerMethods;
            this.communicationsManager.setEventReceivedCallback((e) => {
                this.handleEvent(e);
            });
            this.disposed = false;
        }
        /**
         * Core functionality for handling the incomming events.
         * @param e The event.
         */
        handleEventCore(e) {
            if (!this.handlerMethods)
                return;
            const method = this.handlerMethods[e.kind];
            if (!method)
                return;
            method(e.data);
        }
        /**
         * Handle the incomming communications event.
         * @param e The event
         */
        handleEvent(e) {
            this.handleEventCore(e);
        }
        /**
         * Method invoked to dispose of the handler.
         */
        dispose() {
            var _g;
            if (this.disposed)
                return;
            this.disposed = true;
            (_g = this.communicationsManager) === null || _g === void 0 ? void 0 : _g.dispose();
            this.communicationsManager = null;
            this.handlerMethods = null;
        }
        /**
         * Send a message.
         * @param event The message.
         */
        send(event) {
            var _g;
            (_g = this.communicationsManager) === null || _g === void 0 ? void 0 : _g.send(event);
        }
        /**
         * Send data.
         * @param data The data to send.
         */
        sendData(data) {
            var _g;
            const event = new CommunicationsEvent(exports.CommunicationsEventKind.Data);
            event.data = data;
            (_g = this.communicationsManager) === null || _g === void 0 ? void 0 : _g.send(event);
        }
        /**
         * Reuest that the content begins disposing.
         */
        requestContentDispose() {
            this.send(new CommunicationsEvent(exports.CommunicationsEventKind.BeforeDispose));
        }
    }

    /**
     * Content communications handler methods
     */
    class ContentCommunicationHandlerMethods {
        constructor() {
            /**
             * Method to dispose the content.
             */
            this.dispose = noop;
            /**
             * Method to dispose the content.
             */
            this.handleDataEvent = noop;
        }
    }
    /**
     * Handle the communications on the component content side.
     */
    class ContentCommunicationHandler {
        /**
         * Constructor
         * @param communicationsManager A comunications manager
         * @param methods The callback to dispose the content.
         */
        constructor(communicationsManager, methods) {
            this.communicationsManager = communicationsManager;
            this.methods = methods;
            this.communicationsManager.setEventReceivedCallback((e) => {
                this.handleEvent(e);
            });
            this.disposed = false;
        }
        /**
         * Core functionality for handling the incomming events.
         * @param e The event.
         */
        handleEventCore(e) {
            switch (e.kind) {
                case exports.CommunicationsEventKind.BeforeDispose:
                case exports.CommunicationsEventKind.Disposed:
                    if (this.methods) {
                        this.methods.dispose();
                    }
                    break;
                case exports.CommunicationsEventKind.Data:
                    if (this.methods) {
                        this.methods.handleDataEvent(e.data);
                    }
                    break;
                default:
                    throw new Error(`The "${e.kind}" event is not configured.`);
            }
        }
        /**
         * Handle the incomming communications event.
         * @param e The event
         */
        handleEvent(e) {
            this.handleEventCore(e);
        }
        /**
         * Core dispose function.
         * Any component derived should override this to add clean-up after itself.
         */
        disposeCore() { }
        /**
         * Send a message.
         * @param event The message.
         */
        send(event) {
            var _a;
            (_a = this.communicationsManager) === null || _a === void 0 ? void 0 : _a.send(event);
        }
        /**
         * Dispatch event to signal mounting finished.
         */
        sendData(data) {
            const evt = new CommunicationsEvent(exports.CommunicationsEventKind.Data);
            evt.data = data;
            this.send(evt);
        }
        /**
         * Dispatch event to signal mounting finished.
         */
        dispatchMounted() {
            this.send(new CommunicationsEvent(exports.CommunicationsEventKind.Mounted));
        }
        /**
         * Dispatch event to signal update is about to start.
         */
        dispatchBeforeUpdate() {
            this.send(new CommunicationsEvent(exports.CommunicationsEventKind.BeforeUpdate));
        }
        /**
         * Dispatch event to signal update finished.
         */
        dispatchUpdated() {
            this.send(new CommunicationsEvent(exports.CommunicationsEventKind.Updated));
        }
        /**
         * Dispatch event to disposing started.
         */
        dispatchBeforeDispose() {
            this.send(new CommunicationsEvent(exports.CommunicationsEventKind.BeforeDispose));
        }
        /**
         * Dispatch event to mount finished.
         */
        dispatchDisposed() {
            this.send(new CommunicationsEvent(exports.CommunicationsEventKind.Disposed));
        }
        /**
         * Method invoked to dispose of the handler.
         */
        dispose() {
            var _a;
            if (this.disposed)
                return;
            this.disposed = true;
            this.disposeCore();
            (_a = this.communicationsManager) === null || _a === void 0 ? void 0 : _a.dispose();
            this.communicationsManager = null;
            this.methods = null;
        }
    }

    /**
     * The data sent between the windows directly on the Message Event.
     */
    class CrossWindowCommunicationDataContract {
        /**
         * Constructor.
         * @param type Data type.
         * @param detail Data detail.
         */
        constructor(type, detail) {
            this.type = type;
            this.detail = detail;
        }
    }

    class CommunicationsManager {
        /**
         * Constructor.
         */
        constructor() {
            this.initialized = false;
            this.disposed = false;
        }
        /**
         * Initialize the manager.
         */
        initializeCore() { }
        /**
         * Clean any resources before the manager is disposed.
         */
        disposeCore() { }
        /**
         * Initialize the manager.
         */
        initialize() {
            if (this.initialized)
                return;
            this.initialized = true;
            this.initializeCore();
        }
        /**
         * Dispose of the manager.
         */
        dispose() {
            if (this.disposed)
                return;
            this.disposed = true;
            this.disposeCore();
        }
    }
    /**
     * Comunications manager base class.
     */
    class CommunicationsManagerOf extends CommunicationsManager {
        /**
         * Constructor
         * @param inboundEndpoint The endpoint for receiving messages.
         * @param inboundEventType The types of messages to receive.
         * @param outboundEndpoint The endpoint to sent mesages.
         * @param outboundEventType The messages to send.
         */
        constructor(inboundEndpoint, inboundEventType, outboundEndpoint, outboundEventType) {
            super();
            this.inboundEndpoint = inboundEndpoint;
            this.inboundEventType = inboundEventType;
            this.outboundEndpoint = outboundEndpoint;
            this.outboundEventType = outboundEventType;
            this.onEventReceived = null;
            this.eventHandler = (e) => { this.handleEvent(e); };
        }
        /**
         * Handle the received events.
         * @param e The recevied event.
         */
        handleEvent(e) {
            if (!this.onEventReceived)
                return;
            const evt = this.readEvent(e);
            if (evt) {
                this.onEventReceived(evt);
            }
        }
        /**
         * @inheritdoc
         */
        initializeCore() {
            if (this.inboundEndpoint && this.eventHandler) {
                this.startReceiving(this.inboundEndpoint, this.eventHandler);
            }
            super.initializeCore();
        }
        /**
         * @inheritdoc
         */
        disposeCore() {
            if (this.inboundEndpoint && this.eventHandler) {
                this.stopReceiving(this.inboundEndpoint, this.eventHandler);
            }
            this.eventHandler = null;
            this.onEventReceived = null;
            this.inboundEndpoint = null;
            super.disposeCore();
        }
        /**
         * @inheritdoc
         */
        send(event) {
            if (this.outboundEndpoint) {
                this.sendEvent(this.outboundEndpoint, event);
            }
        }
        /**
         * @inheritdoc
         */
        setEventReceivedCallback(callback) {
            this.onEventReceived = callback;
        }
    }

    /**
     * @inheritdoc
     */
    class CrossWindowCommunicationsManager extends CommunicationsManagerOf {
        /**
         * Constructor
         * @param inboundEndpoint The endpoint for receiving messages.
         * @param inboundEventType The types of messages to receive.
         * @param outboundEndpoint The endpoint to sent mesages.
         * @param outboundEventType The messages to send.
         * @param origin The origin to comunicate with.
         */
        constructor(inboundEndpoint, inboundEventType, outboundEndpoint, outboundEventType, origin) {
            super(inboundEndpoint, inboundEventType, outboundEndpoint, outboundEventType);
            this.origin = origin;
        }
        /**
         * @inheritdoc
         */
        readEvent(e) {
            const messageEvent = e;
            if (!messageEvent || messageEvent.origin !== this.origin)
                return null;
            const data = messageEvent.data;
            if (!data || data.type !== this.inboundEventType)
                return null;
            return data.detail ? data.detail : null;
        }
        /**
         * @inheritdoc
         */
        startReceiving(inboundEndpoint, handler) {
            inboundEndpoint.addEventListener('message', handler);
        }
        /**
         * @inheritdoc
         */
        stopReceiving(inboundEndpoint, handler) {
            inboundEndpoint.removeEventListener('message', handler);
        }
        /**
         * @inheritdoc
         */
        sendEvent(outboundEndpoint, event) {
            const data = new CrossWindowCommunicationDataContract(this.outboundEventType, event);
            outboundEndpoint.postMessage(data, this.origin);
        }
    }

    function customEventPolyfill(document, typeArg, eventInitDict) {
        const params = eventInitDict || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(typeArg, params.bubbles || false, params.cancelable || false, params.detail);
        return evt;
    }
    function createCustomEvent(document, typeArg, eventInitDict) {
        const win = document === null || document === void 0 ? void 0 : document.defaultView;
        if (!win)
            throw new Error('Document does not have a defualt view.');
        if (typeof win.CustomEvent !== 'function') {
            return new customEventPolyfill(document, typeArg, eventInitDict);
        }
        return new win.CustomEvent(typeArg, eventInitDict);
    }

    /**
     * @inheritdoc
     */
    class HTMLElementCommunicationsManager extends CommunicationsManagerOf {
        /**
         * @inheritdoc
         */
        constructor(inboundEndpoint, inboundEventType, outboundEndpoint, outboundEventType) {
            super(inboundEndpoint, inboundEventType, outboundEndpoint, outboundEventType);
        }
        /**
         * @inheritdoc
         */
        readEvent(e) {
            const customEvent = e;
            if (!customEvent || customEvent.type !== this.inboundEventType)
                return null;
            return customEvent.detail instanceof CommunicationsEvent
                ? customEvent.detail
                : null;
        }
        /**
         * @inheritdoc
         */
        startReceiving(inboundEndpoint, handler) {
            inboundEndpoint.addEventListener(this.inboundEventType, handler);
        }
        /**
         * @inheritdoc
         */
        stopReceiving(inboundEndpoint, handler) {
            inboundEndpoint.removeEventListener(this.inboundEventType, handler);
        }
        /**
         * @inheritdoc
         */
        sendEvent(outboundEndpoint, event) {
            if (!outboundEndpoint.ownerDocument)
                return;
            const evt = createCustomEvent(outboundEndpoint.ownerDocument, this.outboundEventType, { detail: event });
            outboundEndpoint.dispatchEvent(evt);
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
    /**
     * Child component base class.
     */
    class ChildComponent extends Component {
        /**
         * Constructor.
         * @param window The window reference.
         * @param options The child options.
         * @param rootFacade The facade to the root component.
         */
        constructor(window, options, rootFacade) {
            super(window, options);
            this.rootFacade = rootFacade;
            this.communicationHandler = null;
            this.contentDisposePromise = null;
            this.contentDisposePromiseResolver = null;
        }
        /**
         * Get the comunication handler.
         */
        getCommunicationHandler() {
            const methods = new ContainerCommunicationHandlerMethods();
            methods.mounted = () => this.callHandler(exports.ComponentEventType.Mounted);
            methods.beforeUpdate = () => this.callHandler(exports.ComponentEventType.BeforeUpdate);
            methods.updated = () => this.callHandler(exports.ComponentEventType.Updated);
            methods.data = (data) => this.callHandler(exports.ComponentEventType.Data, data);
            methods.beforeDispose = () => this.contentBeginDisposed();
            methods.disposed = () => this.contentDisposed();
            return this.getCommunicationHandlerCore(methods);
        }
        /**
         * Get the child component options.
         */
        getOptions() {
            return super.getOptions();
        }
        /**
         * Handler for the signal that the component started to dispose.
         */
        contentBeginDisposed() {
            if (this.contentDisposePromise !== null)
                return; // Dispose has already started.
            this.setContentDisposePromise();
            // Inform parent the content is beeing disposed.
            this.rootFacade.signalDisposed(this);
        }
        /**
         * Signal the content that it will be disposed.
         */
        startDisposingContent() {
            if (this.contentDisposePromise !== null)
                return; // Dispose has already started.
            this.setContentDisposePromise();
            // This should trigger the child component dispose.
            this.communicationHandler.requestContentDispose();
        }
        /**
         * Set the promise that is used fof the disposing of the component.
         */
        setContentDisposePromise() {
            this.contentDisposePromise = Promise
                .race([
                new Promise((resolver, rejecter) => {
                    this.contentDisposePromiseResolver = resolver;
                }),
                new Promise((resolveTimeout, rejectTimeout) => {
                    this
                        .getWindow()
                        .setTimeout(() => rejectTimeout(new Error(`Child dispose timeout.`)), this.getOptions().contentDisposeTimeout);
                })
            ])
                .catch((err) => {
                this.callErrorHandler(err);
            });
        }
        /**
         * Handler for the signal that the content has finished disposing.
         */
        contentDisposed() {
            if (this.contentDisposePromiseResolver === null) {
                // For some reason we got the disposed call without getting the 'beginDispose' call.
                this.contentDisposePromise = Promise.resolve();
                this.rootFacade.signalDisposed(this);
            }
            else {
                this.contentDisposePromiseResolver();
            }
        }
        /**
         * @@inheritdoc
         */
        mountCore() {
            if (!this.communicationHandler) {
                this.communicationHandler = this.getCommunicationHandler();
            }
            return super.mountCore();
        }
        /**
         * @@inheritdoc
         */
        disposeCore() {
            const _super = Object.create(null, {
                disposeCore: { get: () => super.disposeCore }
            });
            return __awaiter$1(this, void 0, void 0, function* () {
                this.startDisposingContent();
                yield this.contentDisposePromise;
                this.communicationHandler.dispose();
                this.communicationHandler = null;
                this.contentDisposePromiseResolver = null;
                this.contentDisposePromise = null;
                yield _super.disposeCore.call(this);
            });
        }
        /**
         * Send data.
         * @param data The data to send.
         */
        sendData(data) {
            var _a;
            (_a = this.communicationHandler) === null || _a === void 0 ? void 0 : _a.sendData(data);
        }
    }

    /**
     * The type of child component.
     */
    (function (ChildComponentType) {
        /**
         * In window component(JavaScript or WebComponent Custom Element)
         */
        ChildComponentType["InWindow"] = "inWindow";
        /**
         * Cross window component(loaded in an embedable form - Iframe)
         */
        ChildComponentType["CrossWindow"] = "crossWindow";
    })(exports.ChildComponentType || (exports.ChildComponentType = {}));

    /**
     * @inheritdoc
     */
    class InWindowContainerCommunicationHandler extends ContainerCommunicationHandler {
        /**
       * @inheritdoc
       */
        constructor(communicationsManager, wrapperMethods) {
            super(communicationsManager, wrapperMethods);
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
    /**
     * In Window Child Component.
     */
    class InWindowChildComponent extends ChildComponent {
        /**
         * Constructor.
         * @param window The window reference.
         * @param options The child component options.
         * @param rootFacade The facade to the root component.
         */
        constructor(window, options, rootFacade) {
            super(window, options, rootFacade);
        }
        /**
         * @inheritdoc
         */
        getCommunicationHandlerCore(methods) {
            const endpoint = this.rootElement;
            const manager = new HTMLElementCommunicationsManager(endpoint, CommunicationsEvent.CONTENT_EVENT_TYPE, endpoint, CommunicationsEvent.CONTAINER_EVENT_TYPE);
            manager.initialize();
            return new InWindowContainerCommunicationHandler(manager, methods);
        }
        /**
         * Get the InWindowChildComponentOptions
         */
        getOptions() {
            return super.getOptions();
        }
        /**
         * @inheritdoc
         */
        mountCore() {
            const _super = Object.create(null, {
                mountCore: { get: () => super.mountCore }
            });
            return __awaiter$2(this, void 0, void 0, function* () {
                const injectionFunction = this.getOptions().inject;
                if (!injectionFunction) {
                    throw new Error('Inject method not defined!');
                }
                injectionFunction(this.rootElement);
                yield _super.mountCore.call(this);
            });
        }
    }

    /**
     * @inheritdoc
     */
    class CrossWindowContainerCommunicationHandler extends ContainerCommunicationHandler {
        /**
         * Constructor.
         * @param communicationsManager A communications manager.
         * @param embedId The Id of the embeded element.
         * @param containerMethods The methods to communicate with the container.
         */
        constructor(communicationsManager, embedId, containerMethods) {
            super(communicationsManager, containerMethods);
            this.embedId = embedId;
        }
        /**
         * @inheritdoc
         */
        handleEventCore(e) {
            if (!this.embedId)
                return;
            if (!e.contentId && e.kind === exports.CommunicationsEventKind.Mounted) {
                this.attemptHandShake(e);
                return;
            }
            if (this.embedId !== e.contentId)
                return;
            super.handleEventCore(e);
        }
        /**
         * Attempt a andshake with the content.
         */
        attemptHandShake(e) {
            const hash = getHashCode(this.embedId).toString(10);
            const response = new CommunicationsEvent(exports.CommunicationsEventKind.Mounted);
            // We got a message back so if the data matches the hash we sent send the id
            if (e.data && e.data === hash) {
                response.contentId = this.embedId;
            }
            else {
                response.data = hash;
            }
            this.send(response);
        }
    }

    var __awaiter$3 = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    /**
     * Cross Window Child Component.
     */
    class CrossWindowChildComponent extends ChildComponent {
        /**
         * Constructor.
         * @param window The window refrence.
         * @param options The child options.
         * @param rootFacade he root component facade.
         */
        constructor(window, options, rootFacade) {
            super(window, options, rootFacade);
            this.embededId = '';
            this.embededLoadResolver = null;
            this.embededErrorRejecter = null;
            this.embededLoadPromise = new Promise((resolve, reject) => {
                this.embededLoadResolver = resolve;
                this.embededErrorRejecter = reject;
            });
            this.embededLoadHandlerRef = this.embededLoadHandler.bind(this);
            this.embededErrorHandlerRef = this.embededErrorHandler.bind(this);
        }
        /**
         * @inheritdoc
         */
        disposeCore() {
            const embed = this.embededId
                ? this.rootElement.querySelector(`#${this.embededId}`)
                : null;
            if (embed) {
                embed.removeEventListener('load', this.embededLoadHandlerRef);
                embed.removeEventListener('error', this.embededErrorHandlerRef);
                // Do not remove the embeded element now as we still need it to comunicate with the content.
                // The parent "rootElement" will be removed latter anyhow.
                // (<HTMLElement>embed.parentElement).removeChild(embed);
            }
            this.embededLoadHandlerRef = null;
            this.embededErrorHandlerRef = null;
            this.embededLoadResolver = null;
            this.embededErrorRejecter = null;
            this.embededLoadPromise = null;
            return super.disposeCore();
        }
        /**
         * Get the CrossWindowChildComponentOptions
         */
        getOptions() {
            return super.getOptions();
        }
        /**
         * @inheritdoc
         */
        mountCore() {
            const _super = Object.create(null, {
                mountCore: { get: () => super.mountCore }
            });
            return __awaiter$3(this, void 0, void 0, function* () {
                const createEmbedElementFn = this.getOptions().createEmbedElement;
                let embed = null;
                if (createEmbedElementFn) {
                    embed = createEmbedElementFn(this.rootElement);
                }
                else {
                    embed = this.createEmbedElement();
                }
                if (!embed)
                    throw new Error('Failed to create embed element!');
                const embedId = generateUniqueId(this.getDocument(), 'ufe-cross-');
                embed.id = embedId;
                this.embededId = embedId;
                embed.addEventListener('load', this.embededLoadHandlerRef);
                embed.addEventListener('error', this.embededErrorHandlerRef);
                this.rootElement.appendChild(embed);
                yield (this.embededLoadPromise);
                return yield _super.mountCore.call(this);
            });
        }
        /**
         *
         * @param methods @inheritdoc
         */
        getCommunicationHandlerCore(methods) {
            const document = this.getDocument();
            const manager = new CrossWindowCommunicationsManager((document).defaultView, CommunicationsEvent.CONTENT_EVENT_TYPE, this.outboundEndpointAccesor(), CommunicationsEvent.CONTAINER_EVENT_TYPE, getUrlOrigin(document, this.getOptions().url));
            manager.initialize();
            return new CrossWindowContainerCommunicationHandler(manager, this.embededId, methods);
        }
        /**
         * Handle the loading of the embeded element.
         * @param e The load event.
         */
        embededLoadHandler(e) {
            this.embededLoadResolver();
        }
        /**
         * Handle the errir of the embeded element.
         * @param e The error event.
         */
        embededErrorHandler(e) {
            this.embededErrorRejecter(new Error(`Failed to load embeded element.\nError details:\n${JSON.stringify(e)}`));
        }
        /**
         * Create the embeded element.
         */
        createEmbedElement() {
            const embed = this.getDocument().createElement('iframe');
            const opt = this.getOptions();
            if (opt.embededAttributes) {
                const keys = Object.keys(opt.embededAttributes);
                for (let index = 0; index < keys.length; index++) {
                    const key = keys[index];
                    embed.setAttribute(key, opt.embededAttributes[key]);
                }
            }
            embed.setAttribute('src', opt.url);
            return embed;
        }
        /**
         * Access the outbound comunication endpoint.
         */
        outboundEndpointAccesor() {
            const embed = this.embededId
                ? this.rootElement.querySelector(`#${this.embededId}`)
                : null;
            if (!embed)
                throw new Error(`No iframe with "${this.embededId}" id found.`);
            if (!embed.contentWindow)
                throw new Error(`The iframe with "${this.embededId}" id does not have a "contentWindow"(${embed.contentWindow}).`);
            return embed.contentWindow;
        }
    }

    /**
     * Configuration object for the event handlers.
     */
    class ComponentEventHandlers {
    }
    exports.ComponentEventType.BeforeCreate, exports.ComponentEventType.Created, exports.ComponentEventType.BeforeMount, exports.ComponentEventType.Mounted, exports.ComponentEventType.BeforeUpdate, exports.ComponentEventType.Updated, exports.ComponentEventType.BeforeDestroy, exports.ComponentEventType.Destroyed, exports.ComponentEventType.Error, exports.ComponentEventType.Data;
    /**
     * Compoent configuration options.
     */
    class ComponentOptions {
        constructor() {
            this.parent = 'body';
            this.tag = 'div';
            this.handlers = new ComponentEventHandlers();
            this.resources = [];
        }
    }

    /**
     * Child component options.
     */
    class ChildComponentOptions extends ComponentOptions {
        constructor() {
            super();
            this.type = exports.ChildComponentType.InWindow;
            /**
             * The the interval to wait for the component before triggering an error and the 'disposed' event.
             */
            this.contentDisposeTimeout = 3000;
        }
    }

    /**
     * Cross Window Child Component Options.
     */
    class CrossWindowChildComponentOptions extends ChildComponentOptions {
        /**
         * Constructor.
         */
        constructor() {
            super();
            this.url = 'about:blank';
            this.type = exports.ChildComponentType.CrossWindow;
        }
    }

    /**
     * @inheritdoc
     */
    class CrossWindowContentCommunicationHandler extends ContentCommunicationHandler {
        /**
         * Constructor.
         * @param communicationsManager A communications manager.
         * @param methods The callback to dispose the content.
         */
        constructor(communicationsManager, methods) {
            super(communicationsManager, methods);
            this.iframeId = '';
            this.messageQueue = [];
        }
        /**
         * @inheritdoc
         */
        disposeCore() {
            this.messageQueue = [];
            super.disposeCore();
        }
        /**
         * @inheritdoc
         */
        handleEventCore(e) {
            if (!this.iframeId) {
                this.attemptHandShake(e);
                return;
            }
            super.handleEventCore(e);
        }
        /**
         * @inheritdoc
         */
        send(message) {
            if (this.iframeId) {
                message.contentId = this.iframeId;
            }
            else {
                if (message.kind !== exports.CommunicationsEventKind.Mounted) {
                    // In case we do not have an iframeId push all events to queue,
                    // only Mounted are allowed to establish handshake.
                    this.messageQueue.push(message);
                    return;
                }
            }
            super.send(message);
        }
        /**
         * Attempt a handshake with the container.
         * @param e The communication event.
         */
        attemptHandShake(e) {
            if (e.contentId) {
                // Phase 2 of the handshake - we got the id.
                this.iframeId = e.contentId;
                // Send it again to notify parent.
                const response = new CommunicationsEvent(exports.CommunicationsEventKind.Mounted);
                response.contentId = this.iframeId;
                this.send(response);
                // Send the previously queued messages.
                this.flushMessages();
            }
            else {
                // Phase 1 of the handshake - we got the hash so send it back.
                const response = new CommunicationsEvent(exports.CommunicationsEventKind.Mounted);
                response.contentId = this.iframeId;
                response.data = e.data;
                this.send(response);
            }
        }
        /**
         * Flush all the messages that were enqueues before the handhake.
         */
        flushMessages() {
            for (let index = 0; index < this.messageQueue.length; index++) {
                const msg = this.messageQueue[index];
                msg.contentId = this.iframeId;
                this.send(msg);
            }
        }
    }

    /**
     * Factory to create child components.
     */
    class ChildComponentFactory {
        /**
         * Create a child component.
         * @param window The window reference.
         * @param options The child component options.
         * @param rootFacade The facade for the root component.
         */
        createComponent(window, options, rootFacade) {
            switch (options.type) {
                case exports.ChildComponentType.InWindow:
                    return new InWindowChildComponent(window, options, rootFacade);
                case exports.ChildComponentType.CrossWindow:
                    return new CrossWindowChildComponent(window, options, rootFacade);
                default:
                    throw new Error(`The "${options.type}" is not configured.`);
            }
        }
    }

    /**
     * In Window Child Component Options.
     */
    class InWindowChildComponentOptions extends ChildComponentOptions {
        /**
         * Constructor.
         */
        constructor() {
            super();
        }
    }

    /**
     * @inheritdoc
     */
    class InWindowContentCommunicationHandler extends ContentCommunicationHandler {
        /**
         * Constructor.
         * @param el The element to use for sending and receiving messages.
         * @param methods The callback to dispose the content.
         */
        constructor(communicationsManager, methods) {
            super(communicationsManager, methods);
        }
    }

    /**
     * Configuration for retrieving a resource.
     */
    class ResourceConfiguration {
        constructor() {
            this.url = '';
            this.isScript = true;
            this.skip = () => { return false; };
        }
    }

    /**
     * Facade to interface with the the root component.
     */
    class RootComponentFacade {
        /**
         * Constructor.
         * @param signalDisposed The function to invoke to signal that the child was disposed.
         */
        constructor(signalDisposed) {
            this.signalDisposed = signalDisposed;
        }
    }

    var __awaiter$4 = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    /**
     * The root component to host the rest of the components.
     * There is not limitation right no but ideally there should only be one of these on a page.
     */
    class RootComponent extends Component {
        constructor(window, options) {
            super(window, options);
            this.children = {};
        }
        /**
         * Schedule the disposing of the child on exiting the function.
         * The dispose method is async but we do not want to wait for that.
         * @param child The child that was disposed.
         */
        scheduleDisposeChild(child) {
            // Schedule this later
            this.getWindow().setTimeout(() => {
                this.disposeChildByRef(child);
            }, 0);
        }
        /**
         * Dispose a child using it's reference.
         * @param child
         */
        disposeChildByRef(child) {
            return this.disposeChild(child.id);
        }
        /**
         * Dispose a child by using it's id.
         * @param childId The child identifyer.
         */
        disposeChild(childId) {
            return __awaiter$4(this, void 0, void 0, function* () {
                const child = this.getChild(childId);
                if (!child)
                    return Promise.resolve();
                yield child.dispose();
                this.children[childId] = null;
            });
        }
        /**
         * @@inheritdoc
         */
        mountCore() {
            this.callHandler(exports.ComponentEventType.Mounted);
            return super.mountCore();
        }
        /**
         * Add a child component.
         * @param options Child component options.
         */
        addChild(options) {
            return __awaiter$4(this, void 0, void 0, function* () {
                if (!this.isInitialized)
                    throw new Error('Wait for the component to initilize before starting to add children.');
                if (!this.isMounted)
                    throw new Error('Wait for the component to mount before starting to add children.');
                const child = this.options.childFactory.createComponent(this.getWindow(), options, new RootComponentFacade(this.scheduleDisposeChild.bind(this)));
                const id = (yield child.initialize()).id;
                this.children[id] = child;
                yield child.mount();
                return id;
            });
        }
        /**
         * Get the child with the given identifier.
         * @param id The child identifier.
         */
        getChild(id) {
            return id ? (this.children[id] || null) : null;
        }
        /**
         * Remove a child component.
         * @param id The child component identifyer.
         */
        removeChild(id) {
            return this.disposeChild(id);
        }
    }

    /**
     * Options for the root component.
     */
    class RootComponentOptions extends ComponentOptions {
        constructor() {
            super();
            this.tag = 'script';
            this.childFactory = new ChildComponentFactory();
        }
    }

    exports.ChildComponent = ChildComponent;
    exports.ChildComponentFactory = ChildComponentFactory;
    exports.ChildComponentOptions = ChildComponentOptions;
    exports.CommunicationsEvent = CommunicationsEvent;
    exports.CommunicationsManager = CommunicationsManager;
    exports.CommunicationsManagerOf = CommunicationsManagerOf;
    exports.Component = Component;
    exports.ComponentEvent = ComponentEvent;
    exports.ComponentEventHandlers = ComponentEventHandlers;
    exports.ComponentOptions = ComponentOptions;
    exports.ContainerCommunicationHandler = ContainerCommunicationHandler;
    exports.ContainerCommunicationHandlerMethods = ContainerCommunicationHandlerMethods;
    exports.ContentCommunicationHandler = ContentCommunicationHandler;
    exports.ContentCommunicationHandlerMethods = ContentCommunicationHandlerMethods;
    exports.CrossWindowChildComponent = CrossWindowChildComponent;
    exports.CrossWindowChildComponentOptions = CrossWindowChildComponentOptions;
    exports.CrossWindowCommunicationDataContract = CrossWindowCommunicationDataContract;
    exports.CrossWindowCommunicationsManager = CrossWindowCommunicationsManager;
    exports.CrossWindowContainerCommunicationHandler = CrossWindowContainerCommunicationHandler;
    exports.CrossWindowContentCommunicationHandler = CrossWindowContentCommunicationHandler;
    exports.HTMLElementCommunicationsManager = HTMLElementCommunicationsManager;
    exports.InWindowChildComponent = InWindowChildComponent;
    exports.InWindowChildComponentOptions = InWindowChildComponentOptions;
    exports.InWindowContainerCommunicationHandler = InWindowContainerCommunicationHandler;
    exports.InWindowContentCommunicationHandler = InWindowContentCommunicationHandler;
    exports.ResourceConfiguration = ResourceConfiguration;
    exports.RootComponent = RootComponent;
    exports.RootComponentFacade = RootComponentFacade;
    exports.RootComponentOptions = RootComponentOptions;
    exports.generateUniqueId = generateUniqueId;
    exports.getHashCode = getHashCode;
    exports.getRandomString = getRandomString;
    exports.getUrlFullPath = getUrlFullPath;
    exports.getUrlOrigin = getUrlOrigin;
    exports.getUuidV4 = getUuidV4;
    exports.loadResource = loadResource;
    exports.noop = noop;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
