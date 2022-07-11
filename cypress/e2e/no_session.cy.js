import {el, userToRegister} from './_utils'

beforeEach('Deve logar antes de cada caso de teste', () => {
    cy.visit('http://front.serverest.dev/login')
    cy.get(el('email')).type('fulano@qa.com')
    cy.get(el('senha')).type('teste')
    cy.get(el('entrar')).click()
    cy.wait(2000)
})

it('Deve cadastrar um novo usuário administrador', () => {
    //Intercepto a rota /usuarios para aguardar a confirmação de cadastro
    //Preciso fazer isso pois o cadastro é feito em outra origin (https://serverest.dev)
    cy.intercept('POST', '/usuarios').as('cadastro')

    //Para utilizarmos o cy.session() em cada caso de teste devemos acessar uma URL dentro da aplicação.
    cy.visit('http://front.serverest.dev/admin/home')

    //Valido se o botão de cadastrar usuários é visível e clico nele.
    cy.get(el('cadastrar-usuarios')).should('be.visible').click()

    //Cadastro um novo usuário (gerado na pasta '_utils.js' com a biblioteca Faker)
    cy.get(el('nome')).type(userToRegister.name)
    cy.get(el('email')).type(userToRegister.email)
    cy.get(el('password')).type(userToRegister.password)

    //Marco a opção de administrador e clico no botão para cadastrar o usuário
    cy.get(el('checkbox')).click()
    cy.get(el('cadastrarUsuario')).click()

    //Indico a url(origem) onde será encontrado a requisição de cadastro
    cy.origin('https://serverest.dev', () => {
        //Espero o álias da interceptação para garantir o cadastro
        cy.wait('@cadastro').then( res => {
            cy.expect(res.response.body.message).to.be.eq('Cadastro realizado com sucesso')
        })
    })
})

it('Deve acessar a lista de usuários cadastrados e validar se userToRegister foi cadastrado', () => {
    //Valido se o botão de listar usuários é visível e clico nele.
    cy.get(el('listar-usuarios')).should('be.visible').click()

    //Valido a nova URL
    cy.url().should('contains', '/listarusuarios')

    //Valido se a primeira posição da lista de usuários é visível e se contém a propriedade 'text'
    cy.get('tbody > :nth-child(1) > :nth-child(1)').should('be.visible').and('have.a.property', 'text')

    //Crio um json onde vou copiar a lista de usuários
    const jsonPath = 'cypress/fixtures/lista_de_usuarios.json'
    cy.writeFile(jsonPath, {usuarios: []})

    /**Um looping que passa por cada nome da lista de usuários na aplicação
     * e salva esse nome no arquivo json da const jsonPath
    */
    cy.get('p.row').find('tr').then( elm => {
        for (var i = 1; i < elm.length; i++) {
            cy.get(`tbody > :nth-child(${i}) > :nth-child(1)`).invoke('text').then( text =>{
                cy.readFile(jsonPath).then(json => {
                  json.usuarios.push(text)
                  cy.writeFile(jsonPath, json)
                })               
            })
        }
    })

    //Busca o arquivo json e valida se userToRegister está presente na lista copiada
    cy.fixture('lista_de_usuarios.json').then( lista => {
        expect(lista.usuarios).to.contains(userToRegister.name)
    })
})


 