# Testando a API Carrera Kart

Este arquivo contém exemplos de como testar todos os endpoints da API usando curl ou um cliente HTTP como Postman/Insomnia.

## 1. Health Check

```bash
curl http://localhost:3000/api/v1/health
```

## 2. Login (obter token)

```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admi## 18. Atualizar horário individual

```bash
curl -X PUT http://localhost:3000/api/v1/operating-hours/ID_DO_HORARIO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "label": "Segunda a sexta 17h - 23h",
    "visible": false
  }'
```

## 19. Deletar horário

```bash
curl -X DELETE http://localhost:3000/api/v1/operating-hours/ID_DO_HORARIO \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```rakart.com.br",
    "password": "12345678"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "_id": "...",
      "name": "Admin Carrera Kart",
      "email": "admincarrerakart@carrerakart.com.br",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**📋 Copie o token da resposta para usar nos próximos testes**

## 3. Criar uma classificação

```bash
curl -X POST http://localhost:3000/api/v1/classifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "category": "PREMIUM",
    "driverName": "João Silva",
    "points": 250
  }'
```

## 4. Criar mais classificações

```bash
# Categoria PREMIUM
curl -X POST http://localhost:3000/api/v1/classifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "category": "PREMIUM",
    "driverName": "Maria Santos",
    "points": 320
  }'

curl -X POST http://localhost:3000/api/v1/classifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "category": "PREMIUM",
    "driverName": "Pedro Costa",
    "points": 180
  }'

# Categoria OURO
curl -X POST http://localhost:3000/api/v1/classifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "category": "OURO",
    "driverName": "Ana Lima",
    "points": 280
  }'

# Categoria A
curl -X POST http://localhost:3000/api/v1/classifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "category": "A",
    "driverName": "Carlos Oliveira",
    "points": 150
  }'
```

## 5. Ver leaderboard geral

```bash
curl http://localhost:3000/api/v1/classifications/leaderboard
```

## 6. Ver classificações por categoria

```bash
curl http://localhost:3000/api/v1/classifications/category/PREMIUM
```

## 7. Listar todas as classificações

```bash
curl http://localhost:3000/api/v1/classifications
```

## 8. Buscar classificações com filtros

```bash
# Por categoria
curl "http://localhost:3000/api/v1/classifications?category=PREMIUM"

# Por pontuação mínima
curl "http://localhost:3000/api/v1/classifications?minPoints=200"

# Por nome do corredor
curl "http://localhost:3000/api/v1/classifications?driverName=João"

# Múltiplos filtros
curl "http://localhost:3000/api/v1/classifications?category=PREMIUM&minPoints=200&limit=5"
```

## 9. Criar novo usuário (apenas ADMIN)

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Novo Usuário",
    "email": "novo@example.com",
    "password": "123456",
    "role": "USER"
  }'
```

## 10. Ver perfil do usuário logado

```bash
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  http://localhost:3000/api/v1/users/profile
```

## 11. Atualização em Lote (Bulk Update) - NOVO!

Este endpoint permite salvar todas as classificações de uma vez:
- **Remove** as classificações que não estão no array
- **Adiciona** as classificações que têm ID vazio ou nulo
- **Modifica** as classificações que têm ID válido

```bash
curl -X PUT http://localhost:3000/api/v1/classifications/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "classifications": [
      {
        "_id": "ID_EXISTENTE_1",
        "category": "PREMIUM",
        "driverName": "João Silva",
        "points": 350
      },
      {
        "category": "PREMIUM",
        "driverName": "Novo Corredor",
        "points": 200
      },
      {
        "_id": "ID_EXISTENTE_2", 
        "category": "OURO",
        "driverName": "Maria Santos",
        "points": 400
      }
    ]
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Classificações atualizadas em lote com sucesso",
  "data": {
    "created": [
      {
        "_id": "novo_id_gerado",
        "category": "PREMIUM",
        "driverName": "Novo Corredor",
        "points": 200,
        "position": 3,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "updated": [
      {
        "_id": "ID_EXISTENTE_1",
        "category": "PREMIUM", 
        "driverName": "João Silva",
        "points": 350,
        "position": 1,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "deleted": ["id_removido_1", "id_removido_2"],
    "total": {
      "created": 1,
      "updated": 2, 
      "deleted": 2
    }
  }
}
```

## 12. Atualizar classificação individual

```bash
# Primeiro, obtenha o ID de uma classificação listando todas
curl http://localhost:3000/api/v1/classifications

# Depois atualize usando o ID
curl -X PUT http://localhost:3000/api/v1/classifications/ID_DA_CLASSIFICACAO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "points": 350
  }'
```

## 13. Deletar classificação

```bash
curl -X DELETE http://localhost:3000/api/v1/classifications/ID_DA_CLASSIFICACAO \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Exemplo com Postman/Insomnia

### Configuração no Postman:

1. **Crie uma nova Collection** chamada "Carrera Kart API"

2. **Configure variáveis de ambiente:**
   - `base_url`: `http://localhost:3000/api/v1`
   - `token`: (será preenchido após o login)

3. **Request de Login:**
   - Method: POST
   - URL: `{{base_url}}/users/login`
   - Headers: `Content-Type: application/json`
   - Body: 
   ```json
   {
     "email": "admincarrerakart@carrerakart.com.br",
     "password": "12345678"
   }
   ```

4. **Nos outros requests, adicione o header:**
   - `Authorization: Bearer {{token}}`

## Status Codes da API

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autorizado
- **403**: Sem permissão
- **404**: Não encontrado
- **429**: Muitas requisições (rate limit)
- **500**: Erro interno do servidor

## Dicas

1. **Sempre salve o token** recebido no login para usar nas requisições autenticadas
2. **O sistema calcula automaticamente** as posições baseado na pontuação
3. **Não é possível** ter dois corredores com o mesmo nome na mesma categoria
4. **Apenas ADMINs** podem criar, atualizar e deletar classificações
5. **Todos podem visualizar** as classificações e leaderboards
