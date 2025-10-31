// src/test-utils/global-mocks.ts

// Mock global fetch
export const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock sessionStorage
export const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock
});

Object.defineProperty(global, "Intl", {
  value: {
    ...global.Intl,
    DateTimeFormat: jest.fn(() => ({
      resolvedOptions: () => ({ timeZone: "America/Sao_Paulo" })
    }))
  },
  writable: true
});

// Mock do matchMedia se necessário
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Mock do ResizeObserver se necessário
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock do IntersectionObserver se necessário
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));
