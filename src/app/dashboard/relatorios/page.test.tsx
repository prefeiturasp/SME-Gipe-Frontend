import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ExtracaoDadosPage from "./page";

vi.mock("@/components/dashboard/ExtracaoDados/FilterPanel", () => ({
    default: () => <div data-testid="filter-panel">FilterPanel</div>,
}));

vi.mock("@/assets/icons/Export", () => ({
    default: () => <svg data-testid="export-icon" />,
}));

describe("ExtracaoDadosPage", () => {
    it("deve renderizar o título da página", () => {
        render(<ExtracaoDadosPage />);
        expect(screen.getByText("Extração de dados")).toBeInTheDocument();
    });

    it("deve renderizar o subtítulo da página", () => {
        render(<ExtracaoDadosPage />);
        expect(
            screen.getByText(/confira todas as intercorrências/i),
        ).toBeInTheDocument();
    });

    it("deve renderizar o botão Exportar dados", () => {
        render(<ExtracaoDadosPage />);
        expect(
            screen.getByRole("button", { name: /exportar dados/i }),
        ).toBeInTheDocument();
    });

    it("deve renderizar o FilterPanel", () => {
        render(<ExtracaoDadosPage />);
        expect(screen.getByTestId("filter-panel")).toBeInTheDocument();
    });
});
