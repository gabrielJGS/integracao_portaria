# Desafio Técnico Backend NodeJS

### Tarefas
- [X] Criar base
- [X] Docker
- [X] Criar DB/Tabelas
- [X] Rota [POST] /boletos Receber CSV/Importar(Atividade 1)
- [X] Conversão nome_unidade x nome_lote(Atividade 2)
- [] Separar PDF(Atividade 3)
- [X] Rota [GET] /boletos (Atividade 4)
- [X] Gerar relatório - Parâmetro relatorio=1 (Atividade 5)
- [X] Documentação
- [] Testes

**Desafio técnico de backend da Green Acesso.**

Crie um projeto em Javascript ou Typescript, utilizando NodeJS e banco de dados SQL (qualquer um) para fazer a importação de um `.csv`  e um `.pdf` para o nosso sistema e por fim a exportação de um `.pdf` .

Os pontos de análise do teste serão (na seguinte ordem de importância):

1. Capacidade de analisar o problema proposto e buscar uma solução efetiva;
2. Nível, organização e padronização do código escrito;
3. Nível técnico com banco de dados e integração no Node.

Após o teste na fase de entrevistas vamos analisar:

1. Capacidade de explicar o projeto da forma que foi feito;
2. Sua situação profissional atual para ver se encaixa com as expectativas da vaga;
3. Interesse na vaga.

**Queremos ver como você trabalha com:**

- Resolução de problemas;
- Arquivos;
- sequelize (ou outro);
- NodeJS;
- Javascript ou Typescrit (não faz diferença, qualquer um dos dois).

## Entender o problema

Em um condomínio de casas do brasil, denominado Condomínio Green Park, são utilizados 2 aplicativos, sendo um para o controle de acesso da portaria e o outro para o gerenciamento das taxas condominiais do financeiro. Após um tempo, o síndico percebeu que as pessoas estavam utilizando mais o aplicativo da Portaria que o aplicativo do Financeiro, por isso ele decidiu que iria exportar os boletos do financeiro e importar no aplicativo da Portaria.

Supondo que você trabalha na empresa que cuida do aplicativo da portaria, você será responsável por fazer um endpoint que irá receber essa importação em `.csv` e `.pdf` e passar os boletos do sistema financeiro para o sistema da portaria seguindo todas as instruções abaixo:

## Banco de dados

Em relação ao banco de dados você deve iniciar com apenas duas tabelas:

`lotes: Tabela que irá armazenar os lotes do condomínio`

`boletos: Tabela que irá armazenar os boletos importados.`

Apenas para te guiar vamos anotar os campos que poderiam conter nessa tabela:

```sql
CREATE TABLE lotes (
	id INT NOT NULL ...,
	nome VARCHAR(100),
	ativo BOOLEAN,
	criado_em TIMESTAMP ...
);

CREATE TABLE boletos (
	id INT NOT NULL ...,
	nome_sacado VARCHAR(255),
	id_lote INT NOT NULL // FOREIGN KEY com a tabela lotes,
	valor DECIMAL,
	linha_digitavel VARCHAR(255)
	ativo BOOLEAN,
	criado_em TIMESTAMP...
);
```

O arquivo `.csv` que o síndico te entregou para importação está no seguinte formato:

```sql
nome;unidade;valor;linha_digitavel
JOSE DA SILVA;17;182.54;123456123456123456
MARCOS ROBERTO;18;178.20;123456123456123456
MARCIA CARVALHO;19;128.00;123456123456123456
```

Nessa arquivo você tem as informações do nome do sacado, a unidade (lote) que ele habita, o valor do boleto e a linha digitável para pagamento.

## Atividade 1

O endpoint que você deve fazer irá receber um arquivo `.csv` , que é o que o síndico te enviou, então ele deve extrair os dados e importar na tabela `boletos`.

## Atividade 2

Porém temos um problema aqui, o dado que é solicitado na tabela boletos é o id da tabela `lotes`, dado esse que não vem no arquivo `.csv`, pois o outro sistema financeiro não sabe qual é a id do nosso sistema, e vice-versa. Por isso eles enviam o nome da unidade no formato deles, e nós temos o nome do lote no nosso formato.

Você deve arrumar alguma solução para fazer esse mapeamento para descobrir qual é a id do lote no nosso banco de dados e inserir no boleto. Para te instruir vamos adicionar um exemplo aqui.

```sql
Sistema Financeiro (Externo)

nome_unidade 
17
18
19

Sistema Portaria (Interno)

nome_lote   | id
0017        | 3
0018        | 6
0019        | 7
```

Você precisa construir uma forma então para descobrir que quando aparecer o nome **17** no `.csv` significa que você deve inserir a `id_lote = 3` e quando aparecer o nome **18** significa que você deve inserir a `id_lote = 6`.

Você não pode se basear na ordem do `.csv` para inserir os lotes, precisa obrigatoriamente fazer o mapeamento para descobrir qual lote no sistema externo corresponde ao lote no sistema interno.

## Atividade 3

Ao fim das atividade você terá os dados da seguinte maneira na sua tabela

```sql
boletos

id  | nome_sacado           | id_lote | valor   | linha_digitavel  | ...
1   | JOSE DA SILVA         | 3       | 182.54  | 123456123456123456 ...
2   | MARCOS ROBERTO        | 6       | 178.20  | 123456123456123456 ...
3   | MARCIA CARVALHO       | 7       | 128.00  | 123456123456123456 ...
```

Agora o síndico quer te enviar um arquivo PDF, que contém os boletos de cada pessoa em apenas **UM ARQUIVO PDF,** ou seja, dentro desse arquivo tem várias páginas que são os boletos de cada pessoa.

No nosso exemplo vamos supor que o síndico enviou os boletos ordenados de uma forma diferente no PDF:

```sql
pdf

1 PAGINA BOLETO MARCIA
2 PAGINA BOLETO JOSE
3 PAGINA BOLETO MARCOS
```

E ele te disse que sempre vai enviar os boletos nessa ordem FIXA, então você precisa arrumar uma forma de receber esses boletos na ordem correta para mapear eles com o registro equivalente da tabela de boletos. 

**OBS:** Você que será responsável por criar um PDF fake com alguns dados fictícios (pode ser apenas o nome da pessoa em cada página) e anexe esse PDF o projeto do git.

Agora você precisa construir um endpoint que receba esse pdf, e distribui eles em uma pasta do seu computador local, sendo que o nome do pdf gerado será o mesmo nome da id da tabela boletos. No nosso exemplo, o PDF seria desmembrado em 3 arquivos e ficariam na pasta da seguinte maneira.

```sql
pasta windows/mac

1.pdf // Seria o boleto do JOSE
2.pdf // Seria o boleto do MARCOS
3.pdf // Seria o boleto da MARCIA
```

## Atividade 4

Agora você precisa construir o endpoint para retornar todos os boletos existente no sistema. Você deve construir então os seguintes endpoints.

```sql
GET /boletos

# Podendo conter os seguintes filtros
GET /boletos?nome=JOSE&valor_inicial=100&valor_final=200&id_lote=2
```

## Atividade 5

E por fim, se passar o parâmetro `relatorio=1` o endpoint deve retornar um base64 que é um PDF com o relatório dos boletos. Nesse PDF deve conter uma tabela com as listas dos boletos que foram pedidos no relatório. Para isso você pode utilizar alguma biblioteca de extração de PDF do Node.

```json
# Podendo conter o relatório
GET /boletos?relatorio=1

{
	"base64": "9fj/..."
}

# O conteúdo do PDF seria esse:
id  | nome_sacado           | id_lote | valor   | linha_digitavel  | ...
1   | JOSE DA SILVA         | 3       | 182.54  | 123456123456123456 ...
2   | MARCOS ROBERTO        | 6       | 178.20  | 123456123456123456 ...
3   | MARCIA CARVALHO       | 7       | 128.00  | 123456123456123456 ...
```

**Sugestões de funcionalidades:**

- Utilizar uma tabela para organizar o mapeamento e a ordenação dos boletos ao mesmo tempo;

Você deve utilizar o git, descreva no README algo que achar pertinente e **não precisa publicar** o seu projeto, nós vamos executar na máquina local. **OBS: Você não vai ganhar pontos por publicar o projeto, deixe-o apenas no git.**

## Entrega

*ANTES DE FAZER O TESTE SE ATENTE AOS SEGUINTES PONTOS*

- O salário é entre 4 e 6 mil PJ;
- Filtramos dos 1.500 candidatos 260 para fazer o teste, pela quantidade de pessoas pode ser que *NÃO ENVIAREMOS* feedback construtivo para todos os que fizeram o teste;
- A vaga é focada exclusivamente em backend, o responsável não irá executar tarefas de front-end;
- Após o teste selecionaremos os últimos candidatos para a entrevista;
- É apenas *UMA* vaga;
- A vaga é para *PLENO (inicial, intermediário ou final)*, não recomendamos sêniors fazerem o teste pois o salário não é compatível;
- Não vamos aceitar testes enviados após o horário limite (mesmo que seja 1 minuto).

Por favor, **se o salário não estiver na sua margem**, ou você não quiser fazer o teste e poder não receber um feedback, ou não quer trabalhar com backend ***NAO APLIQUE PARA A VAGA*.**

Se quiser cancelar sua candidatura é só não enviar o teste.

Você *deve enviar o link do github (ou outro) e o link da coleção do Postman ou outro para importarmos e testar* para o seguinte formulário: https://forms.gle/Fi55mKj1YjhB52zF8

**Não vamos receber** o link por mensagem no Linkedin

Data de entrega do teste até: **15/07 (Sábado) (às 23:59hrs)**

Boa Sorte! Happy Coding!

# Framework:
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
