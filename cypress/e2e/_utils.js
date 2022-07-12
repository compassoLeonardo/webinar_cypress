//Biblioteca com dados randômicos
import faker from 'faker-br'

export function elm(name){
    return `[data-testid="${name}"]`
}

export const userToRegister = {
    name : faker.internet.userName(),
    email: faker.internet.email(),
    password : faker.internet.password(),
}