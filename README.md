# Carrera Kart API

API REST para sistema de classificação do campeonato Carrera Kart, desenvolvida com Node.js, TypeScript, Express e MongoDB.

## 🚀 Deploy no Vercel

### Pré-requisitos
- Conta no [MongoDB Atlas](https://cloud.mongodb.com/)
- Conta no [Vercel](https://vercel.com/)
- Repositório no GitHub

### Variáveis de Ambiente no Vercel

Configure estas variáveis no dashboard do Vercel:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/carrera-kart
JWT_SECRET=sua_chave_jwt_super_segura_com_pelo_menos_32_caracteres
JWT_EXPIRE=365d
ADMIN_NAME=Admin Carrera Kart
ADMIN_EMAIL=admin@carrerakart.com.br
ADMIN_PASSWORD=sua_senha_admin_segura
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=https://carrerakart.netlify.app
```

## 🚀 Funcionalidades

- **Autenticação JWT** com middleware de autorização
- **CRUD de Usuários** com diferentes roles (ADMIN/USER)
- **CRUD de Classificações** por categoria com ranking automático
- **Sistema de Categorias**: Premium, Ouro, A, B, C, D, E, F
- **Leaderboard** completo e por categoria
- **Validação** robusta com Joi
- **Rate Limiting** e segurança com Helmet
- **Logging** com Morgan
- **Tratamento de Erros** centralizado

## 🛠️ Tecnologias

- **Node.js** + **TypeScript**
- **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** para autenticação
- **Joi** para validação
- **Jest** para testes
- **Docker** (opcional)

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MongoDB (local ou Atlas)
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd carrera-kart-api
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/carrera-kart
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
ADMIN_NAME=Admin Carrera Kart
ADMIN_EMAIL=admincarrerakart@carrerakart.com.br
ADMIN_PASSWORD=12345678
```

4. **Execute o projeto:**

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm run build
npm start
```

## 📚 Documentação da API

### Usuário Admin Padrão
- **Email:** admincarrerakart@carrerakart.com.br
- **Senha:** 12345678
- **Role:** ADMIN

### Endpoints

#### Autenticação
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "admincarrerakart@carrerakart.com.br",
  "password": "12345678"
}
```

#### Usuários

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| POST | `/api/v1/users/login` | Login | ❌ | - |
| GET | `/api/v1/users/profile` | Perfil do usuário | ✅ | ANY |
| PUT | `/api/v1/users/profile` | Atualizar perfil | ✅ | ANY |
| POST | `/api/v1/users` | Criar usuário | ✅ | ADMIN |
| GET | `/api/v1/users` | Listar usuários | ✅ | ADMIN |
| GET | `/api/v1/users/:id` | Buscar usuário | ✅ | ADMIN |
| PUT | `/api/v1/users/:id` | Atualizar usuário | ✅ | ADMIN |
| DELETE | `/api/v1/users/:id` | Deletar usuário | ✅ | ADMIN |

#### Classificações

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/v1/classifications` | Listar classificações | ❌ | - |
| GET | `/api/v1/classifications/leaderboard` | Leaderboard geral | ❌ | - |
| GET | `/api/v1/classifications/category/:category` | Por categoria | ❌ | - |
| GET | `/api/v1/classifications/:id` | Buscar classificação | ❌ | - |
| POST | `/api/v1/classifications` | Criar classificação | ✅ | ADMIN |
| PUT | `/api/v1/classifications/bulk` | **Atualização em lote** | ✅ | ADMIN |
| PUT | `/api/v1/classifications/:id` | Atualizar classificação | ✅ | ADMIN |
| DELETE | `/api/v1/classifications/:id` | Deletar classificação | ✅ | ADMIN |

#### Horários de Funcionamento

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/v1/operating-hours` | Listar todos os horários agrupados | ❌ | - |
| GET | `/api/v1/operating-hours/visible` | Horários visíveis agrupados | ❌ | - |
| GET | `/api/v1/operating-hours/group/:group` | Por grupo (header/footer) | ❌ | - |
| GET | `/api/v1/operating-hours/:id` | Buscar horário | ❌ | - |
| PUT | `/api/v1/operating-hours/:id` | Atualizar horário | ✅ | ADMIN |
| PUT | `/api/v1/operating-hours/bulk-update` | **Atualização em lote** | ✅ | ADMIN |
| PATCH | `/api/v1/operating-hours/:id/visibility` | Alternar visibilidade | ✅ | ADMIN |

### Exemplos de Uso

#### 1. Login
```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admincarrerakart@carrerakart.com.br",
    "password": "12345678"
  }'
```

#### 2. Criar Classificação
```bash
curl -X POST http://localhost:3000/api/v1/classifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category": "PREMIUM",
    "driverName": "João Silva",
    "points": 250
  }'
```

#### 3. Buscar Leaderboard
```bash
curl http://localhost:3000/api/v1/classifications/leaderboard
```

#### 4. Atualização em Lote (Bulk Update) - NOVO!
```bash
curl -X PUT http://localhost:3000/api/v1/classifications/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "classifications": [
      {
        "_id": "existing_id_1",
        "category": "PREMIUM",
        "driverName": "João Silva",
        "points": 350
      },
      {
        "category": "PREMIUM", 
        "driverName": "Novo Corredor",
        "points": 200
      }
    ]
  }'
```

Este endpoint:
- **Remove** classificações que existem no banco mas não estão no array
- **Adiciona** classificações sem _id 
- **Atualiza** classificações com _id existente

#### 5. Horários de Funcionamento - Todos os Horários Agrupados
```bash
curl http://localhost:3000/api/v1/operating-hours
```

Retorna estrutura agrupada por header (2 slots) e footer (7 slots):
```json
{
  "success": true,
  "data": {
    "header": [
      {
        "_id": "...",
        "group": "header",
        "slot": 1,
        "label": "Segunda a Sexta: 18h às 23h",
        "visible": true,
        "createdAt": "...",
        "updatedAt": "..."
      },
      {
        "_id": "...",
        "group": "header",
        "slot": 2,
        "label": "Finais de Semana: 14h às 23h",
        "visible": true,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "footer": [
      {
        "_id": "...",
        "group": "footer",
        "slot": 1,
        "label": "Segunda-feira: 18h às 23h",
        "visible": true,
        "createdAt": "...",
        "updatedAt": "..."
      }
      // ... mais 6 slots do footer
    ]
  }
}
```

#### 6. Horários de Funcionamento - Apenas Visíveis
```bash
curl http://localhost:3000/api/v1/operating-hours/visible
```

#### 7. Atualizar um Horário de Funcionamento
```bash
curl -X PUT http://localhost:3000/api/v1/operating-hours/OPERATING_HOUR_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "label": "Segunda a Sexta: 19h às 00h",
    "visible": false
  }'
```

#### 8. Atualização em Lote - Horários de Funcionamento
```bash
curl -X PUT http://localhost:3000/api/v1/operating-hours/bulk-update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "operatingHours": [
      {
        "id": "HEADER_SLOT_1_ID",
        "label": "Segunda a Sexta: 19h às 00h",
        "visible": true
      },
      {
        "id": "HEADER_SLOT_2_ID",
        "label": "Finais de Semana: 15h às 00h",
        "visible": true
      },
      {
        "id": "FOOTER_MONDAY_ID",
        "label": "Segunda: 19h às 00h",
        "visible": false
      }
    ]
  }'
```

#### 9. Alternar Visibilidade de Horário
```bash
curl -X PATCH http://localhost:3000/api/v1/operating-hours/OPERATING_HOUR_ID/visibility \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏗️ Estrutura do Projeto

```
src/
├── config/           # Configurações (DB, env)
├── controllers/      # Controllers (recebem requests)
├── middleware/       # Middlewares (auth, validation, errors)
├── models/          # Modelos do Mongoose
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── types/           # Interfaces TypeScript
├── utils/           # Utilitários (JWT, validations)
├── app.ts           # Configuração do Express
└── server.ts        # Servidor principal
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test -- --coverage
```

## 🔒 Segurança

- **JWT** para autenticação
- **Helmet** para headers de segurança
- **Rate Limiting** para prevenir ataques
- **CORS** configurado
- **Validação** de entrada com Joi
- **Senhas** hasheadas com bcrypt

## 🚢 Deploy

### Docker (Opcional)

```bash
# Build da imagem
docker build -t carrera-kart-api .

# Run container
docker run -p 3000:3000 --env-file .env carrera-kart-api
```

### Produção

1. Configure as variáveis de ambiente de produção
2. Use um gerenciador de processos como PM2
3. Configure HTTPS
4. Use MongoDB Atlas ou instância dedicada

## 📝 Scripts Disponíveis

- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Build para produção
- `npm start` - Iniciar em produção
- `npm test` - Executar testes
- `npm run test:watch` - Testes em modo watch

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 🏆 Categorias Disponíveis

- **PREMIUM** - Categoria premium
- **OURO** - Categoria ouro
- **A** - Categoria A
- **B** - Categoria B
- **C** - Categoria C
- **D** - Categoria D
- **E** - Categoria E
- **F** - Categoria F

## 🔧 Troubleshooting

### Erro de conexão com MongoDB
- Verifique se o MongoDB está rodando
- Confirme a URL de conexão no `.env`

### Erro de JWT
- Verifique se o JWT_SECRET está configurado
- Confirme se o token está sendo enviado no header Authorization

### Erro de CORS
- Adicione sua URL no array de origins permitidas em `src/app.ts`
