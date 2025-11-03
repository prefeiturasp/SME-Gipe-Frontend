import { vi } from "vitest";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));
