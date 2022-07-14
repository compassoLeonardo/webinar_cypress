import {elm, userToRegister} from './_utils'

beforeEach('Deve logar utilizando o cy.session()', () => {
    //Este comando está implementado no caminho 'cypress/support/commands.js'
    cy.loginSession()
})

it('Deve cadastrar um novo usuário administrador', () => {

    //Intercepto a rota /usuarios para aguardar a confirmação de cadastro
    //Preciso fazer isso pois o cadastro é feito em outra origin (https://serverest.dev)
    cy.intercept('POST', '/usuarios').as('cadastro')

    //Para utilizarmos o cy.session() em cada caso de teste devemos acessar uma URL dentro da aplicação.
    cy.visit('http://front.serverest.dev/admin/home')

    //Valido se o botão de cadastrar usuários é visível e clico nele.
    cy.get(elm('cadastrar-usuarios')).should('be.visible').click()

    //Cadastro um novo usuário (gerado na pasta '_utils.js' com a biblioteca Faker)
    cy.get(elm('nome')).type(userToRegister.name)
    cy.get(elm('email')).type(userToRegister.email)
    cy.get(elm('password')).type(userToRegister.password)

    //Marco a opção de administrador e clico no botão para cadastrar o usuário
    cy.get(elm('checkbox')).click()
    cy.get(elm('cadastrarUsuario')).click()

    //Indico a url(origem) onde será encontrado a requisição de cadastro
    cy.origin('https://serverest.dev', () => {
        //Espero o álias da interceptação para garantir o cadastro
        cy.wait('@cadastro').then( res => {
            cy.expect(res.response.body.message).to.be.eq('Cadastro realizado com sucesso')
        })
    })
})

it('Deve salvar a lista de usuários cadastrados e validar se userToRegister foi cadastrado', () => {

    //Para utilizarmos o cy.session() em cada caso de teste devemos acessar uma URL dentro da aplicação.
    cy.visit('http://front.serverest.dev/admin/home')

    //Valido se o botão de listar usuários é visível e clico nele.
    cy.get(elm('listar-usuarios')).should('be.visible').click()

    //Valido a nova URL
    cy.url().should('contains', '/listarusuarios')

    //Valido se a primeira posição da lista de usuários é visível e se contém a propriedade 'text'
    cy.get('tbody > :nth-child(1) > :nth-child(1)').should('be.visible').and('have.a.property', 'text')

    //Crio um arquivo json com a função cy.writeFile(), onde vou copiar a lista de usuários mostrada no front
    const jsonPath = 'cypress/fixtures/lista_de_usuarios.json'
    cy.writeFile(jsonPath, {usuarios: []})

    /**A lógica abaixo é de um looping que passa por cada nome da lista de usuários na aplicação
     * e salva esse nome em uma lista no arquivo json da const jsonPath [linha 52]
    */

    //p.row armazena toda a lista de usuários, elm recebe todas as linhas
    cy.get('p.row').find('tr').then( elm => {
        //Este 'for' itera por todas as linhas da tabela de usuários cadastrados
        for (var i = 1; i < elm.length; i++) {
            //tbody > :nth-child(${i}) > :nth-child(1) - trata-se do seletor de cada nome na lista
            //Utilizo a função invoke para trazer o texto do campo da tabela
            cy.get(`tbody > :nth-child(${i}) > :nth-child(1)`).invoke('text').then( text =>{
                //Para cada nome na lista eu leio novamente o arquivo json
                cy.readFile(jsonPath).then(json => {
                  //Escrevo o nome encontrado na tabela em uma lista chamada usuarios dentro do arquivo json
                  json.usuarios.push(text)
                  //Salvo as alterações
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
