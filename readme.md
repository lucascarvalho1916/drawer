<h1 align="center">Drawer</h1>

<p align="center">
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-requisitos-funcionais">RFs (Requisitos funcionais)</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-regras-negocio">RNs (Regras de negócio)</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-requisitos-nao-funcionais">RNFs (Requisitos não-funcionais)</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licença">Licença</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=49AA26&labelColor=000000">
</p>

<br>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- Backend: NodeJS, Typescript, Fastify, Prisma
- Frontend: ReactJS, NextJS, TailwindCSS, Typescript

## 💻 Projeto

O Drawer é um projeto que possibilita a realização de sorteios para uma empresa específica.


## RFs (Requisitos funcionais)

- [x] Deve ser possível cadastrar colaboradores
- [x] Deve ser possível cadastrar um novo sorteio
- [x] Deve ser possível desativar um colaborador
- [x] Deve ser possível o cadastro de usuários administradores
- [x] Deve ser possível listar os sorteios por data
- [x] Deve ser possível listar cada sorteio que um mesmo CPF foi sorteado
- [x] Deve ser possível listar os sorteios atuais e trazer na tela inicial do app, como um formulário a ser preenchido

## RNs (Regras de negócio)

- [x] Não deve ser possível cadastrar o mesmo CPF para o mesmo sorteio
- [x] Não deve ser possível sortear o mesmo colaborador mais de uma vez no mesmo sorteio
- [x] Colaboradores e sorteios só podem ser cadastrados por usuários administradores

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas com 15 itens por página;
- [x] Todas as listas devem possibilitar filtros e ordenações personalizadas;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);

## :memo: Licença

Esse projeto está sob a licença MIT.

---