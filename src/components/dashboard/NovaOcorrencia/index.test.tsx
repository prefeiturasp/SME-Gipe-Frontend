import React from "react";
import { render, screen } from "@testing-library/react";
import NovaOcorrencia from "./index";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));

describe("NovaOcorrencia", () => {
    it("deve renderizar o PageHeader com o título correto", () => {
        render(<NovaOcorrencia />);
        const heading = screen.getByRole("heading", {
            name: /Nova ocorrência/i,
        });
        expect(heading).toBeInTheDocument();
    });

    it("deve renderizar o Stepper com os passos corretos", () => {
        render(<NovaOcorrencia />);
        expect(screen.getByText("Cadastro de ocorrência")).toBeInTheDocument();
        expect(screen.getByText("Fase 02")).toBeInTheDocument();
        expect(screen.getByText("Fase 03")).toBeInTheDocument();
        expect(screen.getByText("Anexos")).toBeInTheDocument();
    });
});
