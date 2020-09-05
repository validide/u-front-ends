(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.validide_uFrontEnds = {}));
}(this, (function (exports) { 'use strict';

    /**
     * Get a hash code for the given string
     * @returns The has code
     */
    function getHashCode(value) {
        var hash = 0;
        var length = value.length;
        var char;
        var index = 0;
        if (length === 0)
            return hash;
        while (index < length) {
            char = value.charCodeAt(index);
            // tslint:disable-next-line: no-bitwise
            hash = ((hash << 5) - hash) + char;
            // tslint:disable-next-line: no-bitwise
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
            // tslint:disable: one-variable-per-declaration
            // tslint:disable: no-bitwise
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
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
    // tslint:disable-next-line: no-empty
    function noop() { }

    /**
     * Generate a random id that is not present in the document at this time
     * @param document The reference to the document object
     * @returns A random generated string
     */
    function generateUniqueId(document, prefix) {
        if (prefix === void 0) { prefix = ''; }
        var prefixString = (prefix !== null && prefix !== void 0 ? prefix : '');
        while (true) {
            // The 'A-' will ensure this is always a valid JavaScript ID
            var id = prefixString + 'A-' + getRandomString() + getRandomString();
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
        var a = document.createElement('a');
        a.setAttribute('href', url);
        return a.protocol + '//' + a.hostname + (a.port && ':' + a.port) + a.pathname;
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
        var a = document.createElement('a');
        a.setAttribute('href', url);
        return a.protocol + '//' + a.hostname + (a.port && ':' + a.port);
    }

    /**
     * A function to load a resource and wait for it to load.
     * @param document The reference to the document object.
     * @param url The resource URL.
     * @param isScript Is this resource a script or a stylesheet?
     * @param skipLoading Function to determine if the resource should not be loaded.
     * @param attributes Extra attributes to add on the HTML element before attaching it to the document.
     */
    function loadResource(document, url, isScript, skipLoading, attributes) {
        if (isScript === void 0) { isScript = true; }
        if (skipLoading && skipLoading())
            return Promise.resolve();
        return new Promise(function (resolve, reject) {
            var resource;
            if (isScript) {
                resource = document.createElement('script');
                resource.src = url;
            }
            else {
                resource = document.createElement('link');
                resource.href = url;
            }
            if (attributes) {
                var keys = Object.keys(attributes);
                // tslint:disable-next-line: prefer-for-of
                for (var index = 0; index < keys.length; index++) {
                    var key = keys[index];
                    resource.setAttribute(key, attributes[key]);
                }
            }
            resource.addEventListener('load', function () { return resolve(); });
            resource.addEventListener('error', function () { return reject(new Error("Script load error for url: " + url + ".")); });
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
     * Events triggered by the components
     */
    var ComponentEvent = /** @class */ (function () {
        /**
         * Constructor.
         * @param id Component unique identifier.
         * @param type The type of event.
         * @param el The component root element.
         * @param parentEl The parent element of the component.
         * @param error The error data in case this is an error event.
         */
        function ComponentEvent(id, type, el, parentEl, error) {
            this.id = id;
            this.type = type;
            this.el = el;
            this.parentEl = parentEl;
            this.error = error;
            this.timestamp = new Date();
        }
        return ComponentEvent;
    }());

    var __awaiter = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (window && window.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    /**
     * Base class for all components.
     */
    var Component = /** @class */ (function () {
        /**
         * Constructor
         * @param window The reference to the window object
         * @param options The component options
         */
        function Component(window, options) {
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
        Component.prototype.createRootElement = function () {
            if (this.rootElement)
                return;
            var parent = this.getParentElement();
            this.rootElement = this.getDocument().createElement(this.getOptions().tag);
            this.id = generateUniqueId(this.getDocument(), 'ufe-');
            this.rootElement.id = this.id;
            parent.appendChild(this.rootElement);
        };
        /**
         * Get the parent element that hosts this component.
         */
        Component.prototype.getParentElement = function () {
            var parent = null;
            var opt = this.getOptions();
            if (opt.parent) {
                if (typeof opt.parent === 'string') {
                    parent = this.getDocument().querySelector(opt.parent);
                }
                else {
                    parent = opt.parent;
                }
            }
            if (!parent)
                throw new Error("Failed to find parent \"" + opt.parent + "\".");
            return parent;
        };
        /**
         * Load the resources required by the component.
         */
        Component.prototype.loadResources = function () {
            return __awaiter(this, void 0, void 0, function () {
                var options, document_1, index, resource;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.resourcesLoaded)
                                return [2 /*return*/];
                            this.resourcesLoaded = true;
                            options = this.getOptions();
                            if (!(options.resources && options.resources.length > 0)) return [3 /*break*/, 4];
                            document_1 = this.getDocument();
                            index = 0;
                            _a.label = 1;
                        case 1:
                            if (!(index < options.resources.length)) return [3 /*break*/, 4];
                            resource = options.resources[index];
                            // DO NOT LOAD ALL AT ONCE AS YOU MIGHT HAVE DEPENDENCIES
                            // AND A RESOURCE MIGHT LOAD BEFORE IT'S DEPENDENCY
                            return [4 /*yield*/, loadResource(document_1, resource.url, resource.isScript, resource.skip, resource.attributes)];
                        case 2:
                            // DO NOT LOAD ALL AT ONCE AS YOU MIGHT HAVE DEPENDENCIES
                            // AND A RESOURCE MIGHT LOAD BEFORE IT'S DEPENDENCY
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            index++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get the options data.
         */
        Component.prototype.getOptions = function () {
            return this.options;
        };
        /**
         * Get the window reference.
         */
        Component.prototype.getWindow = function () { return this.window; };
        /**
         * Get the document reference.
         */
        Component.prototype.getDocument = function () { return this.getWindow().document; };
        /**
         * Core initialization function.
         * Any component derived should override this to add extra functionality.
         */
        Component.prototype.initializeCore = function () { return Promise.resolve(); };
        /**
         * Core mount function.
         * Any component derived should override this to add extra functionality.
         */
        Component.prototype.mountCore = function () {
            // This needs to be handled by each component
            // this.callHandler(ComponentEventType.Mounted);
            return Promise.resolve();
        };
        /**
         * Core dispose function.
         * Any component derived should override this to add clean-up after itself.
         */
        Component.prototype.disposeCore = function () { return Promise.resolve(); };
        /**
         * Call the global error handler.
         * @param e The error object
         */
        Component.prototype.callErrorHandler = function (e) {
            var _a;
            var handler = (_a = this.options.handlers) === null || _a === void 0 ? void 0 : _a.error;
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
        };
        /**
         * Call a specific event handler.
         * @param type The type of handler to call.
         */
        Component.prototype.callHandler = function (type, data) {
            if (type === exports.ComponentEventType.Error)
                throw new Error("For calling the \"" + exports.ComponentEventType.Error + "\" handler use the \"callErrorHandler\" method.");
            var handler = this.options.handlers
                ? this.options.handlers[type]
                : null;
            if (handler) {
                try {
                    var event_1 = new ComponentEvent(this.id, type, this.rootElement, this.getParentElement(), null);
                    event_1.data = data;
                    handler(event_1);
                }
                catch (error) {
                    this.callErrorHandler(error);
                }
            }
        };
        /**
         * Logging method.
         * @param message The message.
         * @param optionalParams Optional parameters.
         */
        Component.prototype.log = function (message) {
            var _a, _b;
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            var logMethod = (_b = (_a = this.window) === null || _a === void 0 ? void 0 : _a.console) === null || _b === void 0 ? void 0 : _b.log;
            if (logMethod)
                logMethod(message, optionalParams);
        };
        /**
         * Method invoked to initialize the component.
         * It should create the root element and any base dependencies.
         */
        Component.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isInitialized)
                                return [2 /*return*/, this];
                            this.callHandler(exports.ComponentEventType.BeforeCreate);
                            this.isInitialized = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.loadResources()];
                        case 2:
                            _a.sent();
                            this.createRootElement();
                            return [4 /*yield*/, this.initializeCore()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _a.sent();
                            this.callErrorHandler(e_1);
                            return [3 /*break*/, 5];
                        case 5:
                            this.callHandler(exports.ComponentEventType.Created);
                            return [2 /*return*/, this];
                    }
                });
            });
        };
        /**
         * Method invoked to mount the actual content of the component.
         */
        Component.prototype.mount = function () {
            return __awaiter(this, void 0, void 0, function () {
                var e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isInitialized) {
                                this.callErrorHandler(new Error('Call "initialize" before calling "mount".'));
                                return [2 /*return*/, this];
                            }
                            if (this.isMounted)
                                return [2 /*return*/, this];
                            this.callHandler(exports.ComponentEventType.BeforeMount);
                            this.isMounted = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.mountCore()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_2 = _a.sent();
                            this.callErrorHandler(e_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, this];
                    }
                });
            });
        };
        /**
         * Method invoked to dispose of the component.
         */
        Component.prototype.dispose = function () {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var e_3;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (this.disposed)
                                return [2 /*return*/];
                            this.callHandler(exports.ComponentEventType.BeforeDestroy);
                            this.disposed = true;
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.disposeCore()];
                        case 2:
                            _c.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_3 = _c.sent();
                            this.callErrorHandler(e_3);
                            return [3 /*break*/, 4];
                        case 4:
                            this.callHandler(exports.ComponentEventType.Destroyed);
                            this.id = '';
                            this.isInitialized = false;
                            this.isMounted = false;
                            this.resourcesLoaded = false;
                            (_b = (_a = this.rootElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(this.rootElement);
                            this.rootElement = null;
                            this.window = null;
                            return [2 /*return*/];
                    }
                });
            });
        };
        return Component;
    }());

    (function (CommunicationsEventKind) {
        CommunicationsEventKind["Mounted"] = "mounted";
        CommunicationsEventKind["BeforeUpdate"] = "beforeUpdate";
        CommunicationsEventKind["Updated"] = "updated";
        CommunicationsEventKind["BeforeDispose"] = "beforeDispose";
        CommunicationsEventKind["Disposed"] = "disposed";
        CommunicationsEventKind["Data"] = "data";
    })(exports.CommunicationsEventKind || (exports.CommunicationsEventKind = {}));
    /**
     * Event used to communicate between content and container component.
     */
    var CommunicationsEvent = /** @class */ (function () {
        /**
         * Constructor.
         * @param kind The kind of event.
         */
        function CommunicationsEvent(kind) {
            this.kind = kind;
            this.uuid = getUuidV4();
            this.timestamp = new Date().getTime();
            this.contentId = '';
        }
        /**
         * The type of event dispatched by the child component.
         */
        CommunicationsEvent.CONTENT_EVENT_TYPE = 'content_event.communication.children.validide_micro_front_ends';
        /**
         * The type of event dispatched by the content.
         */
        CommunicationsEvent.CONTAINER_EVENT_TYPE = 'container_event.communication.children.validide_micro_front_ends';
        return CommunicationsEvent;
    }());

    var _a, _b, _c, _d, _e, _f;
    /**
     * The communication handler methods.
     */
    var ContainerCommunicationHandlerMethods = /** @class */ (function () {
        function ContainerCommunicationHandlerMethods() {
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
        return ContainerCommunicationHandlerMethods;
    }());
    _a = exports.CommunicationsEventKind.Mounted, _b = exports.CommunicationsEventKind.BeforeUpdate, _c = exports.CommunicationsEventKind.Updated, _d = exports.CommunicationsEventKind.BeforeDispose, _e = exports.CommunicationsEventKind.Disposed, _f = exports.CommunicationsEventKind.Data;
    /**
     * Handle the communications on the child component side.
     */
    var ContainerCommunicationHandler = /** @class */ (function () {
        /**
         * Constructor
         * @param communicationsManager A communications manager.
         * @param handlerMethods A collection of handler methods.
         */
        function ContainerCommunicationHandler(communicationsManager, handlerMethods) {
            var _this = this;
            this.communicationsManager = communicationsManager;
            this.handlerMethods = handlerMethods;
            this.communicationsManager.setEventReceivedCallback(function (e) {
                _this.handleEvent(e);
            });
            this.disposed = false;
        }
        /**
         * Core functionality for handling the incoming events.
         * @param e The event.
         */
        ContainerCommunicationHandler.prototype.handleEventCore = function (e) {
            if (!this.handlerMethods)
                return;
            var method = this.handlerMethods[e.kind];
            if (!method)
                return;
            method(e.data);
        };
        /**
         * Handle the incoming communications event.
         * @param e The event
         */
        ContainerCommunicationHandler.prototype.handleEvent = function (e) {
            this.handleEventCore(e);
        };
        /**
         * Method invoked to dispose of the handler.
         */
        ContainerCommunicationHandler.prototype.dispose = function () {
            var _g;
            if (this.disposed)
                return;
            this.disposed = true;
            (_g = this.communicationsManager) === null || _g === void 0 ? void 0 : _g.dispose();
            this.communicationsManager = null;
            this.handlerMethods = null;
        };
        /**
         * Send a message.
         * @param event The message.
         */
        ContainerCommunicationHandler.prototype.send = function (event) {
            var _g;
            (_g = this.communicationsManager) === null || _g === void 0 ? void 0 : _g.send(event);
        };
        /**
         * Send data.
         * @param data The data to send.
         */
        ContainerCommunicationHandler.prototype.sendData = function (data) {
            var _g;
            var event = new CommunicationsEvent(exports.CommunicationsEventKind.Data);
            event.data = data;
            (_g = this.communicationsManager) === null || _g === void 0 ? void 0 : _g.send(event);
        };
        /**
         * Request that the content begins disposing.
         */
        ContainerCommunicationHandler.prototype.requestContentDispose = function () {
            this.send(new CommunicationsEvent(exports.CommunicationsEventKind.BeforeDispose));
        };
        return ContainerCommunicationHandler;
    }());

    /**
     * Content communications handler methods
     */
    var ContentCommunicationHandlerMethods = /** @class */ (function () {
        function ContentCommunicationHandlerMethods() {
            /**
             * Method to dispose the content.
             */
            this.dispose = noop;
            /**
             * Method to dispose the content.
             */
            this.handleDataEvent = noop;
        }
        return ContentCommunicationHandlerMethods;
    }());
    /**
     * Handle the communications on the component content side.
     */
    var ContentCommunicationHandler = /** @class */ (function () {
        /**
         * Constructor
         * @param communicationsManager A communications manager
         * @param methods The callback to dispose the content.
         */
        function ContentCommunicationHandler(communicationsManager, methods) {
            var _this = this;
            this.communicationsManager = communicationsManager;
            this.methods = methods;
            this.communicationsManager.setEventReceivedCallback(function (e) {
                _this.handleEvent(e);
            });
            this.disposed = false;
        }
        /**
         * Core functionality for handling the incoming events.
         * @param e The event.
         */
        ContentCommunicationHandler.prototype.handleEventCore = function (e) {
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
                    throw new Error("The \"" + e.kind + "\" event is not configured.");
            }
        };
        /**
         * Handle the incoming communications event.
         * @param e The event
         */
        ContentCommunicationHandler.prototype.handleEvent = function (e) {
            this.handleEventCore(e);
        };
        /**
         * Core dispose function.
         * Any component derived should override this to add clean-up after itself.
         */
        // tslint:disable-next-line: no-empty
        ContentCommunicationHandler.prototype.disposeCore = function () { };
        /**
         * Send a message.
         * @param event The message.
         */
        ContentCommunicationHandler.prototype.send = function (event) {
            var _a;
            (_a = this.communicationsManager) === null || _a === void 0 ? void 0 : _a.send(event);
        };
        /**
         * Dispatch event to signal mounting finished.
         */
        ContentCommunicationHandler.prototype.sendData = function (data) {
            var evt = new CommunicationsEvent(exports.CommunicationsEventKind.Data);
            evt.data = data;
            this.send(evt);
        };
        /**
         * Dispatch event to signal mounting finished.
         */
        ContentCommunicationHandler.prototype.dispatchMounted = function () {
            this.send(new CommunicationsEvent(exports.CommunicationsEventKind.Mounted));
        };
        /**
         * Dispatch event to signal update is about to start.
         */
        ContentCommunicationHandler.prototype.dispatchBeforeUpdate = function () {
            this.send(new CommunicationsEvent(exports.CommunicationsEventKind.BeforeUpdate));
        };
        /**
         * Dispatch event to signal update finished.
         */
        ContentCommunicationHandler.prototype.dispatchUpdated = function () {
            this.send(new CommunicationsEvent(exports.CommunicationsEventKind.Updated));
        };
        /**
         * Dispatch event to disposing started.
         */
        ContentCommunicationHandler.prototype.dispatchBeforeDispose = function () {
            this.send(new CommunicationsEvent(exports.CommunicationsEventKind.BeforeDispose));
        };
        /**
         * Dispatch event to mount finished.
         */
        ContentCommunicationHandler.prototype.dispatchDisposed = function () {
            this.send(new CommunicationsEvent(exports.CommunicationsEventKind.Disposed));
        };
        /**
         * Method invoked to dispose of the handler.
         */
        ContentCommunicationHandler.prototype.dispose = function () {
            var _a;
            if (this.disposed)
                return;
            this.disposed = true;
            this.disposeCore();
            (_a = this.communicationsManager) === null || _a === void 0 ? void 0 : _a.dispose();
            this.communicationsManager = null;
            this.methods = null;
        };
        return ContentCommunicationHandler;
    }());

    /**
     * The data sent between the windows directly on the Message Event.
     */
    var CrossWindowCommunicationDataContract = /** @class */ (function () {
        /**
         * Constructor.
         * @param type Data type.
         * @param detail Data detail.
         */
        function CrossWindowCommunicationDataContract(type, detail) {
            this.type = type;
            this.detail = detail;
        }
        return CrossWindowCommunicationDataContract;
    }());

    var __extends = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var CommunicationsManager = /** @class */ (function () {
        /**
         * Constructor.
         */
        function CommunicationsManager() {
            this.initialized = false;
            this.disposed = false;
        }
        /**
         * Initialize the manager.
         */
        // tslint:disable-next-line: no-empty
        CommunicationsManager.prototype.initializeCore = function () { };
        /**
         * Clean any resources before the manager is disposed.
         */
        // tslint:disable-next-line: no-empty
        CommunicationsManager.prototype.disposeCore = function () { };
        /**
         * Initialize the manager.
         */
        CommunicationsManager.prototype.initialize = function () {
            if (this.initialized)
                return;
            this.initialized = true;
            this.initializeCore();
        };
        /**
         * Dispose of the manager.
         */
        CommunicationsManager.prototype.dispose = function () {
            if (this.disposed)
                return;
            this.disposed = true;
            this.disposeCore();
        };
        return CommunicationsManager;
    }());
    /**
     * Communications manager base class.
     */
    var CommunicationsManagerOf = /** @class */ (function (_super) {
        __extends(CommunicationsManagerOf, _super);
        /**
         * Constructor
         * @param inboundEndpoint The endpoint for receiving messages.
         * @param inboundEventType The types of messages to receive.
         * @param outboundEndpoint The endpoint to sent messages.
         * @param outboundEventType The messages to send.
         */
        function CommunicationsManagerOf(inboundEndpoint, inboundEventType, outboundEndpoint, outboundEventType) {
            var _this = _super.call(this) || this;
            _this.inboundEndpoint = inboundEndpoint;
            _this.inboundEventType = inboundEventType;
            _this.outboundEndpoint = outboundEndpoint;
            _this.outboundEventType = outboundEventType;
            _this.onEventReceived = null;
            _this.eventHandler = function (e) { _this.handleEvent(e); };
            return _this;
        }
        /**
         * Handle the received events.
         * @param e The received event.
         */
        CommunicationsManagerOf.prototype.handleEvent = function (e) {
            if (!this.onEventReceived)
                return;
            var evt = this.readEvent(e);
            if (evt) {
                this.onEventReceived(evt);
            }
        };
        /**
         * @inheritdoc
         */
        CommunicationsManagerOf.prototype.initializeCore = function () {
            if (this.inboundEndpoint && this.eventHandler) {
                this.startReceiving(this.inboundEndpoint, this.eventHandler);
            }
            _super.prototype.initializeCore.call(this);
        };
        /**
         * @inheritdoc
         */
        CommunicationsManagerOf.prototype.disposeCore = function () {
            if (this.inboundEndpoint && this.eventHandler) {
                this.stopReceiving(this.inboundEndpoint, this.eventHandler);
            }
            this.eventHandler = null;
            this.onEventReceived = null;
            this.inboundEndpoint = null;
            _super.prototype.disposeCore.call(this);
        };
        /**
         * @inheritdoc
         */
        CommunicationsManagerOf.prototype.send = function (event) {
            if (this.outboundEndpoint) {
                this.sendEvent(this.outboundEndpoint, event);
            }
        };
        /**
         * @inheritdoc
         */
        CommunicationsManagerOf.prototype.setEventReceivedCallback = function (callback) {
            this.onEventReceived = callback;
        };
        return CommunicationsManagerOf;
    }(CommunicationsManager));

    var __extends$1 = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @inheritdoc
     */
    var CrossWindowCommunicationsManager = /** @class */ (function (_super) {
        __extends$1(CrossWindowCommunicationsManager, _super);
        /**
         * Constructor
         * @param inboundEndpoint The endpoint for receiving messages.
         * @param inboundEventType The types of messages to receive.
         * @param outboundEndpoint The endpoint to sent messages.
         * @param outboundEventType The messages to send.
         * @param origin The origin to communicate with.
         */
        function CrossWindowCommunicationsManager(inboundEndpoint, inboundEventType, outboundEndpoint, outboundEventType, origin) {
            var _this = _super.call(this, inboundEndpoint, inboundEventType, outboundEndpoint, outboundEventType) || this;
            _this.origin = origin;
            return _this;
        }
        /**
         * @inheritdoc
         */
        CrossWindowCommunicationsManager.prototype.readEvent = function (e) {
            var messageEvent = e;
            if (!messageEvent || messageEvent.origin !== this.origin)
                return null;
            var data = messageEvent.data;
            if (!data || data.type !== this.inboundEventType)
                return null;
            return data.detail ? data.detail : null;
        };
        /**
         * @inheritdoc
         */
        CrossWindowCommunicationsManager.prototype.startReceiving = function (inboundEndpoint, handler) {
            inboundEndpoint.addEventListener('message', handler);
        };
        /**
         * @inheritdoc
         */
        CrossWindowCommunicationsManager.prototype.stopReceiving = function (inboundEndpoint, handler) {
            inboundEndpoint.removeEventListener('message', handler);
        };
        /**
         * @inheritdoc
         */
        CrossWindowCommunicationsManager.prototype.sendEvent = function (outboundEndpoint, event) {
            var data = new CrossWindowCommunicationDataContract(this.outboundEventType, event);
            outboundEndpoint.postMessage(data, this.origin);
        };
        return CrossWindowCommunicationsManager;
    }(CommunicationsManagerOf));

    function customEventPolyfill(document, typeArg, eventInitDict) {
        var params = eventInitDict || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(typeArg, params.bubbles || false, params.cancelable || false, params.detail);
        return evt;
    }
    function createCustomEvent(document, typeArg, eventInitDict) {
        var win = document === null || document === void 0 ? void 0 : document.defaultView;
        if (!win)
            throw new Error('Document does not have a defualt view.');
        if (typeof win.CustomEvent !== 'function') {
            return new customEventPolyfill(document, typeArg, eventInitDict);
        }
        return new win.CustomEvent(typeArg, eventInitDict);
    }

    var __extends$2 = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @inheritdoc
     */
    var HTMLElementCommunicationsManager = /** @class */ (function (_super) {
        __extends$2(HTMLElementCommunicationsManager, _super);
        /**
         * @inheritdoc
         */
        function HTMLElementCommunicationsManager(inboundEndpoint, inboundEventType, outboundEndpoint, outboundEventType) {
            return _super.call(this, inboundEndpoint, inboundEventType, outboundEndpoint, outboundEventType) || this;
        }
        /**
         * @inheritdoc
         */
        HTMLElementCommunicationsManager.prototype.readEvent = function (e) {
            var customEvent = e;
            if (!customEvent || customEvent.type !== this.inboundEventType)
                return null;
            return customEvent.detail instanceof CommunicationsEvent
                ? customEvent.detail
                : null;
        };
        /**
         * @inheritdoc
         */
        HTMLElementCommunicationsManager.prototype.startReceiving = function (inboundEndpoint, handler) {
            inboundEndpoint.addEventListener(this.inboundEventType, handler);
        };
        /**
         * @inheritdoc
         */
        HTMLElementCommunicationsManager.prototype.stopReceiving = function (inboundEndpoint, handler) {
            inboundEndpoint.removeEventListener(this.inboundEventType, handler);
        };
        /**
         * @inheritdoc
         */
        HTMLElementCommunicationsManager.prototype.sendEvent = function (outboundEndpoint, event) {
            if (!outboundEndpoint.ownerDocument)
                return;
            var evt = createCustomEvent(outboundEndpoint.ownerDocument, this.outboundEventType, { detail: event });
            outboundEndpoint.dispatchEvent(evt);
        };
        return HTMLElementCommunicationsManager;
    }(CommunicationsManagerOf));

    var __extends$3 = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __awaiter$1 = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$1 = (window && window.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    /**
     * Child component base class.
     */
    var ChildComponent = /** @class */ (function (_super) {
        __extends$3(ChildComponent, _super);
        /**
         * Constructor.
         * @param window The window reference.
         * @param options The child options.
         * @param rootFacade The facade to the root component.
         */
        function ChildComponent(window, options, rootFacade) {
            var _this = _super.call(this, window, options) || this;
            _this.rootFacade = rootFacade;
            _this.communicationHandler = null;
            _this.contentDisposePromise = null;
            _this.contentDisposePromiseResolver = null;
            return _this;
        }
        /**
         * Get the communication handler.
         */
        ChildComponent.prototype.getCommunicationHandler = function () {
            var _this = this;
            var methods = new ContainerCommunicationHandlerMethods();
            methods.mounted = function () { return _this.callHandler(exports.ComponentEventType.Mounted); };
            methods.beforeUpdate = function () { return _this.callHandler(exports.ComponentEventType.BeforeUpdate); };
            methods.updated = function () { return _this.callHandler(exports.ComponentEventType.Updated); };
            methods.data = function (data) { return _this.callHandler(exports.ComponentEventType.Data, data); };
            methods.beforeDispose = function () { return _this.contentBeginDisposed(); };
            methods.disposed = function () { return _this.contentDisposed(); };
            return this.getCommunicationHandlerCore(methods);
        };
        /**
         * Get the child component options.
         */
        ChildComponent.prototype.getOptions = function () {
            return _super.prototype.getOptions.call(this);
        };
        /**
         * Handler for the signal that the component started to dispose.
         */
        ChildComponent.prototype.contentBeginDisposed = function () {
            if (this.contentDisposePromise !== null)
                return; // Dispose has already started.
            this.setContentDisposePromise();
            // Inform parent the content is being disposed.
            this.rootFacade.signalDisposed(this);
        };
        /**
         * Signal the content that it will be disposed.
         */
        ChildComponent.prototype.startDisposingContent = function () {
            if (this.contentDisposePromise !== null)
                return; // Dispose has already started.
            this.setContentDisposePromise();
            // This should trigger the child component dispose.
            this.communicationHandler.requestContentDispose();
        };
        /**
         * Set the promise that is used fof the disposing of the component.
         */
        ChildComponent.prototype.setContentDisposePromise = function () {
            var _this = this;
            this.contentDisposePromise = Promise
                .race([
                new Promise(function (resolver, rejecter) {
                    _this.contentDisposePromiseResolver = resolver;
                }),
                new Promise(function (resolveTimeout, rejectTimeout) {
                    _this
                        .getWindow()
                        .setTimeout(function () { return rejectTimeout(new Error('Child dispose timeout.')); }, _this.getOptions().contentDisposeTimeout);
                })
            ])
                .catch(function (err) {
                _this.callErrorHandler(err);
            });
        };
        /**
         * Handler for the signal that the content has finished disposing.
         */
        ChildComponent.prototype.contentDisposed = function () {
            if (this.contentDisposePromiseResolver === null) {
                // For some reason we got the disposed call without getting the 'beginDispose' call.
                this.contentDisposePromise = Promise.resolve();
                this.rootFacade.signalDisposed(this);
            }
            else {
                this.contentDisposePromiseResolver();
            }
        };
        /**
         * @@inheritdoc
         */
        ChildComponent.prototype.mountCore = function () {
            if (!this.communicationHandler) {
                this.communicationHandler = this.getCommunicationHandler();
            }
            return _super.prototype.mountCore.call(this);
        };
        /**
         * @@inheritdoc
         */
        ChildComponent.prototype.disposeCore = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.startDisposingContent();
                            return [4 /*yield*/, this.contentDisposePromise];
                        case 1:
                            _a.sent();
                            this.communicationHandler.dispose();
                            this.communicationHandler = null;
                            this.contentDisposePromiseResolver = null;
                            this.contentDisposePromise = null;
                            return [4 /*yield*/, _super.prototype.disposeCore.call(this)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Send data.
         * @param data The data to send.
         */
        ChildComponent.prototype.sendData = function (data) {
            var _a;
            (_a = this.communicationHandler) === null || _a === void 0 ? void 0 : _a.sendData(data);
        };
        return ChildComponent;
    }(Component));

    /**
     * The type of child component.
     */
    (function (ChildComponentType) {
        /**
         * In window component(JavaScript or WebComponent Custom Element)
         */
        ChildComponentType["InWindow"] = "inWindow";
        /**
         * Cross window component(loaded in an emendable element - Iframe)
         */
        ChildComponentType["CrossWindow"] = "crossWindow";
    })(exports.ChildComponentType || (exports.ChildComponentType = {}));

    var __extends$4 = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @inheritdoc
     */
    var InWindowContainerCommunicationHandler = /** @class */ (function (_super) {
        __extends$4(InWindowContainerCommunicationHandler, _super);
        /**
         * @inheritdoc
         */
        function InWindowContainerCommunicationHandler(communicationsManager, wrapperMethods) {
            return _super.call(this, communicationsManager, wrapperMethods) || this;
        }
        return InWindowContainerCommunicationHandler;
    }(ContainerCommunicationHandler));

    var __extends$5 = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __awaiter$2 = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$2 = (window && window.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    /**
     * In Window Child Component.
     */
    var InWindowChildComponent = /** @class */ (function (_super) {
        __extends$5(InWindowChildComponent, _super);
        /**
         * Constructor.
         * @param window The window reference.
         * @param options The child component options.
         * @param rootFacade The facade to the root component.
         */
        function InWindowChildComponent(window, options, rootFacade) {
            return _super.call(this, window, options, rootFacade) || this;
        }
        /**
         * @inheritdoc
         */
        InWindowChildComponent.prototype.getCommunicationHandlerCore = function (methods) {
            var endpoint = this.rootElement;
            var manager = new HTMLElementCommunicationsManager(endpoint, CommunicationsEvent.CONTENT_EVENT_TYPE, endpoint, CommunicationsEvent.CONTAINER_EVENT_TYPE);
            manager.initialize();
            return new InWindowContainerCommunicationHandler(manager, methods);
        };
        /**
         * Get the InWindowChildComponentOptions
         */
        InWindowChildComponent.prototype.getOptions = function () {
            return _super.prototype.getOptions.call(this);
        };
        /**
         * @inheritdoc
         */
        InWindowChildComponent.prototype.mountCore = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                var injectionFunction;
                return __generator$2(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            injectionFunction = this.getOptions().inject;
                            if (!injectionFunction) {
                                throw new Error('Inject method not defined!');
                            }
                            injectionFunction(this.rootElement);
                            return [4 /*yield*/, _super.prototype.mountCore.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return InWindowChildComponent;
    }(ChildComponent));

    var __extends$6 = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @inheritdoc
     */
    var CrossWindowContainerCommunicationHandler = /** @class */ (function (_super) {
        __extends$6(CrossWindowContainerCommunicationHandler, _super);
        /**
         * Constructor.
         * @param communicationsManager A communications manager.
         * @param embedId The Id of the embedded element.
         * @param containerMethods The methods to communicate with the container.
         */
        function CrossWindowContainerCommunicationHandler(communicationsManager, embedId, containerMethods) {
            var _this = _super.call(this, communicationsManager, containerMethods) || this;
            _this.embedId = embedId;
            return _this;
        }
        /**
         * @inheritdoc
         */
        CrossWindowContainerCommunicationHandler.prototype.handleEventCore = function (e) {
            if (!this.embedId)
                return;
            if (!e.contentId && e.kind === exports.CommunicationsEventKind.Mounted) {
                this.attemptHandShake(e);
                return;
            }
            if (this.embedId !== e.contentId)
                return;
            _super.prototype.handleEventCore.call(this, e);
        };
        /**
         * Attempt a handshake with the content.
         */
        CrossWindowContainerCommunicationHandler.prototype.attemptHandShake = function (e) {
            var hash = getHashCode(this.embedId).toString(10);
            var response = new CommunicationsEvent(exports.CommunicationsEventKind.Mounted);
            // We got a message back so if the data matches the hash we sent send the id
            if (e.data && e.data === hash) {
                response.contentId = this.embedId;
            }
            else {
                response.data = hash;
            }
            this.send(response);
        };
        return CrossWindowContainerCommunicationHandler;
    }(ContainerCommunicationHandler));

    var __extends$7 = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __awaiter$3 = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$3 = (window && window.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    /**
     * Cross Window Child Component.
     */
    var CrossWindowChildComponent = /** @class */ (function (_super) {
        __extends$7(CrossWindowChildComponent, _super);
        /**
         * Constructor.
         * @param window The window reference.
         * @param options The child options.
         * @param rootFacade he root component facade.
         */
        function CrossWindowChildComponent(window, options, rootFacade) {
            var _this = _super.call(this, window, options, rootFacade) || this;
            _this.embeddedId = '';
            _this.embeddedLoadResolver = null;
            _this.embeddedErrorRejecter = null;
            _this.embeddedLoadPromise = new Promise(function (resolve, reject) {
                _this.embeddedLoadResolver = resolve;
                _this.embeddedErrorRejecter = reject;
            });
            _this.embeddedLoadHandlerRef = _this.embeddedLoadHandler.bind(_this);
            _this.embeddedErrorHandlerRef = _this.embeddedErrorHandler.bind(_this);
            return _this;
        }
        /**
         * @inheritdoc
         */
        CrossWindowChildComponent.prototype.disposeCore = function () {
            var embed = this.embeddedId
                ? this.rootElement.querySelector("#" + this.embeddedId)
                : null;
            if (embed) {
                embed.removeEventListener('load', this.embeddedLoadHandlerRef);
                embed.removeEventListener('error', this.embeddedErrorHandlerRef);
                // Do not remove the embedded element now as we still need it to communicate with the content.
                // The parent "rootElement" will be removed latter anyhow.
                // (<HTMLElement>embed.parentElement).removeChild(embed);
            }
            this.embeddedLoadHandlerRef = null;
            this.embeddedErrorHandlerRef = null;
            this.embeddedLoadResolver = null;
            this.embeddedErrorRejecter = null;
            this.embeddedLoadPromise = null;
            return _super.prototype.disposeCore.call(this);
        };
        /**
         * Get the CrossWindowChildComponentOptions
         */
        CrossWindowChildComponent.prototype.getOptions = function () {
            return _super.prototype.getOptions.call(this);
        };
        /**
         * @inheritdoc
         */
        CrossWindowChildComponent.prototype.mountCore = function () {
            return __awaiter$3(this, void 0, void 0, function () {
                var createEmbedElementFn, embed, embedId;
                return __generator$3(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createEmbedElementFn = this.getOptions().createEmbedElement;
                            embed = null;
                            if (createEmbedElementFn) {
                                embed = createEmbedElementFn(this.rootElement);
                            }
                            else {
                                embed = this.createEmbedElement();
                            }
                            if (!embed)
                                throw new Error('Failed to create embed element!');
                            embedId = generateUniqueId(this.getDocument(), 'ufe-cross-');
                            embed.id = embedId;
                            this.embeddedId = embedId;
                            embed.addEventListener('load', this.embeddedLoadHandlerRef);
                            embed.addEventListener('error', this.embeddedErrorHandlerRef);
                            this.rootElement.appendChild(embed);
                            return [4 /*yield*/, (this.embeddedLoadPromise)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, _super.prototype.mountCore.call(this)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         *
         * @param methods @inheritdoc
         */
        CrossWindowChildComponent.prototype.getCommunicationHandlerCore = function (methods) {
            var document = this.getDocument();
            var manager = new CrossWindowCommunicationsManager((document).defaultView, CommunicationsEvent.CONTENT_EVENT_TYPE, this.outboundEndpointAccessor(), CommunicationsEvent.CONTAINER_EVENT_TYPE, getUrlOrigin(document, this.getOptions().url));
            manager.initialize();
            return new CrossWindowContainerCommunicationHandler(manager, this.embeddedId, methods);
        };
        /**
         * Handle the loading of the embedded element.
         * @param e The load event.
         */
        CrossWindowChildComponent.prototype.embeddedLoadHandler = function (e) {
            this.embeddedLoadResolver();
        };
        /**
         * Handle the error of the embedded element.
         * @param e The error event.
         */
        CrossWindowChildComponent.prototype.embeddedErrorHandler = function (e) {
            this.embeddedErrorRejecter(new Error("Failed to load embedded element.\nError details:\n" + JSON.stringify(e)));
        };
        /**
         * Create the embedded element.
         */
        CrossWindowChildComponent.prototype.createEmbedElement = function () {
            var embed = this.getDocument().createElement('iframe');
            var opt = this.getOptions();
            if (opt.embeddedAttributes) {
                var keys = Object.keys(opt.embeddedAttributes);
                // tslint:disable-next-line: prefer-for-of
                for (var index = 0; index < keys.length; index++) {
                    var key = keys[index];
                    embed.setAttribute(key, opt.embeddedAttributes[key]);
                }
            }
            embed.setAttribute('src', opt.url);
            return embed;
        };
        /**
         * Access the outbound communication endpoint.
         */
        CrossWindowChildComponent.prototype.outboundEndpointAccessor = function () {
            var embed = this.embeddedId
                ? this.rootElement.querySelector("#" + this.embeddedId)
                : null;
            if (!embed)
                throw new Error("No iframe with \"" + this.embeddedId + "\" id found.");
            if (!embed.contentWindow)
                throw new Error("The iframe with \"" + this.embeddedId + "\" id does not have a \"contentWindow\"(" + embed.contentWindow + ").");
            return embed.contentWindow;
        };
        return CrossWindowChildComponent;
    }(ChildComponent));

    /**
     * Configuration object for the event handlers.
     */
    var ComponentEventHandlers = /** @class */ (function () {
        function ComponentEventHandlers() {
        }
        return ComponentEventHandlers;
    }());
    exports.ComponentEventType.BeforeCreate, exports.ComponentEventType.Created, exports.ComponentEventType.BeforeMount, exports.ComponentEventType.Mounted, exports.ComponentEventType.BeforeUpdate, exports.ComponentEventType.Updated, exports.ComponentEventType.BeforeDestroy, exports.ComponentEventType.Destroyed, exports.ComponentEventType.Error, exports.ComponentEventType.Data;
    /**
     * Component configuration options.
     */
    var ComponentOptions = /** @class */ (function () {
        function ComponentOptions() {
            this.parent = 'body';
            this.tag = 'div';
            this.handlers = new ComponentEventHandlers();
            this.resources = [];
        }
        return ComponentOptions;
    }());

    var __extends$8 = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Child component options.
     */
    var ChildComponentOptions = /** @class */ (function (_super) {
        __extends$8(ChildComponentOptions, _super);
        function ChildComponentOptions() {
            var _this = _super.call(this) || this;
            _this.type = exports.ChildComponentType.InWindow;
            /**
             * The the interval to wait for the component before triggering an error and the 'disposed' event.
             */
            _this.contentDisposeTimeout = 3000;
            return _this;
        }
        return ChildComponentOptions;
    }(ComponentOptions));

    var __extends$9 = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Cross Window Child Component Options.
     */
    var CrossWindowChildComponentOptions = /** @class */ (function (_super) {
        __extends$9(CrossWindowChildComponentOptions, _super);
        /**
         * Constructor.
         */
        function CrossWindowChildComponentOptions() {
            var _this = _super.call(this) || this;
            _this.url = 'about:blank';
            _this.type = exports.ChildComponentType.CrossWindow;
            return _this;
        }
        return CrossWindowChildComponentOptions;
    }(ChildComponentOptions));

    var __extends$a = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @inheritdoc
     */
    var CrossWindowContentCommunicationHandler = /** @class */ (function (_super) {
        __extends$a(CrossWindowContentCommunicationHandler, _super);
        /**
         * Constructor.
         * @param communicationsManager A communications manager.
         * @param methods The callback to dispose the content.
         */
        function CrossWindowContentCommunicationHandler(communicationsManager, methods) {
            var _this = _super.call(this, communicationsManager, methods) || this;
            _this.iframeId = '';
            _this.messageQueue = [];
            return _this;
        }
        /**
         * @inheritdoc
         */
        CrossWindowContentCommunicationHandler.prototype.disposeCore = function () {
            this.messageQueue = [];
            _super.prototype.disposeCore.call(this);
        };
        /**
         * @inheritdoc
         */
        CrossWindowContentCommunicationHandler.prototype.handleEventCore = function (e) {
            if (!this.iframeId) {
                this.attemptHandShake(e);
                return;
            }
            _super.prototype.handleEventCore.call(this, e);
        };
        /**
         * @inheritdoc
         */
        CrossWindowContentCommunicationHandler.prototype.send = function (message) {
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
            _super.prototype.send.call(this, message);
        };
        /**
         * Attempt a handshake with the container.
         * @param e The communication event.
         */
        CrossWindowContentCommunicationHandler.prototype.attemptHandShake = function (e) {
            if (e.contentId) {
                // Phase 2 of the handshake - we got the id.
                this.iframeId = e.contentId;
                // Send it again to notify parent.
                var response = new CommunicationsEvent(exports.CommunicationsEventKind.Mounted);
                response.contentId = this.iframeId;
                this.send(response);
                // Send the previously queued messages.
                this.flushMessages();
            }
            else {
                // Phase 1 of the handshake - we got the hash so send it back.
                var response = new CommunicationsEvent(exports.CommunicationsEventKind.Mounted);
                response.contentId = this.iframeId;
                response.data = e.data;
                this.send(response);
            }
        };
        /**
         * Flush all the messages that were enqueued before the handshake.
         */
        CrossWindowContentCommunicationHandler.prototype.flushMessages = function () {
            // tslint:disable-next-line: prefer-for-of
            for (var index = 0; index < this.messageQueue.length; index++) {
                var msg = this.messageQueue[index];
                msg.contentId = this.iframeId;
                this.send(msg);
            }
        };
        return CrossWindowContentCommunicationHandler;
    }(ContentCommunicationHandler));

    /**
     * Factory to create child components.
     */
    var ChildComponentFactory = /** @class */ (function () {
        function ChildComponentFactory() {
        }
        /**
         * Create a child component.
         * @param window The window reference.
         * @param options The child component options.
         * @param rootFacade The facade for the root component.
         */
        ChildComponentFactory.prototype.createComponent = function (window, options, rootFacade) {
            switch (options.type) {
                case exports.ChildComponentType.InWindow:
                    return new InWindowChildComponent(window, options, rootFacade);
                case exports.ChildComponentType.CrossWindow:
                    return new CrossWindowChildComponent(window, options, rootFacade);
                default:
                    throw new Error("The \"" + options.type + "\" is not configured.");
            }
        };
        return ChildComponentFactory;
    }());

    var __extends$b = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * In Window Child Component Options.
     */
    var InWindowChildComponentOptions = /** @class */ (function (_super) {
        __extends$b(InWindowChildComponentOptions, _super);
        /**
         * Constructor.
         */
        function InWindowChildComponentOptions() {
            return _super.call(this) || this;
        }
        return InWindowChildComponentOptions;
    }(ChildComponentOptions));

    var __extends$c = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @inheritdoc
     */
    var InWindowContentCommunicationHandler = /** @class */ (function (_super) {
        __extends$c(InWindowContentCommunicationHandler, _super);
        /**
         * Constructor.
         * @param el The element to use for sending and receiving messages.
         * @param methods The callback to dispose the content.
         */
        function InWindowContentCommunicationHandler(communicationsManager, methods) {
            return _super.call(this, communicationsManager, methods) || this;
        }
        return InWindowContentCommunicationHandler;
    }(ContentCommunicationHandler));

    /**
     * Configuration for retrieving a resource.
     */
    var ResourceConfiguration = /** @class */ (function () {
        function ResourceConfiguration() {
            this.url = '';
            this.isScript = true;
            this.skip = function () { return false; };
        }
        return ResourceConfiguration;
    }());

    /**
     * Facade to interface with the the root component.
     */
    var RootComponentFacade = /** @class */ (function () {
        /**
         * Constructor.
         * @param signalDisposed The function to invoke to signal that the child was disposed.
         */
        function RootComponentFacade(signalDisposed) {
            this.signalDisposed = signalDisposed;
        }
        return RootComponentFacade;
    }());

    var __extends$d = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __awaiter$4 = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$4 = (window && window.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    /**
     * The root component to host the rest of the components.
     * There is not limitation right no but ideally there should only be one of these on a page.
     */
    var RootComponent = /** @class */ (function (_super) {
        __extends$d(RootComponent, _super);
        function RootComponent(window, options) {
            var _this = _super.call(this, window, options) || this;
            _this.children = {};
            return _this;
        }
        /**
         * Schedule the disposing of the child on exiting the function.
         * The dispose method is async but we do not want to wait for that.
         * @param child The child that was disposed.
         */
        RootComponent.prototype.scheduleDisposeChild = function (child) {
            var _this = this;
            // Schedule this later
            this.getWindow().setTimeout(function () {
                _this.disposeChildByRef(child);
            }, 0);
        };
        /**
         * Dispose a child using it's reference.
         * @param child
         */
        RootComponent.prototype.disposeChildByRef = function (child) {
            return this.disposeChild(child.id);
        };
        /**
         * Dispose a child by using it's id.
         * @param childId The child identifier.
         */
        RootComponent.prototype.disposeChild = function (childId) {
            return __awaiter$4(this, void 0, void 0, function () {
                var child;
                return __generator$4(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            child = this.getChild(childId);
                            if (!child)
                                return [2 /*return*/, Promise.resolve()];
                            return [4 /*yield*/, child.dispose()];
                        case 1:
                            _a.sent();
                            this.children[childId] = null;
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @@inheritdoc
         */
        RootComponent.prototype.mountCore = function () {
            this.callHandler(exports.ComponentEventType.Mounted);
            return _super.prototype.mountCore.call(this);
        };
        /**
         * Add a child component.
         * @param options Child component options.
         */
        RootComponent.prototype.addChild = function (options) {
            return __awaiter$4(this, void 0, void 0, function () {
                var child, id;
                return __generator$4(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isInitialized)
                                throw new Error('Wait for the component to initialize before starting to add children.');
                            if (!this.isMounted)
                                throw new Error('Wait for the component to mount before starting to add children.');
                            child = this.options.childFactory.createComponent(this.getWindow(), options, new RootComponentFacade(this.scheduleDisposeChild.bind(this)));
                            return [4 /*yield*/, child.initialize()];
                        case 1:
                            id = (_a.sent()).id;
                            this.children[id] = child;
                            return [4 /*yield*/, child.mount()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, id];
                    }
                });
            });
        };
        /**
         * Get the child with the given identifier.
         * @param id The child identifier.
         */
        RootComponent.prototype.getChild = function (id) {
            return id ? (this.children[id] || null) : null;
        };
        /**
         * Remove a child component.
         * @param id The child component identifier.
         */
        RootComponent.prototype.removeChild = function (id) {
            return this.disposeChild(id);
        };
        return RootComponent;
    }(Component));

    var __extends$e = (window && window.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Options for the root component.
     */
    var RootComponentOptions = /** @class */ (function (_super) {
        __extends$e(RootComponentOptions, _super);
        function RootComponentOptions() {
            var _this = _super.call(this) || this;
            _this.tag = 'script';
            _this.childFactory = new ChildComponentFactory();
            return _this;
        }
        return RootComponentOptions;
    }(ComponentOptions));

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
