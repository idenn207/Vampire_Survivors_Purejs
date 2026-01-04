/**
 * @fileoverview Debug Logger - Console capture singleton for debugging
 */

const MAX_ENTRIES = 200;
let _instance = null;

class DebugLogger {
  constructor() {
    this._entries = [];
    this._originalConsole = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console)
    };
    this._isCapturing = false;
    this._onEntryCallback = null;
  }

  startCapturing() {
    if (this._isCapturing) return;
    this._isCapturing = true;

    const self = this;

    // Override console methods
    console.log = function(...args) {
      self._addEntry('log', args);
      self._originalConsole.log.apply(console, args);
    };

    console.warn = function(...args) {
      self._addEntry('warn', args);
      self._originalConsole.warn.apply(console, args);
    };

    console.error = function(...args) {
      self._addEntry('error', args);
      self._originalConsole.error.apply(console, args);
    };

    console.info = function(...args) {
      self._addEntry('info', args);
      self._originalConsole.info.apply(console, args);
    };

    // Capture window errors
    window.addEventListener('error', (event) => {
      self._addEntry('error', ['Uncaught Error: ' + event.message, 'at', event.filename + ':' + event.lineno]);
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      self._addEntry('error', ['Unhandled Promise Rejection:', event.reason]);
    });
  }

  stopCapturing() {
    if (!this._isCapturing) return;
    this._isCapturing = false;

    // Restore original console methods
    console.log = this._originalConsole.log;
    console.warn = this._originalConsole.warn;
    console.error = this._originalConsole.error;
    console.info = this._originalConsole.info;
  }

  _addEntry(level, args) {
    const entry = {
      timestamp: new Date(),
      level: level,
      message: args.map((arg) => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ')
    };

    this._entries.push(entry);

    // Trim to max entries
    if (this._entries.length > MAX_ENTRIES) {
      this._entries = this._entries.slice(-MAX_ENTRIES);
    }

    // Trigger callback
    if (this._onEntryCallback) {
      this._onEntryCallback(entry);
    }
  }

  addEventEntry(eventName, data) {
    const entry = {
      timestamp: new Date(),
      level: 'event',
      message: '[EVENT] ' + eventName + (data ? ' - ' + JSON.stringify(data).substring(0, 100) : '')
    };

    this._entries.push(entry);

    if (this._entries.length > MAX_ENTRIES) {
      this._entries = this._entries.slice(-MAX_ENTRIES);
    }

    if (this._onEntryCallback) {
      this._onEntryCallback(entry);
    }
  }

  onEntry(callback) {
    this._onEntryCallback = callback;
  }

  getEntries() {
    return this._entries.slice();
  }

  clear() {
    this._entries = [];
  }

  getFormattedReport() {
    return this._entries.map((entry) => {
      const time = entry.timestamp.toLocaleTimeString();
      return '[' + time + '] [' + entry.level.toUpperCase() + '] ' + entry.message;
    }).join('\n');
  }

  // Singleton accessor
  static getInstance() {
    if (!_instance) {
      _instance = new DebugLogger();
    }
    return _instance;
  }
}

export { DebugLogger };
export default DebugLogger;
