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
                        // DO NOT LOAD ALL AT ONCE AS YOU MIHGT HAVE DEPENDENCIES
                        // AND A RESOURCE MIGHT LOAD BEFORE IT'S DEPENDENCY
                        yield loadResource(document, resource.url, resource.isScript, resource.skip, resource.attributes);
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

    (function (CommunicationEventKind) {
        CommunicationEventKind["Mounted"] = "mounted";
        CommunicationEventKind["BeforeUpdate"] = "beforeUpdate";
        CommunicationEventKind["Updated"] = "updated";
        CommunicationEventKind["BeforeDispose"] = "beforeDispose";
        CommunicationEventKind["Disposed"] = "disposed";
    })(exports.CommunicationEventKind || (exports.CommunicationEventKind = {}));
    class CommunicationEvent {
        constructor(kind) {
            this.kind = kind;
            this.uuid = getUuidV4();
            this.timestamp = new Date().getTime();
            this.contentId = '';
        }
    }
    CommunicationEvent.CONTENT_EVENT_TYPE = 'content_event.communication.children.validide_micro_front_ends';
    CommunicationEvent.CONTAINER_EVENT_TYPE = 'container_event.communication.children.validide_micro_front_ends';

    class CommunicationHandler {
        constructor(messageType, inboundEndpoint, manager) {
            this.messageType = messageType;
            this.inboundEndpoint = inboundEndpoint;
            this.manager = manager;
            this.handlerAction = this.handleEvent.bind(this);
            this.disposed = false;
            this.attachCommandHandler();
        }
        handleEvent(e) {
            if (!this.manager)
                return;
            const evt = this.manager.readEvent(e);
            if (!evt)
                return;
            this.handleEventCore(evt);
        }
        attachCommandHandler() {
            if (!this.inboundEndpoint || !this.handlerAction)
                return;
            this.inboundEndpoint.addEventListener(this.messageType, this.handlerAction);
        }
        detachCommandHandler() {
            if (!this.inboundEndpoint || !this.handlerAction)
                return;
            this.inboundEndpoint.removeEventListener(this.messageType, this.handlerAction);
        }
        dispatchEvent(information) {
            if (!this.manager)
                return;
            this.manager.dispatchEvent(information);
        }
        dispose() {
            if (this.disposed)
                return;
            this.disposed = true;
            if (this.handlerAction) {
                this.detachCommandHandler();
            }
            this.handlerAction = null;
            if (this.manager) {
                this.manager.dispose();
            }
            this.manager = null;
            this.disposeCore();
        }
    }

    class ContainerCommunicationHandlerMethods {
        constructor() {
            this.callMounterHandler = noop;
            this.callBeforeUpdateHandler = noop;
            this.callUpdatedHandler = noop;
            this.contentBeginDisposed = noop;
            this.contentDisposed = noop;
        }
    }
    class ContainerCommunicationHandler extends CommunicationHandler {
        constructor(messageType, inboundEndpoint, manager, wrapperMethods) {
            super(messageType, inboundEndpoint, manager);
            this.wrapperMethods = wrapperMethods;
        }
        handleEventCore(e) {
            if (!this.wrapperMethods)
                return;
            switch (e.kind) {
                case exports.CommunicationEventKind.Mounted:
                    this.wrapperMethods.callMounterHandler();
                    break;
                case exports.CommunicationEventKind.BeforeUpdate:
                    this.wrapperMethods.callBeforeUpdateHandler();
                    break;
                case exports.CommunicationEventKind.Updated:
                    this.wrapperMethods.callUpdatedHandler();
                    break;
                case exports.CommunicationEventKind.BeforeDispose:
                    this.wrapperMethods.contentBeginDisposed();
                    break;
                case exports.CommunicationEventKind.Disposed:
                    this.wrapperMethods.contentDisposed();
                    break;
                default:
                    throw new Error(`The "${e.kind}" event is not configured.`);
            }
        }
        disposeCore() {
            this.wrapperMethods = null;
        }
        requestContentDispose() {
            this.dispatchEvent(new CommunicationEvent(exports.CommunicationEventKind.BeforeDispose));
        }
    }

    class ContentCommunicationHandler extends CommunicationHandler {
        constructor(messageType, inboundEndpoint, manager, disposeCommandCallback) {
            super(messageType, inboundEndpoint, manager);
            this.disposeCommandCallback = disposeCommandCallback;
        }
        handleEventCore(e) {
            switch (e.kind) {
                case exports.CommunicationEventKind.BeforeDispose:
                case exports.CommunicationEventKind.Disposed:
                    if (this.disposeCommandCallback) {
                        this.disposeCommandCallback();
                    }
                    break;
                default:
                    throw new Error(`The "${e.kind}" event is not configured.`);
            }
        }
        dispatchMounted() {
            this.dispatchEvent(new CommunicationEvent(exports.CommunicationEventKind.Mounted));
        }
        dispatchBeforeUpdate() {
            this.dispatchEvent(new CommunicationEvent(exports.CommunicationEventKind.BeforeUpdate));
        }
        dispatchUpdated() {
            this.dispatchEvent(new CommunicationEvent(exports.CommunicationEventKind.Updated));
        }
        dispatchBeforeDispose() {
            this.dispatchEvent(new CommunicationEvent(exports.CommunicationEventKind.BeforeDispose));
        }
        dispatchDisposed() {
            this.dispatchEvent(new CommunicationEvent(exports.CommunicationEventKind.Disposed));
        }
        disposeCore() {
            this.disposeCommandCallback = null;
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
            this.communicationHandler = null;
            this.contentDisposePromise = null;
            this.contentDisposePromiseResolver = null;
        }
        getCommunicationHandler() {
            const methods = new ContainerCommunicationHandlerMethods();
            methods.callMounterHandler = () => this.callHandler(exports.ComponentEventType.Mounted);
            methods.callBeforeUpdateHandler = () => this.callHandler(exports.ComponentEventType.BeforeUpdate);
            methods.callUpdatedHandler = () => this.callHandler(exports.ComponentEventType.Updated);
            methods.contentBeginDisposed = () => this.contentBeginDisposed();
            methods.contentDisposed = () => this.contentDisposed();
            return this.getCommunicationHandlerCore(methods);
        }
        getOptions() {
            return super.getOptions();
        }
        contentBeginDisposed() {
            if (this.contentDisposePromise !== null)
                return; // Dispose has already started.
            this.setContentDisposePromise();
            // Inform parent the content is beeing disposed.
            this.rootFacade.signalDisposed(this);
        }
        startDisposingContent() {
            if (this.contentDisposePromise !== null)
                return; // Dispose has already started.
            this.setContentDisposePromise();
            // This should trigger the child component dispose.
            this.communicationHandler.requestContentDispose();
        }
        setContentDisposePromise() {
            if (this.contentDisposePromise !== null)
                return;
            this.contentDisposePromise = Promise
                .race([
                new Promise((resolver, rejecter) => {
                    this.contentDisposePromiseResolver = resolver;
                }),
                new Promise((resolveTimeout, rejectTimeout) => {
                    this
                        .getWindow()
                        .setTimeout(() => rejectTimeout(`Child dispose timeout.`), this.getOptions().contentDisposeTimeout);
                })
            ])
                .catch((err) => {
                this.callErrorHandler(err);
            });
        }
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
        mountCore() {
            if (!this.communicationHandler) {
                this.communicationHandler = this.getCommunicationHandler();
            }
            return super.mountCore();
        }
        disposeCore() {
            const _super = Object.create(null, {
                disposeCore: { get: () => super.disposeCore }
            });
            return __awaiter$1(this, void 0, void 0, function* () {
                this.startDisposingContent();
                yield this.contentDisposePromise;
                if (this.communicationHandler) {
                    this.communicationHandler.dispose();
                    this.communicationHandler = null;
                }
                this.contentDisposePromiseResolver = null;
                this.contentDisposePromise = null;
                yield _super.disposeCore.call(this);
            });
        }
    }

    (function (ChildComponentType) {
        ChildComponentType["InWindow"] = "inWindow";
        ChildComponentType["CrossWindow"] = "crossWindow";
    })(exports.ChildComponentType || (exports.ChildComponentType = {}));

    class InWindowCommunicationManager {
        constructor(el, inboundEventType, outboundEventType) {
            this.el = el;
            this.inboundEventType = inboundEventType;
            this.outboundEventType = outboundEventType;
        }
        readEvent(e) {
            if (!e || e.type !== this.inboundEventType)
                return null;
            return e.detail;
        }
        dispatchEvent(detail) {
            if (!this.el)
                return;
            this.el.dispatchEvent(new CustomEvent(this.outboundEventType, { detail: detail }));
        }
        dispose() {
            this.el = null;
        }
    }

    class InWindowContainerCommunicationHandler extends ContainerCommunicationHandler {
        constructor(el, wrapperMethods) {
            super(CommunicationEvent.CONTENT_EVENT_TYPE, el, new InWindowCommunicationManager(el, CommunicationEvent.CONTENT_EVENT_TYPE, CommunicationEvent.CONTAINER_EVENT_TYPE), wrapperMethods);
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
    class InWindowChildComponent extends ChildComponent {
        constructor(window, options, rootFacade) {
            super(window, options, rootFacade);
        }
        getCommunicationHandlerCore(methods) {
            return new InWindowContainerCommunicationHandler(this.rootElement, methods);
        }
        getOptions() {
            return super.getOptions();
        }
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

    class CrossWindowCommunicationManager {
        constructor(outboundEndpoint, origin, inboundEventType, outboundEventType) {
            this.outboundEndpoint = outboundEndpoint;
            this.origin = origin;
            this.inboundEventType = inboundEventType;
            this.outboundEventType = outboundEventType;
        }
        readEvent(e) {
            if (!e)
                return null;
            const messageEvent = e;
            if (!messageEvent || messageEvent.origin !== this.origin)
                return null;
            const data = messageEvent.data;
            if (!data || data.type !== this.inboundEventType)
                return null;
            return data.detail;
        }
        dispatchEvent(detail) {
            if (!this.outboundEndpoint)
                return;
            const event = {
                type: this.outboundEventType,
                detail: detail
            };
            this.outboundEndpoint.postMessage(event, this.origin);
        }
        dispose() {
            this.outboundEndpoint = null;
        }
    }

    class CrossWindowContainerCommunicationHandler extends ContainerCommunicationHandler {
        constructor(inboundEndpoint, outboundEndpoint, iframeId, origin, wrapperMethods) {
            super('message', inboundEndpoint, new CrossWindowCommunicationManager(outboundEndpoint, origin, CommunicationEvent.CONTENT_EVENT_TYPE, CommunicationEvent.CONTAINER_EVENT_TYPE), wrapperMethods);
            this.iframeId = iframeId;
        }
        handleEventCore(e) {
            if (!this.iframeId)
                return;
            if (!e.contentId && e.kind === exports.CommunicationEventKind.Mounted) {
                this.attemptHandShake(e);
                return;
            }
            if (this.iframeId !== e.contentId)
                return;
            super.handleEventCore(e);
        }
        attemptHandShake(e) {
            const hash = getHashCode(this.iframeId).toString(10);
            const response = new CommunicationEvent(exports.CommunicationEventKind.Mounted);
            // We got a message back so if the data matches the hash we sent send the id
            if (e.data && e.data === hash) {
                response.contentId = this.iframeId;
            }
            else {
                response.data = hash;
            }
            this.dispatchEvent(response);
        }
    }

    class CrossWindowChildComponent extends ChildComponent {
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
        disposeCore() {
            if (this.embededId) {
                const embed = this.rootElement.querySelector(`#${this.embededId}`);
                if (embed) {
                    if (this.embededLoadHandlerRef) {
                        embed.removeEventListener('load', this.embededLoadHandlerRef);
                    }
                    if (this.embededErrorHandlerRef) {
                        embed.removeEventListener('error', this.embededErrorHandlerRef);
                    }
                    // Do not remove the embede element now as we still need it to comunicate with the content.
                    // The parent "rootElement" will be removed latter anyhow.
                    // (<HTMLElement>embed.parentElement).removeChild(embed);
                }
            }
            this.embededLoadHandlerRef = null;
            this.embededErrorHandlerRef = null;
            this.embededLoadResolver = null;
            this.embededErrorRejecter = null;
            this.embededLoadPromise = null;
            return super.disposeCore();
        }
        getOptions() {
            return super.getOptions();
        }
        mountCore() {
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
            if (this.embededLoadHandlerRef) {
                embed.addEventListener('load', this.embededLoadHandlerRef);
            }
            if (this.embededErrorHandlerRef) {
                embed.addEventListener('error', this.embededErrorHandlerRef);
            }
            this.rootElement.appendChild(embed);
            return (this.embededLoadPromise)
                .then(() => {
                super.mountCore();
            });
        }
        getCommunicationHandlerCore(methods) {
            const document = this.getDocument();
            return new CrossWindowContainerCommunicationHandler((document).defaultView, this.outboundEndpointAccesor(), this.embededId, getUrlOrigin(document, this.getOptions().url), methods);
        }
        embededLoadHandler(e) {
            if (this.embededLoadResolver) {
                this.embededLoadResolver();
            }
        }
        embededErrorHandler(e) {
            if (this.embededErrorRejecter) {
                this.embededErrorRejecter(e.error);
            }
        }
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
        outboundEndpointAccesor() {
            const iframe = this.rootElement.querySelector(`#${this.embededId}`);
            if (!iframe)
                throw new Error(`No iframe with "${this.embededId}" id found.`);
            if (!iframe.contentWindow)
                throw new Error(`iframe with "${this.embededId}" id does not have a "contentWindow"(${iframe.contentWindow}).`);
            return iframe.contentWindow;
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

    class ChildComponentOptions extends ComponentOptions {
        constructor() {
            super();
            this.type = exports.ChildComponentType.InWindow;
            this.contentDisposeTimeout = 3000;
        }
    }

    class CrossWindowChildComponentOptions extends ChildComponentOptions {
        constructor() {
            super();
            this.url = 'about:blank';
            this.type = exports.ChildComponentType.CrossWindow;
        }
    }

    class CrossWindowContentCommunicationHandler extends ContentCommunicationHandler {
        constructor(inboundEndpoint, outboundEndpoint, origin, disposeCommandCallback) {
            super('message', inboundEndpoint, new CrossWindowCommunicationManager(outboundEndpoint, origin, CommunicationEvent.CONTAINER_EVENT_TYPE, CommunicationEvent.CONTENT_EVENT_TYPE), disposeCommandCallback);
            this.iframeId = '';
            this.messageQueue = [];
        }
        disposeCore() {
            this.messageQueue = [];
            super.disposeCore();
        }
        handleEventCore(e) {
            if (!this.iframeId) {
                this.attemptHandShake(e);
                return;
            }
            super.handleEventCore(e);
        }
        dispatchEvent(information) {
            const message = information;
            if (message) {
                if (this.iframeId) {
                    message.contentId = this.iframeId;
                }
                else {
                    if (message.kind !== exports.CommunicationEventKind.Mounted) {
                        // In case we do not have an iframeId push all events to queue,
                        // only Mounted are allowed to establish handshake.
                        this.messageQueue.push(message);
                        return;
                    }
                }
            }
            super.dispatchEvent(information);
        }
        attemptHandShake(e) {
            if (e.contentId) {
                // Phase 2 of the handshake - we got the id.
                this.iframeId = e.contentId;
                // Send it again to notify parent.
                const response = new CommunicationEvent(exports.CommunicationEventKind.Mounted);
                response.contentId = this.iframeId;
                this.dispatchEvent(response);
                // Send the previously queued messages.
                this.flushMessages();
            }
            else {
                // Phase 1 of the handshake - we got the hash so send it back.
                const response = new CommunicationEvent(exports.CommunicationEventKind.Mounted);
                response.contentId = this.iframeId;
                response.data = e.data;
                this.dispatchEvent(response);
            }
        }
        flushMessages() {
            for (let index = 0; index < this.messageQueue.length; index++) {
                const msg = this.messageQueue[index];
                msg.contentId = this.iframeId;
                this.dispatchEvent(msg);
            }
        }
    }

    class ChildComponentFactory {
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

    class InWindowChildComponentOptions extends ChildComponentOptions {
        constructor() {
            super();
        }
    }

    class InWindowContentCommunicationHandler extends ContentCommunicationHandler {
        constructor(el, disposeCommandCallback) {
            super(CommunicationEvent.CONTAINER_EVENT_TYPE, el, new InWindowCommunicationManager(el, CommunicationEvent.CONTAINER_EVENT_TYPE, CommunicationEvent.CONTENT_EVENT_TYPE), disposeCommandCallback);
        }
    }

    class ResourceConfiguration {
        constructor() {
            this.url = '';
            this.isScript = true;
            this.skip = () => { return false; };
        }
    }

    class RootComponentFacade {
        constructor(signalDisposed) {
            this.signalDisposed = signalDisposed;
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
            return __awaiter$3(this, void 0, void 0, function* () {
                if (!this.isMounted)
                    throw new Error('Wait for the component to mount before starting to add children.');
                const child = this.options.childFactory.createComponent(this.getWindow(), options, new RootComponentFacade((child) => this.scheduleDisposeChild(child)));
                const id = (yield child.initialize()).id;
                this.children[id] = child;
                this.getWindow().setTimeout(() => { child.mount(); }, 0);
                return id;
            });
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
            this.childFactory = new ChildComponentFactory();
        }
    }

    exports.ChildComponent = ChildComponent;
    exports.ChildComponentFactory = ChildComponentFactory;
    exports.ChildComponentOptions = ChildComponentOptions;
    exports.CommunicationEvent = CommunicationEvent;
    exports.CommunicationHandler = CommunicationHandler;
    exports.Component = Component;
    exports.ComponentEvent = ComponentEvent;
    exports.ComponentEventHandlers = ComponentEventHandlers;
    exports.ComponentOptions = ComponentOptions;
    exports.ContainerCommunicationHandler = ContainerCommunicationHandler;
    exports.ContainerCommunicationHandlerMethods = ContainerCommunicationHandlerMethods;
    exports.ContentCommunicationHandler = ContentCommunicationHandler;
    exports.CrossWindowChildComponent = CrossWindowChildComponent;
    exports.CrossWindowChildComponentOptions = CrossWindowChildComponentOptions;
    exports.CrossWindowCommunicationManager = CrossWindowCommunicationManager;
    exports.CrossWindowContainerCommunicationHandler = CrossWindowContainerCommunicationHandler;
    exports.CrossWindowContentCommunicationHandler = CrossWindowContentCommunicationHandler;
    exports.InWindowChildComponent = InWindowChildComponent;
    exports.InWindowChildComponentOptions = InWindowChildComponentOptions;
    exports.InWindowCommunicationManager = InWindowCommunicationManager;
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
