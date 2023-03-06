# Robô OLX

O que o robô este faz? Publica N anúncios para N usuários.

## Configuração

Seguem as configurações para utilização do robô (desenvolvido em Node.js com Puppeteer).

### Pré-requisitos:

- Instalar Node.js (+v16);
- Clonar o projeto
- Entrar no diretório
- Instalar as dependências com o comando `npm install`

### Passos para executar o robô

1. Renomear `dados/usuarios-exemplo.json` para `dados/usuarios.json` e definir seu email e senha.

2. Renomear `dados/anuncios-exemplo.json` para `dados/anucios.json`, modificando as informações conforme o anúncio desejado. Recomendo que abra a tela de criação de anúncios manualmente na OLX e navegue até as opções, copiando o nome das categorias e observando a posição das opções em cada combo.

3. Executar o projeto com o comando `npm start` e ver a mágica acontecer. Observação: Em caso de bloqueio no login, é necessária a interveção manual para utilização do link de acesso instantâneo. Outra opção é simplesmente executar novamente o robô colocando como ativo apenas os usuários ou anúncios que ainda não foram utilizados, pois o bloqueio da OLX é um tanto aleatório.


## Observações


### Bloqueio no Login

Se a OLX bloquear o login, aparecerá um link para acesso instantâneo.
É necessário abrir o e-mail, clicar no botão de ACESSO PELO SITE com o botão direito, copiar o link e colar na janela (prompt) aberta pelo robô e pressionar ENTER. O robô deve seguir o fluxo normalmente.
