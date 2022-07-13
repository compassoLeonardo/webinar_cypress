Cypress.Commands.add('loginSession', () => {

    cy.intercept('POST', '/login').as('login')
    cy.intercept('GET', '/usuarios').as('usuarios')

    const user = 'fulano@qa.com'
    const password = 'teste'

    cy.session([user, password], () => {
        cy.visit('http://front.serverest.dev/login')
        cy.get('[data-testid="email"]').type(user)
        cy.get('[data-testid="senha"]').type(password)
        cy.get('[data-testid="entrar"]').click()

        cy.origin('https://serverest.dev', () => {
            cy.wait('@usuarios')
            cy.wait('@login')
        })
    }) 
})

