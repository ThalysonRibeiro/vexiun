import "whatwg-fetch";

const originalConsoleError = console.error;
import util from "util";

console.error = (...args) => {
  const suppressedMessages = [
    "Erro na requisição: Error: Network error",
    "Received `true` for a non-boolean attribute `priority`",
    "A suspended resource finished loading inside a test, but the event was not wrapped in act",
    "A component suspended inside an `act` scope, but the `act` call was not awaited",
    "Erro ao enviar alerta de login:",
    "Erro ao verificar email:",
    "In HTML, <html> cannot be a child of <div>. This will cause a hydration error.",
    "Received `true` for a non-boolean attribute `fill`",
    "Invalid prop `max` of value `0` supplied to `Progress`. Only numbers greater than 0 are valid max values. Defaulting to `100`.",
    "React does not recognize the `handleSubmit` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `handlesubmit` instead. If you accidentally passed it from a parent component, remove it from the DOM element.",
    "Invalid value for prop `reset` on <div> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://react.dev/link/attribute-behavior",
    "React does not recognize the `formState` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `formstate` instead. If you accidentally passed it from a parent component, remove it from the DOM element."
  ];

  const formattedMessage = util.format(...args);
  const isSuppressed = suppressedMessages.some((msg) => formattedMessage.includes(msg));

  if (isSuppressed) {
    return;
  }

  originalConsoleError(...args);
};

import "@testing-library/jest-dom";
import "./src/test-utils/global-mocks.ts";
import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Polyfill for requestAnimationFrame
global.requestAnimationFrame = (cb: FrameRequestCallback) => {
  return setTimeout(cb, 0);
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

import "./src/test-utils/next-mocks.tsx";

import { prismaMock, mockReset } from "./src/test-utils/prisma-mock";

beforeEach(() => {
  mockReset(prismaMock);
});
