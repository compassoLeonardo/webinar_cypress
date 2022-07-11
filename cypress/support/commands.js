// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginSession', () => {

    cy.intercept('POST', '/login').as('login')

    const user = 'fulano@qa.com'
    const password = 'teste'

    cy.session([user, password], () => {
        cy.visit('http://front.serverest.dev/login')
        cy.get('[data-testid="email"]').type(user)
        cy.get('[data-testid="senha"]').type(password)
        cy.get('[data-testid="entrar"]').click()

        cy.origin('https://serverest.dev', () => {
            cy.wait('@login')
        })
    }) 
})

