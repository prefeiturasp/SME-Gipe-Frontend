/**
 * Mocka uma requisição POST e retorna sucesso sem disparar ação real
 * @param {string} url - URL da requisição que será interceptada
 * @param {string} alias - Alias para usar no cy.wait
 * @param {object} responseBody - Corpo da resposta simulada
 */
export function mockPostRequest(url, alias, responseBody = { success: true, message: 'Simulação realizada com sucesso' }) {
  cy.intercept('POST', url, {
    statusCode: 200,
    body: ["$@1", responseBody]
  }).as(alias);
}
