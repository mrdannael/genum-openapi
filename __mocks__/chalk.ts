import { vi } from "vitest";

const chalk = {
  red: vi.fn().mockImplementation((text: string) => `RED(${text})`),
  // Add more methods as needed
};

export default chalk;
