import { POST } from "./route";
import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Mock the cloudinary library
jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn()
    }
  }
}));

// Mock File.prototype.arrayBuffer
if (typeof File.prototype.arrayBuffer === "undefined") {
  (File.prototype as File).arrayBuffer = jest.fn(async function (this: File) {
    return new ArrayBuffer(this.size);
  });
}

describe("API Route: /api/image/upload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should upload an image and return the results", async () => {
    const formData = new FormData();
    const file = new File(["image data"], "test-image.png", { type: "image/png" });
    formData.append("file", file);
    formData.append("userId", "test-user-id");

    const mockRequest = new NextRequest("http://localhost/api/image/upload", {
      method: "POST",
      body: formData
    });

    const mockUploadStream = cloudinary.uploader.upload_stream as jest.Mock;
    mockUploadStream.mockImplementation((options, callback) => {
      callback(null, { secure_url: "http://example.com/image.png" });
      return { end: jest.fn() };
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({ secure_url: "http://example.com/image.png" });
    expect(mockUploadStream).toHaveBeenCalledWith(
      { tags: ["test-user-id"], public_id: "test-image.png" },
      expect.any(Function)
    );
  });

  it("should return 401 if userId is not provided", async () => {
    const formData = new FormData();
    const file = new File(["image data"], "test-image.png", { type: "image/png" });
    formData.append("file", file);

    const mockRequest = new NextRequest("http://localhost/api/image/upload", {
      method: "POST",
      body: formData
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(401);
    expect(responseBody).toEqual({ error: "Falha ao alterar imagem." });
    expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
  });

  it("should return 401 for invalid image format", async () => {
    const formData = new FormData();
    const file = new File(["not an image"], "test.txt", { type: "text/plain" });
    formData.append("file", file);
    formData.append("userId", "test-user-id");

    const mockRequest = new NextRequest("http://localhost/api/image/upload", {
      method: "POST",
      body: formData
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(401);
    expect(responseBody).toEqual({ error: "Formato de imagem inválido." });
    expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
  });

  it("should handle cloudinary upload error", async () => {
    const formData = new FormData();
    const file = new File(["image data"], "test-image.jpeg", { type: "image/jpeg" });
    formData.append("file", file);
    formData.append("userId", "test-user-id");

    const mockRequest = new NextRequest("http://localhost/api/image/upload", {
      method: "POST",
      body: formData
    });

    const mockUploadStream = cloudinary.uploader.upload_stream as jest.Mock;
    mockUploadStream.mockImplementation((options, callback) => {
      callback(new Error("Upload failed"), null);
      return { end: jest.fn() };
    });

    // We need to wrap the call in a try/catch because it"s expected to reject
    await expect(POST(mockRequest)).rejects.toThrow("Upload failed");

    expect(mockUploadStream).toHaveBeenCalled();
  });
});
