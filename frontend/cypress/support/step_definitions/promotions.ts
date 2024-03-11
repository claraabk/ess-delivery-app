import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const product1Id = "0237802178590347";
const product2Id = "9239423230094129";
const promotionId = "9181244520";

Given('Eu estou logado como administrador do estabelecimento "Bodega do Matheus" de ID "414250"', () => {});

And('Eu estou na página de promoções', () => {
  cy.visit('/promotions');
});

When('Eu clico em "Adicionar Nova Promoção"', () => {
  cy.get('.add-promotion-button').click();
});

And('Eu seleciono o produto "Hambúrguer" de ID "0237802178590347"', () => {
  cy.get(`#${product1Id}`).check();
});

And('Eu seleciono o produto "Coca-Cola 350 mL" de ID "9239423230094129"', () => {
  cy.get(`#${product2Id}`).check();
});

And('Eu defino o valor do desconto como "10%"', () => {
  cy.get('.discount-input').type('10%');
});

And('Eu cadastro a promoção', () => {
  cy.get('.submit-promotion-button').click();
});

Then('Eu recebo uma mensagem de confirmação', () => {
  cy.contains('Promoção cadastrada com sucesso').should('exist');
});

And('Eu vejo que a promoção foi cadastrada com ID "9181244520"', () => {
  cy.get('.promotion-id').should('contain', promotionId);
});

Given('Eu estou logado como administrador do estabelecimento "Bodega do Matheus" de ID "414250"', () => {});

And('Eu estou na página de promoções', () => {
  cy.visit('/promotions');
});

And('Eu quero remover a promoção de ID "9181244520"', () => {});

When('Eu clico em "Remover Promoção"', () => {
  cy.get('.remove-promotion-button').click();
});

And('Eu seleciono a promoção com ID "9181244520"', () => {
  cy.get(`#${promotionId}`).check();
});

And('Eu confirmo a remoção', () => {
  cy.get('.confirm-remove-button').click();
});

Then('Eu recebo uma mensagem de confirmação', () => {
  cy.contains('Promoção removida com sucesso').should('exist');
});

And('Eu vejo que a promoção de ID "9181244520" foi removida', () => {
  cy.get('.promotion-id').should('not.contain', promotionId);
});

Given('Eu estou logado como administrador do estabelecimento "Bodega do Matheus" de ID "414250"', () => {});

And('Eu estou na página de promoções', () => {
  cy.visit('/promotions');
});

And('Eu quero modificar a promoção de ID "9181244520"', () => {});

When('Eu clico em "Modificar Promoção"', () => {
  cy.get('.modify-promotion-button').click();
});

And('Eu seleciono a promoção com ID "9181244520"', () => {
  cy.get(`#${promotionId}`).check();
});

And('Eu atualizo o valor do desconto para "15%"', () => {
  cy.get('.discount-input').clear().type('15%');
});

And('Eu confirmo as alterações', () => {
  cy.get('.confirm-modify-button').click();
});

Then('Eu recebo uma mensagem de confirmação', () => {
  cy.contains('Promoção modificada com sucesso').should('exist');
});

And('Eu vejo que a promoção de ID "9181244520" foi modificada', () => {
  cy.get('.promotion-id').should('contain', promotionId);
  cy.get('.discount-value').should('contain', '15%');
});