🚚 ShipNow API
API REST para la gestión de usuarios, productos, comercios, pedidos y entregas, desarrollada con Node.js, Express y MongoDB.

El proyecto simula el funcionamiento de una plataforma de logística y envíos.

En la Pre-entrega del Módulo 1, se implementó una arquitectura profesional basada en Router → Controller → Service → Repository, con configuración centralizada y constantes de dominio.

En la Pre-entrega del Módulo 2, se incorporó un sistema de mocking y carga de datos de prueba, capaz de generar usuarios, repartidores, pedidos y entregas ficticias, tanto para previsualización como para inserción controlada en MongoDB.

En la Pre-entrega del Módulo 3, se incorporó un manejo centralizado de errores mediante errores de dominio personalizados, un diccionario común, un middleware global y pruebas automatizadas.
🛠️ Tecnologías utilizadas
- Node.js: entorno de ejecución de JavaScript.
- Express: framework para desarrollar la API REST.
- MongoDB: base de datos NoSQL.
- Mongoose: modelado y acceso a MongoDB.
- dotenv: configuración de variables de entorno.
- bcrypt: hash de contraseñas.
- @faker-js/faker: generación de datos ficticios.
- Nodemon: reinicio automático del servidor durante el desarrollo.
- Jest: ejecución de pruebas automatizadas.
- Supertest: pruebas HTTP de endpoints Express.
🏗️ Arquitectura del proyecto
La aplicación utiliza la siguiente arquitectura:

Router → Controller → Service → Repository → Model → MongoDB
Responsabilidades
Routes
- Definen los endpoints disponibles.
- Conectan cada ruta con su Controller.
- No contienen lógica de negocio.
Controllers
- Reciben las peticiones HTTP.
- Obtienen parámetros y datos del request.
- Invocan los métodos del Service.
- Devuelven respuestas JSON y códigos HTTP de éxito.
- Propagan los errores mediante next(error) al middleware global.
Services
- Implementan reglas de negocio.
- Validan los datos recibidos y lanzan AppError ante errores de dominio.
- Coordinan las operaciones y las relaciones entre entidades.
Repositories
- Encapsulan las operaciones de MongoDB mediante Mongoose.
- Implementan consultas, filtros e inserciones.
Models
- Definen los esquemas y validaciones de Mongoose.
Utils
- Centraliza las constantes y los generadores de datos ficticios.
Errors y middlewares
- AppError representa errores personalizados de dominio.
- errorDictionary.js define códigos, estados HTTP y mensajes.
- errorHandler.js transforma los errores en respuestas HTTP consistentes.
📁 Estructura del proyecto

src/

├── config/

│   ├── db.js

│   └── index.js

├── controllers/

│   ├── users.controller.js

│   ├── products.controller.js

│   ├── stores.controller.js

│   ├── orders.controller.js

│   └── mocks.controller.js

├── errors/
│   ├── AppError.js
│   └── errorDictionary.js
├── middlewares/
│   └── errorHandler.js
├── models/

│   ├── user.model.js

│   ├── product.model.js

│   ├── store.model.js

│   ├── order.model.js

│   └── delivery.model.js

├── repositories/

│   ├── users.repository.js

│   ├── products.repository.js

│   ├── stores.repository.js

│   ├── orders.repository.js

│   └── mocks.repository.js

├── routes/

│   ├── users.router.js

│   ├── products.router.js

│   ├── stores.router.js

│   ├── orders.router.js

│   └── mocks.router.js

├── services/

│   ├── users.service.js

│   ├── products.service.js

│   ├── stores.service.js

│   ├── orders.service.js

│   └── mocks.service.js

├── utils/

│   ├── constants.js

│   └── mocks.generator.js

├── app.js

└── server.js

⚙️ Instalación y configuración
1. Clonar el repositorio

git clone https://github.com/elmirsantiago/shipnow-api.git

cd shipnow-api

2. Instalar dependencias

npm install

3. Configurar variables de entorno
Crear un archivo .env en la raíz del proyecto, tomando como referencia .env.example.

Ejemplo:

PORT=8080

MONGODB_URI=mongodb://127.0.0.1:27017/shipnow

NODE_ENV=development

La configuración se centraliza en src/config/index.js.
- MONGODB_URI es obligatoria.
- PORT debe ser un entero entre 1 y 65535.
- NODE_ENV admite development, production y test.
Si la configuración es inválida, la aplicación muestra un error descriptivo y no inicia.

El archivo .env está excluido de Git mediante .gitignore.
4. Iniciar MongoDB
Verificar que el servicio de MongoDB esté funcionando.
5. Ejecutar la aplicación
Modo desarrollo:

npm run dev

Modo normal:

npm start

Servidor local:

http://localhost:8080
6. Verificar funcionamiento
GET /health

Respuesta esperada:

{

  "status": "ok",

  "message": "ShipNow API funcionando correctamente"

}

👤 Usuarios (Users)
| Método | Endpoint | Descripción |

|---|---|---|

| GET | /api/users | Listar usuarios |

| GET | /api/users/:uid | Obtener usuario por ID |

| POST | /api/users | Crear usuario |

| PUT | /api/users/:uid | Actualizar usuario |

| DELETE | /api/users/:uid | Eliminar usuario |
Crear usuario
POST /api/users

{

  "firstName": "Martina",

  "lastName": "Gomez",

  "email": "martina@test.com",

  "password": "123456"

}

Reglas de negocio
- Las contraseñas se almacenan utilizando bcrypt.
- Las respuestas habituales de usuarios no exponen las contraseñas.
- Los usuarios creados mediante el endpoint general reciben el rol customer.
- Las actualizaciones generales se limitan a nombre y apellido.
- Los roles se centralizan mediante USER_ROLES.
Roles disponibles
| Constante | Valor |

|---|---|

| ADMIN | admin |

| USER | customer |

| STORE | store |

| COURIER | courier |
📦 Productos (Products)
| Método | Endpoint | Descripción |

|---|---|---|

| GET | /api/products | Listar productos disponibles |

| GET | /api/products/:pid | Obtener producto por ID |

| POST | /api/products | Crear producto |

| PUT | /api/products/:pid | Actualizar producto |

| DELETE | /api/products/:pid | Eliminar producto |
Crear producto
POST /api/products

{

  "name": "Auriculares Bluetooth",

  "description": "Auriculares inalámbricos",

  "price": 25000,

  "stock": 15,

  "category": "Electrónica"

}

Reglas de negocio
- Nombre y categoría obligatorios.
- Precio mayor o igual a cero.
- Stock entero mayor o igual a cero.
- El estado se determina automáticamente según el stock.
- Los productos con stock positivo tienen estado available.
- Los productos sin stock tienen estado out_of_stock.
- El listado general devuelve únicamente productos disponibles.
Los estados se definen mediante PRODUCT_STATUS.
🏪 Comercios (Stores)
| Método | Endpoint | Descripción |

|---|---|---|

| GET | /api/stores | Listar comercios activos |

| GET | /api/stores/:sid | Obtener comercio por ID |

| POST | /api/stores | Crear comercio |

| PUT | /api/stores/:sid | Actualizar comercio |

| DELETE | /api/stores/:sid | Eliminar comercio |
Crear comercio
POST /api/stores

{

  "name": "Kiosco Centro",

  "address": "San Martín 1250, Rosario",

  "owner": "ID_DEL_USUARIO"

}

Reglas de negocio
- Nombre, dirección y propietario obligatorios.
- Se comprueba que el propietario exista.
- El listado general devuelve comercios activos.
- Las actualizaciones se limitan a campos autorizados.
🚚 Pedidos (Orders)
| Método | Endpoint | Descripción |

|---|---|---|

| GET | /api/orders | Listar pedidos |

| GET | /api/orders/:oid | Obtener pedido por ID |

| POST | /api/orders | Crear pedido |

| PUT | /api/orders/:oid/status | Actualizar estado |

| DELETE | /api/orders/:oid | Eliminar pedido |
Crear pedido
POST /api/orders

{

  "customer": "ID_DEL_USUARIO",

  "store": "ID_DEL_COMERCIO",

  "deliveryAddress": "Mendoza 1200, Rosario",

  "items": [

    {

      "name": "Auriculares",

      "quantity": 2,

      "price": 15000

    }

  ]

}

Reglas de negocio
- Cada pedido está asociado a un usuario y a un comercio.
- Se verifica que el usuario y el comercio existan.
- El comercio debe estar activo.
- Las cantidades deben ser enteros positivos.
- Los precios no pueden ser negativos.
- El total se calcula a partir de los productos.
- Los estados se definen mediante ORDER_STATUS.
- Las prioridades se definen mediante ORDER_PRIORITY.
Estados permitidos
created, assigned, picked_up, in_transit, delivered, cancelled.
Prioridades permitidas
low, normal, high.
🧪 Mocking y datos de prueba — Módulo 2
Se incorporó un módulo de mocking bajo /api/mocks, que permite generar datos simulados sin cargarlos manualmente.

La generación se realiza mediante @faker-js/faker.

La lógica está separada en:
- mocks.router.js: definición de endpoints.
- mocks.controller.js: recepción de peticiones y respuestas HTTP.
- mocks.service.js: validaciones y coordinación de operaciones.
- mocks.repository.js: operaciones con MongoDB.
- mocks.generator.js: generación de objetos ficticios.
Endpoints disponibles
| Método | Endpoint | Descripción | Guarda en MongoDB |

|---|---|---|---|

| GET | /api/mocks/users?qty=5 | Genera clientes ficticios | No |

| GET | /api/mocks/couriers?qty=5 | Genera repartidores ficticios | No |

| GET | /api/mocks/orders?qty=5 | Genera pedidos ficticios | No |

| GET | /api/mocks/deliveries?qty=5 | Genera entregas ficticias | No |

| POST | /api/mocks/seed?qty=5 | Inserta registros relacionados de prueba | Sí |
Parámetro qty
El parámetro qty determina cuántos registros se generan.
- Valor predeterminado: 10.
- Valor mínimo: 1.
- Valor máximo: 100.
- Solamente acepta números enteros.
Ejemplo:

GET http://localhost:8080/api/mocks/users?qty=3

Si se envía un valor inválido, la API responde con código 400.
Generar usuarios ficticios
GET /api/mocks/users?qty=2

Ejemplo de respuesta:

[

  {

    "firstName": "Ana",

    "lastName": "Perez",

    "email": "ana@example.com",

    "role": "customer"

  },

  {

    "firstName": "Luis",

    "lastName": "Gomez",

    "email": "luis@example.com",

    "role": "customer"

  }

]

Los datos son ficticios y no se insertan en MongoDB.
Generar repartidores ficticios
GET /api/mocks/couriers?qty=2

Los repartidores se representan mediante usuarios con rol courier, definido en USER_ROLES.

No se necesita un modelo independiente de repartidores.
Generar pedidos ficticios
GET /api/mocks/orders?qty=2

Los pedidos generados incluyen:
- Identificador ficticio de cliente.
- Identificador ficticio de comercio.
- Productos, cantidades y precios.
- Dirección de entrega.
- Total calculado.
- Estado permitido.
- Prioridad permitida.
Los identificadores de este endpoint son simulados y no necesariamente corresponden a documentos existentes en MongoDB.
Generar entregas ficticias
GET /api/mocks/deliveries?qty=2

Las entregas incluyen:
- Identificador ficticio de pedido.
- Identificador ficticio de repartidor.
- Estado de entrega.
- Fecha de asignación.
- Fecha de finalización, cuando corresponda.
Estos datos tampoco se guardan en MongoDB.
Insertar datos de prueba en MongoDB
POST /api/mocks/seed?qty=2

Este endpoint crea datos relacionados en la base de datos configurada.

Requisito previo: debe existir al menos un comercio activo en MongoDB.

Para ejecutar la carga:

1. Iniciar MongoDB y el servidor.

2. Abrir Thunder Client o Postman.

3. Seleccionar el método POST.

4. Utilizar http://localhost:8080/api/mocks/seed?qty=2.

5. Enviar la petición sin cuerpo JSON.

Ejemplo de respuesta:

{

  "message": "Datos de prueba insertados correctamente",

  "inserted": {

    "users": 2,

    "couriers": 2,

    "orders": 2,

    "deliveries": 2

  }

}

Con qty=2, se insertan ocho documentos:
- 2 clientes en users.
- 2 repartidores en users.
- 2 pedidos en orders.
- 2 entregas en deliveries.
Las contraseñas de los usuarios ficticios se almacenan utilizando bcrypt.

Los correos de los usuarios insertados utilizan identificadores únicos para evitar colisiones.

Importante: cada ejecución del endpoint inserta nuevos registros. No debe ejecutarse repetidamente sin necesidad.

Se recomienda utilizar exclusivamente una base de datos de desarrollo o pruebas.
Relaciones entre entidades
La carga de datos respeta las siguientes relaciones:

Pedido → Cliente

Cada pedido insertado referencia un usuario existente con rol customer.

Pedido → Comercio

Cada pedido referencia un comercio activo existente.

Entrega → Pedido

Cada entrega referencia un pedido insertado en MongoDB.

Entrega → Repartidor

Cada entrega referencia un usuario con rol courier.

Además, el campo order de Delivery es único, evitando múltiples entregas para un mismo pedido.
Coherencia de estados
En el flujo actual de generación:
- Los pedidos se crean con estado assigned.
- Las entregas se crean con estado assigned.
- Cada entrega tiene un repartidor asignado.
- La fecha assignedAt se registra automáticamente.
- La fecha deliveredAt permanece en null.
De esta forma, los estados de los pedidos y las entregas generados por el seed son coherentes.
Comprobar los registros insertados
Abrir MongoDB Compass y revisar las colecciones:
- users
- orders
- deliveries
Para verificar las relaciones, comparar los identificadores de los documentos.

Ejemplo de filtro en MongoDB Compass:

{ "_id": ObjectId("ID_DEL_DOCUMENTO") }

Comprobar que:
- El customer de un pedido corresponde a un usuario con rol customer.
- El courier de una entrega corresponde a un usuario con rol courier.
- El order de una entrega corresponde a un pedido existente.
Limitaciones actuales
- El seed utiliza comercios activos previamente cargados.
- Los endpoints GET de pedidos y entregas generan referencias ficticias, no documentos persistidos.
- El seed no utiliza una transacción de MongoDB: si una inserción falla, podrían quedar registros parciales.
- El endpoint de seed está pensado para pruebas locales; no debe exponerse públicamente en producción sin autenticación y controles adicionales.
🧪 Pruebas realizadas
Se realizaron pruebas manuales mediante Thunder Client y MongoDB Compass.
Módulo 1
- CRUD de usuarios, comercios y productos.
- Creación y consulta de pedidos.
- Validación de estados de productos.
- Validación de variables de entorno.
- Comprobación del hash de contraseñas.
Módulo 2
- Generación de cinco usuarios ficticios.
- Generación de cinco repartidores ficticios.
- Generación de cinco pedidos ficticios.
- Generación de cinco entregas ficticias.
- Inserción de datos con POST /api/mocks/seed?qty=2.
- Verificación de documentos en MongoDB Compass.
- Verificación de la relación entre entrega y repartidor.
- Verificación de la relación entre entrega y pedido.
- Verificación de la relación entre pedido y cliente.
⚠️ Manejo profesional de errores — Módulo 3
La API centraliza las respuestas de error. Las rutas conectan los controladores; los servicios detectan errores de dominio y lanzan instancias de AppError; los controladores envían esos errores mediante next(error); y el middleware global src/middlewares/errorHandler.js construye la respuesta HTTP final.

Flujo: Router → Controller → Service → AppError → errorHandler → respuesta HTTP.
Estructura uniforme
Las respuestas de error utilizan los campos status, code y message:
{
  "status": "error",
  "code": "PRODUCT_NOT_FOUND",
  "message": "Producto no encontrado"
}
Los errores no controlados no exponen trazas ni detalles internos al cliente; se registran en el servidor y se devuelve un mensaje genérico.
Diccionario de errores
Código	HTTP	Situación
INVALID_DATA	400	Datos o identificadores inválidos
INVALID_MOCK_QUANTITY	400	qty fuera del rango permitido o no entero
USER_NOT_FOUND	404	Usuario inexistente
STORE_NOT_FOUND	404	Comercio inexistente
PRODUCT_NOT_FOUND	404	Producto inexistente
ORDER_NOT_FOUND	404	Pedido inexistente
INVALID_ORDER_STATUS	400	Estado de pedido no permitido
NO_ACTIVE_STORES	400	No existen comercios activos para ejecutar el seed
DUPLICATE_DATA	409	Registro duplicado en MongoDB
DATABASE_ERROR	500	Falla reconocida de base de datos
ROUTE_NOT_FOUND	404	Endpoint inexistente
INTERNAL_ERROR	500	Error inesperado


El diccionario está definido en src/errors/errorDictionary.js. La clase src/errors/AppError.js permite lanzar un error por su tipo y, cuando corresponde, personalizar el mensaje.
Ejemplos para probar en Thunder Client o Postman
ID de producto inválido

GET /api/products/123 → HTTP 400
{
  "status": "error",
  "code": "INVALID_DATA",
  "message": "El ID del producto no es válido"
}
Estado de pedido inválido

PUT /api/orders/507f1f77bcf86cd799439011/status
{
  "status": "volando"
}
Respuesta HTTP 400:
{
  "status": "error",
  "code": "INVALID_ORDER_STATUS",
  "message": "Estado de pedido inválido"
}
Cantidad de mocks inválida

GET /api/mocks/users?qty=-5 → HTTP 400, código INVALID_MOCK_QUANTITY.

Ruta inexistente

GET /api/ruta-inexistente → HTTP 404, código ROUTE_NOT_FOUND.
Errores de MongoDB y Mongoose
El middleware también contempla errores de validación (ValidationError), conversión (CastError), claves duplicadas (11000), JSON mal formado y errores reconocidos de conexión u operación de MongoDB. Las respuestas preservan el mismo formato JSON y no muestran mensajes técnicos internos.

Nota: el seed captura fallas no controladas durante la inserción y las transforma en DATABASE_ERROR. Como no utiliza transacciones, una falla puede dejar inserciones parciales; se recomienda usar una base de pruebas.
✅ Pruebas automatizadas — Jest y Supertest
Para ejecutar las pruebas desde la raíz del proyecto:
npm install
npm test
Resultado confirmado durante el desarrollo: 21 tests aprobados en 4 suites.
Archivo	Pruebas	Cobertura
tests/mocks.test.js	6	Generación de mocks y validación de cantidades
tests/mocks.seed.test.js	3	Seed, relaciones y ausencia de comercios activos
tests/errors.test.js	8	Errores HTTP, rutas inexistentes, IDs, estados, precios, mocks y JSON inválido
tests/errorHandler.test.js	4	Errores duplicados, validación, conversión y fallas de MongoDB
Total	21	4 suites


Las pruebas de los endpoints usan Supertest; las pruebas del middleware simulan errores para verificar sus respuestas sin provocar fallas reales en MongoDB. Los resultados corresponden a la ejecución local reportada durante la preparación de esta entrega.
🔐 Seguridad y buenas prácticas
- Las contraseñas persistidas se almacenan mediante bcrypt.
- Las variables de entorno se centralizan y validan.
- El archivo .env no debe incluirse en Git.
- Las constantes de dominio se definen mediante Object.freeze().
- Los datos de mocking se separan de la lógica HTTP.
- El parámetro qty tiene límites para evitar cargas excesivas.
- Los endpoints de seed están destinados a entornos de desarrollo y pruebas.
📌 Próximas mejoras
- Ampliar la cobertura de pruebas automatizadas, especialmente los casos de integración con una base de datos de prueba.
- Agregar transacciones para las operaciones de seed.
- Implementar autenticación y autorización para la carga de datos.
- Incorporar limpieza controlada de registros de prueba.
- Ampliar los escenarios de mocking para simular diferentes etapas de entrega.
- Agregar contenedores Docker.
📚 Entrega
Proyecto: ShipNow API  

Pre-entregas: Módulos 1, 2 y 3  

Repositorio: https://github.com/elmirsantiago/shipnow-api

El proyecto implementa una API REST con arquitectura por capas, un módulo de mocking para generar y persistir datos de prueba relacionados, y un sistema centralizado de errores de dominio y base de datos, verificado mediante pruebas automatizadas