# Projeto Modelo de Todo

## Visão Geral
Este projeto é um modelo de dados simples para um aplicativo de Todo. Ele demonstra o uso de MongoDB com o driver TypeScript para construir um padrão de repositório que gerencia itens de Todo. O projeto inclui exemplos de conexão com o banco de dados e operações CRUD.

## Funcionalidades
- **CRUD**: Criação, leitura, atualização e exclusão de itens de Todo.
- **Padrão de projeto Repositório**: Encapsulamento de operações de banco de dados para melhor modularidade.

## Estrutura do Projeto
```
/workspaces/todo-model
├── package.json         # Dependências e scripts do projeto
├── tsconfig.json        # Configuração do TypeScript
├── src/                 # Código fonte
│   ├── config.ts        # Configuração da aplicação
│   ├── database.ts      # Conexão e gerenciamento do banco de dados
│   ├── demo.ts          # Demonstração dos métodos do repositório
│   ├── model.ts         # Implementação do repositório usando MongoDB
├── tests/               # Casos de teste (se aplicável)
└── .env                 # Variáveis de ambiente
```

## Pré-requisitos
- **Node.js**: Pré-instalado no contêiner de desenvolvimento.
- **npm**: Pré-instalado no contêiner de desenvolvimento.
- **TypeScript**: Pré-instalado no contêiner de desenvolvimento.
- **dotenv**: Para carregar variáveis de ambiente do arquivo `.env`.
- **MongoDB**: Uma instância do MongoDB em execução.

## Instruções de Configuração
1. Clone o repositório:
   ```bash
   git clone <repository-url>
   cd todo-model
   ```

2. Abra o projeto em um ambiente de contêiner:
   - **Docker local**: Certifique-se de que o Docker está instalado e em execução. Abra o projeto em um editor como o VS Code e escolha a opção "Reabrir no Contêiner".
   - **GitHub Codespaces**: Clique no botão "Code" no repositório do GitHub e selecione "Abrir no Codespace".

3. O ambiente do contêiner já terá todas as dependências instaladas, incluindo Node.js, npm e MongoDB. Não é necessário instalar nada manualmente.

4. Configure as variáveis de ambiente:
   Crie um arquivo `.env` no diretório raiz com o seguinte conteúdo:
   ```env
   MONGO_URI=mongodb://localhost:27017
   ```
   Caso você esteja usando um MongoDB remoto, substitua `localhost` pelo endereço do seu servidor MongoDB.

5. Execute o script de demonstração:
   ```bash
   npm start
   ```

## Arquivos Principais
### `src/config.ts`
Contém detalhes de configuração, como o nome do banco de dados e os nomes das coleções.

### `src/database.ts`
Gerencia a conexão com o banco de dados MongoDB. Inclui métodos para conectar, desconectar e recuperar a instância do banco de dados.

### `src/model.ts`
Implementa o padrão de repositório para gerenciar itens de Todo. Inclui métodos para operações CRUD.

### `src/demo.ts`
Demonstra o uso dos métodos do repositório, incluindo inserção, listagem, busca, atualização e remoção de itens de Todo.

## Uso
### Executando a Demonstração
O arquivo `demo.ts` demonstra a funcionalidade do repositório. Ele:
1. Conecta-se ao banco de dados.
2. Insere itens de Todo de exemplo.
3. Lista todos os itens de Todo.
4. Busca um item de Todo pelo ID.
5. Atualiza um item de Todo.
6. Remove um item de Todo pelo ID.

Primeiramente, garanta o que servidor MongoDB esteja ouvindo no endereço especificado no arquivo `.env`. Em seguida, execute o seguinte comando para compilar o TypeScript e executar a demonstração:

```bash
npm start
```

### Executando os Testes

Para executar os testes de integração do projeto, use o seguinte comando:

```bash
npm test
```

Isso executará todos os casos de teste usando o [Jest](https://jestjs.io/) e exibirá os resultados no terminal.

### Visão Geral do Uso das Classes `Database` e `TodoRepository`

#### Classe `Database`
A classe `Database` é responsável por gerenciar a conexão com o banco de dados MongoDB. Aqui está um exemplo básico de como utilizá-la:

```typescript
import { Database } from './src/database';
import config from './src/config';

const database = new Database(config);

async function main() {
    try {
        await database.connect();
        console.log('Conectado ao banco de dados');

        // Use `database.getDb()` para acessar a instância do MongoDB
        const db = database.getDb();
        console.log('Nome do banco de dados:', db.databaseName);
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    } finally {
        await database.disconnect();
        console.log('Conexão com o banco de dados encerrada');
    }
}

main();
```

#### Classe `TodoRepository`
A classe `TodoRepository` encapsula as operações CRUD para itens de Todo. Aqui está um exemplo de como utilizá-la:

```typescript
import { TodoRepository, TodoItem } from './src/model';
import { Database } from './src/database';
import config from './src/config';

const database = new Database(config);
const todoRepository = new TodoRepository(database);

async function main() {
    try {
        await database.connect();

        // Inserir um novo item de Todo
        const newTodo: TodoItem = {
            id: 0, // O ID será gerado automaticamente
            description: 'Aprender TypeScript',
            tags: ['typescript', 'programação'],
            deadline: '2025-12-31',
        };
        const insertedTodo = await todoRepository.insert(newTodo);
        console.log('Item inserido:', insertedTodo);

        // Listar todos os itens de Todo
        const allTodos = await todoRepository.listAll();
        console.log('Todos os itens:', allTodos);

        // Buscar um item pelo ID
        const foundTodo = await todoRepository.findById(insertedTodo.id);
        console.log('Item encontrado:', foundTodo);

        // Atualizar um item de Todo
        foundTodo.description = 'Aprender TypeScript Avançado';
        const updateResult = await todoRepository.update(foundTodo);
        console.log('Item atualizado:', updateResult);

        // Remover um item pelo ID
        const removeResult = await todoRepository.removeById(foundTodo.id);
        console.log('Item removido:', removeResult);
    } catch (error) {
        console.error('Erro ao manipular itens de Todo:', error);
    } finally {
        await database.disconnect();
    }
}

main();
```