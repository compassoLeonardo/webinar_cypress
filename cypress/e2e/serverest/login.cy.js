/// <reference types="cypress" />

describe('Testes sobre a aplicação front.serverest.dev', () => {
    before('Realizar login na aplicação',() => {
      const INP_EMAIL = 'data-testid=email'
      const INP_SENHA = 'data-testid=senha'
      const BTN_ENTRAR = 'data-testid=entrar'

      cy.visit('http://front.serverest.dev/login')

      cy.get(INP_EMAIL).type('fulano@qa.com')
      cy.get(INP_SENHA).type('teste')
      cy.get(BTN_ENTRAR).click()

    })
  
    it('Deve validar o usuário cadastrado na lista de usuários', () => {
      cy.log('Deve validar o usuário cadastrado na lista de usuários')
    })
  
  })
  