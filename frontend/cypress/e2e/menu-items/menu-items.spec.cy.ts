import { categories } from '../../mock/menu-items'

describe('Restaurant Page', () => {
  it('should display all menu items', () => {
    cy.intercept('GET', '/categories/restaurant/*', { body: categories }).as(
      'getAllCategories',
    )
    cy.visit('/restaurant/your-restaurant-id')
    cy.wait('@getAllCategories').its('response.statusCode').should('eq', 200)

    cy.get('.menu-item').should('have.length', 3)
  })

  it('should create a new menu item and display it', () => {
    cy.visit('/restaurant/admin/your-restaurant-id')

    cy.get('.add-menu-item-button').click()
    cy.get('#title').type('New Menu Item')
    cy.get('#description').type('Description of New Menu Item')
    cy.get('#price').type('20')
    cy.get('#quantity').type('2')
    cy.get('#category').click().type('{downarrow}{enter}')
    cy.get('.submit-button').click()

    cy.intercept('POST', '/menu', { body: { success: true } }).as(
      'createMenuItem',
    )

    cy.get('.menu-item').contains('New Menu Item').should('exist')
  })

  it('should edit an existing menu item and display the changes', () => {
    cy.visit('/restaurant/admin/your-restaurant-id')

    cy.get('.menu-item').first().click()
    cy.get('.edit-menu-item-button').first().click()
    cy.get('#title').clear().type('Updated Menu Item')
    cy.get('#description').clear().type('Description of updated Menu Item')
    cy.get('#price').clear().type('25')
    cy.get('#quantity').clear().type('10')
    cy.get('#category').click().type('{downarrow}{enter}')
    cy.get('.submit-button').click()

    cy.get('.menu-item').contains('Updated Menu Item').should('exist')
  })

  it('should delete an existing menu item and remove it from the screen', () => {
    cy.visit('/restaurant/admin/your-restaurant-id')

    cy.get('.add-menu-item-button').click()
    cy.get('#title').type('Delete menu item')
    cy.get('#description').type('Description of deleted menu item')
    cy.get('#price').type('20')
    cy.get('#quantity').type('2')
    cy.get('#category').click().type('{downarrow}{enter}')
    cy.get('.submit-button').click()

    cy.intercept('POST', '/menu', { body: { success: true } }).as(
      'createMenuItem',
    )

    cy.get('.menu-item').contains('Delete menu item').should('exist')

    cy.get('.delete-menu-item-button').last().click()

    cy.get('.confirm-delete-menu-item').click()

    cy.intercept('DELETE', '/menu/item/*', { body: { success: true } }).as(
      'deleteMenuItem',
    )
    cy.get('.menu-item').contains('Delete menu item').should('not.exist')
  })
})
