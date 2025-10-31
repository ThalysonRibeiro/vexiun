// Add global mocks for Next.js specific functions
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  redirect: jest.fn()
}));

jest.mock("../lib/getSession", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve(null)) // Mock getSession to return null by default
}));

// More robust mock for next/image that explicitly filters Next.js specific props
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    const { src, alt, width, height, priority, layout, objectFit, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} {...rest} />;
  }
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200
    }))
  },
  NextRequest: jest.fn((input, init) => ({
    url: input,
    headers: new Headers(init?.headers),
    method: init?.method || "GET",
    json: async () => (init?.body ? JSON.parse(init.body as string) : {}),
    formData: async () => init?.body
  }))
}));
