import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Proper localStorage mock that actually stores data
const localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => localStorageStore[key] || null,
  setItem: (key: string, value: string) => {
    localStorageStore[key] = value;
  },
  removeItem: (key: string) => {
    delete localStorageStore[key];
  },
  clear: () => {
    Object.keys(localStorageStore).forEach(key => delete localStorageStore[key]);
  },
  key: (index: number) => Object.keys(localStorageStore)[index] || null,
  get length() {
    return Object.keys(localStorageStore).length;
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Proper IndexedDB mock that actually handles async operations
class MockIDBObjectStore {
  data: Record<string, any> = {};

  put(value: any) {
    this.data[value.id] = value;
    return {
      onsuccess: null as any,
      onerror: null as any,
      result: undefined,
    };
  }

  get(key: string) {
    const result = this.data[key] || null;
    return {
      onsuccess: null as any,
      onerror: null as any,
      result,
    };
  }
}

class MockIDBTransaction {
  stores: Record<string, MockIDBObjectStore> = { users: new MockIDBObjectStore() };

  objectStore(name: string) {
    return this.stores[name];
  }
}

class MockIDBDatabase {
  objectStoreNames = { contains: () => false };
  stores: Record<string, MockIDBObjectStore> = { users: new MockIDBObjectStore() };

  transaction(names: string[], mode: string) {
    return new MockIDBTransaction();
  }
}

const indexedDBMock = {
  open: vi.fn((dbName: string, version?: number) => {
    const db = new MockIDBDatabase();
    // Return a mock request object that immediately triggers success
    const request = {
      onerror: null as any,
      onsuccess: null as any,
      onupgradeneeded: null as any,
      result: db,
      error: null,
    };
    
    // Trigger success callback on next tick
    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess({ target: { result: db } } as any);
      }
      if (request.onupgradeneeded) {
        request.onupgradeneeded({ target: request } as any);
      }
    }, 0);
    
    return request;
  }),
};

Object.defineProperty(window, 'indexedDB', {
  value: indexedDBMock,
  writable: true,
});
