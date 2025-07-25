
// Browser polyfills for Node.js modules
import { Buffer } from 'buffer';

// Make Buffer global
if (typeof globalThis !== 'undefined') {
  globalThis.Buffer = Buffer;
} else if (typeof global !== 'undefined') {
  global.Buffer = Buffer;
} else if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Make process global
if (typeof process === 'undefined') {
  if (typeof globalThis !== 'undefined') {
    globalThis.process = require('process/browser');
  } else if (typeof global !== 'undefined') {
    global.process = require('process/browser');
  } else if (typeof window !== 'undefined') {
    window.process = require('process/browser');
  }
}

// Suppress recharts/redux warnings in development
if (process.env.NODE_ENV === 'development') {
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (
      typeof message === 'string' && (
        message.includes('execOptions.factory.call') ||
        message.includes('@reduxjs/toolkit') ||
        message.includes('process/browser') ||
        message.includes('buffer')
      )
    ) {
      return; // Suppress specific warnings
    }
    originalConsoleWarn.apply(console, args);
  };
}
