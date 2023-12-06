## RFs (Requisitos funcionais)

- [x] Deve ser possível cadastrar colaboradores
- [ ] Deve ser possível importar colaboradores
- [x] Deve ser possível cadastrar um novo sorteio
- [ ] Deve ser possível desativar um colaborador
- [ ] Deve ser possível o cadastro de usuários administradores
- [ ] Deve ser possível listar os sorteios por data
- [ ] Deve ser possível listar cada sorteio que um mesmo CPF foi sorteado
- [ ] Deve ser possível listar os sorteios atuais e trazer na tela inicial do app, como um formulário a ser preenchido

## RNs (Regras de negócio)

- [ ] Não deve ser possível cadastrar o mesmo CPF para o mesmo sorteio
- [x] Não deve ser possível sortear o mesmo colaborador mais de uma vez no mesmo sorteio
- [ ] Colaboradores e sorteios só podem ser cadastrados por usuários administradores

## RNFs (Requisitos não-funcionais)

- [ ] A senha do usuário precisa estar criptografada;
- [ ] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [ ] Todas listas de dados precisam estar paginadas com 15 itens por página;
- [ ] Todas as listas devem possibilitar filtros e ordenações personalizadas;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);