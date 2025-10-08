import { renderHook, act } from "@testing-library/react"
import { useMobile, getDeviceInfo } from "../use-mobile"

describe("useMobile", () => {
  // Salvar valores originais
  const originalInnerWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth')

  beforeEach(() => {
    // Mock do window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  afterEach(() => {
    // Restaurar valores originais
    if (originalInnerWidth) {
      Object.defineProperty(window, 'innerWidth', originalInnerWidth)
    }
  })

  it("should return true if window width is less than 768", () => {
    // Definir largura menor que 768
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(true)
  })

  it("should return false if window width is 768 or greater", () => {
    // Definir largura maior ou igual a 768
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    })

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(false)
  })

  it("should update on window resize", () => {
    // Começar com largura maior
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    })

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(false)

    act(() => {
      // Mudar para largura menor
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      })
      // Disparar evento de resize
      window.dispatchEvent(new Event("resize"))
    })

    expect(result.current).toBe(true)
  })
})

describe("getDeviceInfo", () => {
  const originalWindow = global.window
  const originalNavigator = global.navigator
  const originalScreen = global.screen

  afterEach(() => {
    global.window = originalWindow
    global.navigator = originalNavigator
    global.screen = originalScreen
  })

  it("should return unknown info when window is not defined", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.window

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore  
    delete global.navigator

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.screen

    const deviceInfo = getDeviceInfo()
    expect(deviceInfo.userAgent).toBe("Desconhecido")
    expect(deviceInfo.platform).toBe("Desconhecido")
    expect(deviceInfo.screenResolution).toBe("Desconhecido")
    expect(deviceInfo.language).toBe("pt-BR")
    expect(deviceInfo.timezone).toBe("America/Sao_Paulo")
  })

  it("should return device info from window object for mobile", () => {
    // Mock do navigator para iPhone/Safari
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
        platform: "iPhone",
        language: "en-US",
      },
      writable: true,
      configurable: true,
    })

    // Mock do screen
    Object.defineProperty(global, "screen", {
      value: {
        width: 375,
        height: 812,
      },
      writable: true,
      configurable: true,
    })

    const deviceInfo = getDeviceInfo()
    expect(deviceInfo.userAgent).toBe("Safari em Mobile")
    expect(deviceInfo.platform).toBe("iPhone")
    expect(deviceInfo.language).toBe("en-US")
    expect(deviceInfo.screenResolution).toBe("375x812")
    expect(deviceInfo.timezone).toBe("America/Sao_Paulo")
  })

  it("should correctly identify a tablet device", () => {
    // Mock do navigator para iPad/Chrome
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent:
          "Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/83.0.4103.88 Mobile/15E148 Safari/604.1",
        platform: "iPad",
        language: "en-US",
      },
      writable: true,
      configurable: true,
    })

    // Mock do screen para tablet
    Object.defineProperty(global, "screen", {
      value: {
        width: 768,
        height: 1024,
      },
      writable: true,
      configurable: true,
    })

    const deviceInfo = getDeviceInfo()
    expect(deviceInfo.userAgent).toBe("Chrome em Tablet")
    expect(deviceInfo.platform).toBe("iPad")
    expect(deviceInfo.language).toBe("en-US")
  })

  it("should correctly identify Opera browser", () => {
    // Mock do navigator para Opera
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99",
        platform: "Win32",
        language: "en-US",
      },
      writable: true,
      configurable: true,
    })

    // Mock do screen para Workspace
    Object.defineProperty(global, "screen", {
      value: {
        width: 1920,
        height: 1080,
      },
      writable: true,
      configurable: true,
    })

    const deviceInfo = getDeviceInfo()
    expect(deviceInfo.userAgent).toBe("Opera em Workspace")
    expect(deviceInfo.platform).toBe("Win32")
    expect(deviceInfo.language).toBe("en-US")
  })

  it("should correctly identify Chrome browser on Workspace", () => {
    // Mock do navigator para Chrome Workspace
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        platform: "Win32",
        language: "pt-BR",
      },
      writable: true,
      configurable: true,
    })

    Object.defineProperty(global, "screen", {
      value: {
        width: 1366,
        height: 768,
      },
      writable: true,
      configurable: true,
    })

    const deviceInfo = getDeviceInfo()
    expect(deviceInfo.userAgent).toBe("Chrome em Workspace")
    expect(deviceInfo.platform).toBe("Win32")
    expect(deviceInfo.language).toBe("pt-BR")
  })

  it("should correctly identify Firefox browser", () => {
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        platform: "Win32",
        language: "pt-BR",
      },
      writable: true,
      configurable: true,
    })

    Object.defineProperty(global, "screen", {
      value: {
        width: 1920,
        height: 1080,
      },
      writable: true,
      configurable: true,
    })

    const deviceInfo = getDeviceInfo()
    expect(deviceInfo.userAgent).toBe("Firefox em Workspace")
  })
})