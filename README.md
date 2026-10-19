# 🚚 ShipNow API

API REST para la gestión de usuarios, productos, comercios y pedidos, desarrollada con **Node.js, Express y MongoDB**.

Este proyecto simula el funcionamiento básico de una plataforma de logística y envíos.

En la **Pre-entrega del Módulo 1**, se refactorizó la API para implementar una arquitectura profesional basada en **Controller → Service → Repository**, incorporando configuración centralizada de variables de entorno, constantes de dominio y separación de responsabilidades.

---

## 🛠️ Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** framework para construir la API REST.
- **MongoDB:** base de datos NoSQL.
- **Mongoose:** modelado y acceso a MongoDB.
- **dotenv:** administración de variables de entorno.
- **bcrypt:** hash seguro de contraseñas.
- **CORS:** configuración de acceso entre orígenes.
- **Nodemon:** reinicio automático del servidor durante el desarrollo.

---

## 🏗️ Arquitectura del proyecto

La aplicación utiliza una arquitectura de tres capas:

**Router → Controller → Service → Repository → Model → MongoDB**

### Responsabilidades

**Routes**
- Definen los endpoints disponibles.
- Conectan cada ruta con su Controller.
- No contienen lógica de negocio.

**Controllers**
- Reciben las peticiones HTTP.
- Obtienen parámetros y datos del request.
- Invocan los métodos del Service.
- Devuelven respuestas JSON y códigos HTTP.

**Services**
- Implementan las reglas de negocio.
- Validan los datos recibidos.
- Controlan las operaciones permitidas.
- Coordinan el acceso a los Repositories.

**Repositories**
- Encapsulan las consultas a MongoDB mediante Mongoose.
- Implementan filtros, proyecciones y ordenamientos.
- Se encargan de buscar, crear, actualizar y eliminar documentos.

**Models**
- Definen los esquemas y validaciones de Mongoose.

Esta separación permite mejorar la organización, mantenibilidad y escalabilidad del proyecto.

---

## 📁 Estructura de carpetas

```text
src/
├── config/
│   ├── db.js
│   └── index.js
│
├── controllers/
│   ├── users.controller.js
│   ├── products.controller.js
│   ├── stores.controller.js
│   └── orders.controller.js
│
├── models/
│   ├── user.model.js
│   ├── product.model.js
│   ├── store.model.js
│   └── order.model.js
│
├── repositories/
│   ├── users.repository.js
│   ├── products.repository.js
│   ├── stores.repository.js
│   └── orders.repository.js
│
├── routes/
│   ├── users.router.js
│   ├── products.router.js
│   ├── stores.router.js
│   └── orders.router.js
│
├── services/
│   ├── users.service.js
│   ├── products.service.js
│   ├── stores.service.js
│   └── orders.service.js
│
├── utils/
│   └── constants.js
│
├── app.js
└── server.js
```

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd shipnow-api-95295
```

Reemplazar `URL_DEL_REPOSITORIO` por la dirección del repositorio correspondiente.

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`.

Ejemplo para MongoDB local:

```env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
NODE_ENV=development
```

| Variable | Descripción | Obligatoria |
|---|---|---|
| `PORT` | Puerto del servidor. Valor predeterminado: 8080 | No |
| `MONGODB_URI` | Dirección de conexión a MongoDB | Sí |
| `NODE_ENV` | Entorno de ejecución | No |

La configuración se centraliza en `src/config/index.js`.

Si falta `MONGODB_URI`, la aplicación genera un error descriptivo y no inicia.

El archivo `.env` está incluido en `.gitignore` para evitar publicar credenciales.

### 4. Iniciar MongoDB

Verificar que el servicio de MongoDB esté funcionando y que la dirección configurada en `MONGODB_URI` sea correcta.

### 5. Ejecutar la aplicación

**Modo desarrollo:**

```bash
npm run dev
```

**Modo normal:**

```bash
npm start
```

Servidor:

`http://localhost:8080`

### 6. Verificar funcionamiento

**GET** `/health`

Respuesta esperada:

```json
{
  "status": "success",
  "message": "API funcionando"
}
```

---

## 👤 Usuarios (Users)

Permite administrar los usuarios de ShipNow.

### Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:uid` | Obtener usuario por ID |
| POST | `/api/users` | Crear usuario |
| PUT | `/api/users/:uid` | Actualizar usuario |
| DELETE | `/api/users/:uid` | Eliminar usuario |

### Crear usuario

**POST** `/api/users`

```json
{
  "firstName": "Martina",
  "lastName": "Gómez",
  "email": "martina@test.com",
  "password": "123456"
}
```

### Reglas de negocio

- Las contraseñas se almacenan utilizando bcrypt.
- Las respuestas de usuarios no exponen las contraseñas.
- Los usuarios nuevos reciben el rol `customer`.
- El endpoint general de actualización permite modificar nombre y apellido.
- No se permite modificar el rol o la contraseña mediante ese endpoint.

### Roles disponibles

Los roles se centralizan mediante `USER_ROLES` en `src/utils/constants.js`.

| Constante | Valor |
|---|---|
| `ADMIN` | `admin` |
| `USER` | `customer` |
| `STORE` | `store` |

---

## 📦 Productos (Products)

Permite administrar el catálogo de productos.

### Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/products` | Listar productos activos |
| GET | `/api/products/:pid` | Obtener producto por ID |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:pid` | Actualizar producto |
| DELETE | `/api/products/:pid` | Eliminar producto |

### Crear producto

**POST** `/api/products`

```json
{
  "name": "Auriculares Bluetooth",
  "description": "Auriculares inalámbricos con micrófono",
  "price": 25000,
  "stock": 15,
  "category": "Electrónica"
}
```

### Reglas de negocio

- Nombre y categoría obligatorios.
- Precio numérico mayor o igual a cero.
- Stock entero mayor o igual a cero.
- Los productos nuevos se crean con `isActive: true`.
- El listado general muestra únicamente productos activos.
- Las actualizaciones se limitan a campos autorizados.
- El Repository aplica filtros, proyecciones y ordenamiento por fecha.

### Ejemplo de actualización

**PUT** `/api/products/:pid`

```json
{
  "price": 30000,
  "stock": 20
}
```

---

## 🏪 Comercios (Stores)

Permite administrar los comercios asociados a los pedidos.

### Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/stores` | Listar comercios activos |
| GET | `/api/stores/:sid` | Obtener comercio por ID |
| POST | `/api/stores` | Crear comercio |
| PUT | `/api/stores/:sid` | Actualizar comercio |
| DELETE | `/api/stores/:sid` | Eliminar comercio |

### Crear comercio

**POST** `/api/stores`

```json
{
  "name": "Kiosco Centro",
  "address": "San Martín 1250, Rosario",
  "owner": "ID_DEL_USUARIO"
}
```

### Reglas de negocio

- Nombre, dirección y propietario obligatorios.
- Se verifica que el propietario exista.
- Los comercios nuevos se crean activos.
- El listado general devuelve comercios activos.
- Las actualizaciones se limitan a nombre, dirección y estado de actividad.

---

## 🚚 Pedidos (Orders)

Permite crear y administrar pedidos de envío.

Cada pedido está asociado a un usuario y a un comercio.

### Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/orders` | Listar pedidos |
| GET | `/api/orders/:oid` | Obtener pedido por ID |
| POST | `/api/orders` | Crear pedido |
| PUT | `/api/orders/:oid/status` | Actualizar estado |
| DELETE | `/api/orders/:oid` | Eliminar pedido |

### Crear pedido

**POST** `/api/orders`

```json
{
  "customer": "ID_DEL_USUARIO",
  "store": "ID_DEL_COMERCIO",
  "deliveryAddress": "Mendoza 1200, Rosario",
  "items": [
