import { render, screen } from "@testing-library/react";

import ListaDeUnidadesEducacionais from ".";

function renderListaDeUnidadesEducacionais(
    status: "ativas" | "inativas" = "ativas"
) {
    return render(<ListaDeUnidadesEducacionais status={status} />);
}

describe("ListaDeUnidadesEducacionais", () => {
    it("deve renderizar o componente com status 'ativas'", () => {
        renderListaDeUnidadesEducacionais("ativas");

        expect(
            screen.getByText("Exibindo o status: ativas")
        ).toBeInTheDocument();
        expect(screen.getByTestId("tabela-unidades")).toBeInTheDocument();
    });

    it("deve renderizar o componente com status 'inativas'", () => {
        renderListaDeUnidadesEducacionais("inativas");

        expect(
            screen.getByText("Exibindo o status: inativas")
        ).toBeInTheDocument();
        expect(screen.getByTestId("tabela-unidades")).toBeInTheDocument();
    });
});
