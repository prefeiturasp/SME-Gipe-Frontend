/**
 * Digita em um input que pode re-renderizar dinamicamente
 * @param {string} selector - Seletor CSS ou XPath do input
 * @param {string} valor - Valor a ser digitado
 * @param {boolean} isXpath - Se true, usa cy.xpath() em vez de cy.get()
 */
export function typeInput(selector, valor, isXpath = false) {
  const getInput = () => isXpath ? cy.xpath(selector, { timeout: 5000 }) : cy.get(selector, { timeout: 5000 });

  const typeRecursively = () => {
    getInput()
      .should('exist')
      .and('not.be.disabled')
      .then(($input) => {
        cy.wrap($input).clear({ force: true });
      });

    // Digita em uma segunda chamada separada para evitar quebra
    getInput().type(valor, { force: true }).then(
      () => {},
      () => {
        // Se falhar, tenta novamente
        typeRecursively();
      }
    );
  };

  typeRecursively();
}
