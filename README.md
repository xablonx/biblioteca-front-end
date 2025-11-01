▶️ Como Iniciar a Aplicação
1. Garantir que o Backend Esteja Rodando

Antes de tudo, inicie o seu Backend Spring Boot. Ele deve estar acessível em http://localhost:8080.

2. Instalação de Dependências

Navegue até o diretório raiz do Frontend e instale todas as dependências:

Bash -> npm install

3. Execução do Servidor de Desenvolvimento (Com Proxy)

Inicie o servidor de desenvolvimento. O script start garantirá que o proxy seja ativado automaticamente, roteando suas chamadas /api para o Backend.

Bash -> npm run start

Este comando executa: ng serve --proxy-config proxy.conf.js

4. Acesso à Aplicação

O Frontend estará acessível no seu navegador, geralmente em: http://localhost:4200/
