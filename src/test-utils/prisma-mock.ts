// src/test-utils/prisma-mock.ts

import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

export { mockReset };
