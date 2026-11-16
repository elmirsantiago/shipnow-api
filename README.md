🚚 ShipNow API
API REST para la gestión de usuarios, productos, comercios, pedidos y entregas, desarrollada con Node.js, Express y MongoDB.

El proyecto simula el funcionamiento de una plataforma de logística y envíos.

En la Pre-entrega del Módulo 1, se implementó una arquitectura profesional basada en Router → Controller → Service → Repository, con configuración centralizada y constantes de dominio.

En la Pre-entrega del Módulo 2, se incorporó un sistema de mocking y carga de datos de prueba, capaz de generar usuarios, repartidores, pedidos y entregas ficticias, tanto para previsualización como para inserción controlada en MongoDB.

En la Pre-entrega del Módulo 3, se incorporó un manejo centralizado de errores mediante errores de dominio personalizados, un diccionario común, un middleware global y pruebas automatizadas.

En la Pre-entrega del Módulo 4, se integró Winston para logging centralizado, persistencia y rotación de archivos, diferenciación por entorno y un endpoint de prueba.

En la Pre-entrega del Módulo 5, se incorporó documentación interactiva mediante Swagger UI y OpenAPI 3.0.3, con 16 operaciones HTTP documentadas, cinco grupos temáticos y schemas reutilizables.

En la Pre-entrega del Módulo 6, se incorporaron 24 tests funcionales con Mocha, Chai y Supertest, utilizando una base de datos local exclusiva para testing y limpieza controlada.

En la Pre-entrega del Módulo 7, se integró Multer para cargar documentos de usuarios y comprobantes de pedidos, con validación de formatos, contenido y tamaño, persistencia de metadatos en MongoDB y documentación OpenAPI. Se añadieron 11 tests funcionales: 35 pruebas funcionales y 25 de Jest, 60 aprobadas en total.
🛠️ Tecnologías utilizadas
- Node.js: entorno de ejecución de JavaScript.
- Express: framework para desarrollar la API REST.
- MongoDB: base de datos NoSQL.
- Mongoose: modelado y acceso a MongoDB.
- dotenv: configuración de variables de entorno.
- bcrypt: hash de contraseñas.
- @faker-js/faker: generación de datos ficticios.
- Nodemon: reinicio automático del servidor durante el desarrollo.
- Jest: ejecución de pruebas automatizadas previas.
- Mocha: ejecución de tests funcionales.
- Chai: aserciones y validación de respuestas.
- Supertest: pruebas HTTP de endpoints Express.
- Winston: logging centralizado con niveles personalizados.
- winston-daily-rotate-file: rotación y retención de archivos de logs.
- swagger-ui-express: interfaz interactiva de documentación.
- swagger-jsdoc: generación de la especificación OpenAPI a partir de archivos YAML.
- Multer: recepción y almacenamiento de archivos multipart/form-data.
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

│   ├── db.js

│   ├── index.js
│   ├── logger.js
│   └── multer.js

├── docs/
│   ├── swagger.js
│   ├── users.yaml
│   ├── orders.yaml
│   ├── mocks.yaml
│   ├── logger.yaml
│   └── uploads.yaml
├── controllers/

│   ├── users.controller.js

│   ├── products.controller.js

│   ├── stores.controller.js

│   ├── orders.controller.js

│   ├── mocks.controller.js
│   └── files.controller.js

├── errors/
│   ├── AppError.js
│   └── errorDictionary.js
├── middlewares/
│   └── errorHandler.js
├── models/

│   ├── user.model.js

│   ├── product.model.js

│   ├── store.model.js

│   ├── order.model.js

│   └── delivery.model.js

├── repositories/

│   ├── users.repository.js

│   ├── products.repository.js

│   ├── stores.repository.js

│   ├── orders.repository.js

│   └── mocks.repository.js

├── routes/

│   ├── users.router.js

│   ├── products.router.js

│   ├── stores.router.js

│   ├── orders.router.js

│   ├── mocks.router.js
│   └── files.router.js

├── services/

│   ├── users.service.js

│   ├── products.service.js

│   ├── stores.service.js

│   ├── orders.service.js

│   ├── mocks.service.js
│   └── files.service.js

├── utils/

│   ├── constants.js

│   ├── mocks.generator.js
│   └── fileValidation.js

├── app.js

└── server.js

logs/  (generada automáticamente; ignorada por Git)
tests/
└── logger.test.js  (además de las pruebas de módulos anteriores)

test/
└── functional/
├── helpers/
│   └── testDatabase.js
├── users.test.js
├── orders.test.js
├── api.test.js
├── seed.test.js
└── uploads.test.js

.env.test  (local, excluido de Git)
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
  Roles disponiblesConstante    Valor
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
  Endpoints disponiblesMétodo   Endpoint        Descripción     Guarda en MongoDB
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
Código  HTTP    Situación
INVALID_DATA    400     Datos o identificadores inválidos
INVALID_MOCK_QUANTITY   400     qty fuera del rango permitido o no entero
USER_NOT_FOUND  404     Usuario inexistente
STORE_NOT_FOUND 404     Comercio inexistente
PRODUCT_NOT_FOUND       404     Producto inexistente
ORDER_NOT_FOUND 404     Pedido inexistente
INVALID_ORDER_STATUS    400     Estado de pedido no permitido
NO_ACTIVE_STORES        400     No existen comercios activos para ejecutar el seed
DUPLICATE_DATA  409     Registro duplicado en MongoDB
DATABASE_ERROR  500     Falla reconocida de base de datos
ROUTE_NOT_FOUND 404     Endpoint inexistente
INTERNAL_ERROR  500     Error inesperado

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
📊 Logging y monitoreo básico — Módulo 4
ShipNow utiliza Winston como logger centralizado en src/config/logger.js. Reemplaza las llamadas directas a console.log() y console.error() de src y registra eventos relevantes sin cambiar el formato de las respuestas HTTP de la API.
Niveles personalizados
Nivel   Prioridad       Uso
fatal   0       Fallas críticas, como problemas de arranque o conexión inicial
error   1       Fallas inesperadas o de base de datos
warning 2       Validaciones fallidas, rutas inexistentes y otros eventos esperados
info    3       Conexión exitosa, inicio del servidor y operaciones exitosas
http    4       Eventos HTTP de diagnóstico y prueba
debug   5       Información detallada de desarrollo

Los números más bajos representan mayor gravedad.
Diferencias entre entornos
- Desarrollo (NODE_ENV=development): umbral debug; se admiten los seis niveles en consola y en el archivo combinado.
- Producción (NODE_ENV=production): umbral info; se registran info, warning, error y fatal, pero no http ni debug.
- El endpoint de prueba se registra únicamente cuando NODE_ENV es distinto de production. Para usarlo, se recomienda configurar explícitamente NODE_ENV=development.
  Integración en la aplicación
- src/server.js: inicio exitoso (info) y fallas críticas de arranque (fatal).
- src/config/db.js: conexión a MongoDB (info) y fallas iniciales (fatal).
- src/middlewares/errorHandler.js: errores de negocio (warning) y errores del servidor (error).
- src/services/mocks.service.js: generación e inserción de datos de prueba (info), cantidades inválidas (warning) y fallas de inserción (error).
- src/services/orders.service.js: creación, actualización y eliminación de pedidos (info) e intentos de operar sobre pedidos inexistentes (warning).
  Endpoint de prueba
  GET /api/loggerTest — disponible solamente fuera de producción.
  Con el servidor en desarrollo:
  npm run dev
  Abrir http://localhost:8080/api/loggerTest o consultar la ruta mediante Thunder Client/Postman. El endpoint emite un registro en cada nivel (debug, http, info, warning, error, fatal) y responde:
  {
  "status": "success",
  "message": "Prueba de logging ejecutada correctamente",
  "levels": ["debug", "http", "info", "warning", "error", "fatal"]
  }
  Las entradas error y fatal generadas por este endpoint son intencionales: no indican que el servidor haya fallado. En producción la ruta no existe y el middleware global responde con un 404 ROUTE_NOT_FOUND.
  Persistencia y rotación
  Los archivos se crean automáticamente dentro de logs/:
  Archivo Contenido       Rotación        Retención
  logs/error-AAAA-MM-DD.log       Solo error y fatal      Diaria o al alcanzar 10 MB      14 días
  logs/combined-AAAA-MM-DD.log    Niveles permitidos según el entorno     Diaria o al alcanzar 10 MB      7 días
El formato de cada registro es AAAA-MM-DD HH:mm:ss [nivel] mensaje.

El transporte de errores utiliza un filtro explícito que deja pasar únicamente error y fatal. Los archivos de auditoría internos de la rotación también se generan en logs/.

En .gitignore debe figurar:
.env
logs/
De esta manera no se publican secretos ni archivos de logs generados. La carpeta puede documentarse, pero sus archivos no deben subirse al repositorio.
Verificación
1. Ejecutar npm run dev y visitar http://localhost:8080/api/loggerTest.
2. Confirmar que la consola muestra los seis niveles con fecha y hora.
3. Revisar logs/error-AAAA-MM-DD.log: debe contener únicamente entradas error y fatal.
4. Revisar logs/combined-AAAA-MM-DD.log para ver los niveles admitidos por el entorno.
5. Ejecutar npm test para verificar la suite automatizada.
   La rotación está configurada por fecha y tamaño; las pruebas realizadas hasta el momento verificaron la creación y el filtrado de archivos, no una rotación forzada por superar 10 MB o cambiar de fecha.
   📘 Documentación interactiva con Swagger — Módulo 5
   ShipNow API incorpora Swagger UI y una especificación OpenAPI 3.0.3 para consultar los endpoints, inspeccionar parámetros y cuerpos JSON, revisar respuestas y probar operaciones desde el navegador.
   Acceso a la documentación
6. Instalar dependencias con npm install.
7. Configurar .env y tener MongoDB disponible.
8. Iniciar la API con npm run dev.
9. Abrir http://localhost:8080/api/docs.
   La documentación utiliza como servidor de referencia http://localhost:8080. Si la aplicación corre en otro puerto, hay que ajustar esa URL en src/docs/swagger.js para que Try it out apunte al servidor correcto.
   Organización y configuración
   La configuración está separada de la lógica de rutas y controladores:
   Archivo      Función
   src/docs/swagger.js  Información general, servidor, tags y schemas reutilizables
   src/docs/users.yaml  Endpoints de usuarios
   src/docs/orders.yaml Endpoints de pedidos
   src/docs/mocks.yaml  Endpoints de mocks, incluidos los de entregas ficticias
   src/docs/logger.yaml Endpoint interno de prueba del logger
   La interfaz se expone desde src/app.js mediante /api/docs, sin modificar la lógica de negocio.
   Endpoints documentados
   Tag     Método  Endpoint        Función
Users   GET     /api/users      Listar usuarios
Users   GET     /api/users/{uid}        Consultar usuario
Users   POST    /api/users      Crear usuario
Users   PUT     /api/users/{uid}        Actualizar nombre o apellido
Users   DELETE  /api/users/{uid}        Eliminar usuario
Orders  GET     /api/orders     Listar pedidos
Orders  GET     /api/orders/{oid}       Consultar pedido
Orders  POST    /api/orders     Crear pedido
Orders  PUT     /api/orders/{oid}/status        Cambiar estado del pedido
Orders  DELETE  /api/orders/{oid}       Eliminar pedido
Mocks   GET     /api/mocks/users        Generar usuarios ficticios
Mocks   GET     /api/mocks/couriers     Generar repartidores ficticios
Mocks   GET     /api/mocks/orders       Generar pedidos ficticios
Mocks / Deliveries      GET     /api/mocks/deliveries   Generar entregas ficticias
Mocks   POST    /api/mocks/seed Insertar datos de prueba relacionados
Logger  GET     /api/loggerTest Probar los seis niveles de logging

Total del Módulo 5: 16 operaciones HTTP. Con los dos endpoints de carga del Módulo 7, el total actual es de 18 operaciones HTTP documentadas. Los tags requeridos son Users, Orders, Deliveries, Mocks y Logger. El endpoint de entregas ficticias aparece bajo dos tags; se trata de una sola operación, no de dos rutas diferentes.

Aclaración sobre Deliveries: existe un modelo de entregas y generación de entregas mock, pero no un CRUD independiente /api/deliveries. La documentación no declara rutas inexistentes.
Schemas reutilizables
Se definieron en src/docs/swagger.js los schemas User, Order, OrderItem, Delivery, ErrorResponse y SuccessResponse. Los endpoints documentan los parámetros de ruta, cuerpos de solicitud cuando corresponden, respuestas exitosas y posibles errores.

Los errores siguen el formato del middleware centralizado:
{
"status": "error",
"code": "INVALID_DATA",
"message": "Datos inválidos"
}
Entre los errores documentados se incluyen IDs o datos inválidos, recursos inexistentes, datos duplicados, INVALID_MOCK_QUANTITY, NO_ACTIVE_STORES, INVALID_ORDER_STATUS y errores internos. La API actual no incorpora autenticación para estos endpoints, por lo que no se documentan respuestas de autenticación inexistentes.
Cómo probar los endpoints
- Users: POST /api/users recibe firstName, lastName, email y password. La API asigna el rol customer y no devuelve la contraseña en la creación. PUT /api/users/{uid} solo permite modificar firstName y/o lastName.
- Orders: para crear un pedido se necesitan los IDs de un usuario y un comercio activo, deliveryAddress y al menos un item con name, quantity y price. El total se calcula automáticamente. Los estados permitidos son created, assigned, picked_up, in_transit, delivered y cancelled.
- Mocks: los GET generan datos ficticios sin persistirlos. El parámetro opcional qty admite enteros de 1 a 100 y utiliza 10 por defecto.
- Seed: POST /api/mocks/seed?qty=2 no requiere cuerpo JSON; inserta datos relacionados en MongoDB y necesita al menos un comercio activo. Usar únicamente una base de desarrollo o pruebas, porque cada ejecución agrega registros.
- Logger: GET /api/loggerTest es una herramienta de validación, no una operación de negocio. Solo existe cuando NODE_ENV es distinto de production; en producción devuelve 404 ROUTE_NOT_FOUND. Ejecutarlo genera intencionalmente registros error y fatal.
  Los IDs mostrados como ejemplo en Swagger son ilustrativos: para operaciones reales se deben utilizar documentos existentes en MongoDB.
  Verificación realizada
  La generación de la especificación OpenAPI del Módulo 5 se comprobó localmente con 16 operaciones y cero errores de Swagger. Posteriormente se verificó que la especificación incluye las dos rutas de carga del Módulo 7. También se ejecutó npm test, con 25 tests aprobados en 5 suites. Estas pruebas corresponden a la suite existente; no equivalen a una prueba exhaustiva de todos los ejemplos y operaciones de Swagger.
  ✅ Pruebas automatizadas — Jest y Supertest
  Para ejecutar las pruebas desde la raíz del proyecto:
  npm install
  npm test
  Resultado confirmado durante el desarrollo: 25 tests aprobados en 5 suites.
  Archivo Pruebas Cobertura
  tests/mocks.test.js     6       Generación de mocks y validación de cantidades
  tests/mocks.seed.test.js        3       Seed, relaciones y ausencia de comercios activos
  tests/errors.test.js    8       Errores HTTP, rutas inexistentes, IDs, estados, precios, mocks y JSON inválido
  tests/errorHandler.test.js      4       Errores duplicados, validación, conversión y fallas de MongoDB
  tests/logger.test.js    4       Endpoint, seis niveles, configuración y transportes de Winston
  Total   25      5 suites
Las pruebas de los endpoints usan Supertest; las pruebas del middleware simulan errores para verificar sus respuestas sin provocar fallas reales en MongoDB. Los resultados corresponden a la ejecución local reportada durante la preparación de esta entrega.
🧪 Testing funcional con Mocha, Chai y Supertest — Módulo 6
En el Módulo 6 se incorporó una suite inicial de 24 tests funcionales que comprueba respuestas exitosas y errores HTTP esperados. En el Módulo 7 se añadieron 11 tests, alcanzando 35 tests funcionales. Se mantuvo la suite anterior de Jest con 25 tests, de manera que ambas herramientas se ejecutan por separado.
Herramientas y ejecución
- Mocha: organiza y ejecuta los tests funcionales.
- Chai: verifica códigos HTTP, estructura JSON y propiedades importantes.
- Supertest: realiza solicitudes a la aplicación Express sin abrir manualmente un puerto.
- Mongoose / MongoDB local: preparan datos relacionados y permiten verificar inserciones.
  src/app.js exporta la instancia de Express; src/server.js se encarga de conectar MongoDB y escuchar el puerto en la ejecución normal. Los tests importan directamente app.
Desde la raíz del proyecto, después de ejecutar npm install:
npm test
npm run test:functional
El primer comando ejecuta Jest; el segundo, Mocha. Jest ignora test/functional/ mediante testPathIgnorePatterns.
Entorno de testing aislado
La suite funcional usa el archivo local .env.test, que no debe subirse al repositorio:
NODE_ENV=test
PORT=8081
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow_test
Es necesario tener MongoDB local en ejecución. La base shipnow_test se reserva exclusivamente para datos descartables. No usarla para información personal, de desarrollo o producción.

test/functional/helpers/testDatabase.js valida que NODE_ENV sea test, que la URI corresponda exactamente a MongoDB local con la base shipnow_test y que la conexión activa apunte a esa base antes de permitir una limpieza. Los tests crean los datos necesarios y eliminan los documentos de las colecciones de testing durante su preparación o finalización.
Advertencia: la limpieza elimina documentos de las colecciones de shipnow_test. No ejecutar estas pruebas contra bases con información importante.

Para configurar el proyecto en otra computadora, crear .env.test con los valores anteriores; no copiar credenciales ni apuntar a la base de desarrollo. El .gitignore excluye .env y .env.*, salvo archivos de ejemplo.
Cobertura funcional
Archivo Tests   Comportamientos cubiertos
test/functional/users.test.js   5       Listado, creación, datos incompletos, usuario inexistente e ID inválido
test/functional/orders.test.js  7       Listado, creación, consulta por ID, cambio de estado, datos incompletos, pedido inexistente y estado inválido
test/functional/api.test.js     9       Mocks de usuarios, repartidores, pedidos y entregas; cantidades inválidas; logger; Swagger UI; ruta inexistente
test/functional/seed.test.js    3       Inserción relacionada, cantidad inválida y ausencia de comercios activos
test/functional/uploads.test.js   11      Documentos, comprobantes, validaciones y reemplazo
Total Mocha     35      Tests funcionales aprobados

Los tests verifican el status HTTP, el formato de respuesta y campos relevantes, como status, payload, _id, total, items, levels, inserted o los campos status, code y message en los errores.

La suite prepara usuarios y comercios de prueba antes de crear pedidos, sin depender de registros cargados manualmente. El test de POST /api/mocks/seed comprueba tanto el resumen de inserciones como los documentos persistidos.
Coherencia con Swagger y manejo de errores
Se comprueban, entre otros, los siguientes comportamientos documentados:
- GET /api/users/:uid y GET /api/orders/:oid: 404 cuando el recurso no existe.
- Creación de usuarios o pedidos con datos incompletos: 400 INVALID_DATA.
- Estado de pedido no permitido: 400 INVALID_ORDER_STATUS.
- Cantidad de mocks fuera del rango 1–100: 400 INVALID_MOCK_QUANTITY.
- Seed sin comercios activos: 400 NO_ACTIVE_STORES.
- Ruta desconocida: 404 ROUTE_NOT_FOUND.
- GET /api/loggerTest: respuesta 200 con los seis niveles de logging en entorno de test.
- GET /api/docs/: respuesta 200 con contenido HTML de Swagger UI.
  El formato de error esperado es:
  {
  "status": "error",
  "code": "INVALID_DATA",
  "message": "Descripción del error"
  }
  Resultados verificados
  Suite   Resultado
  Jest (npm test) 25 tests aprobados, 5 suites
  Mocha (npm run test:functional) 35 tests aprobados
  Total   60 tests aprobados
Resultados comprobados localmente el 16 de noviembre de 2026. Las suites cubren los escenarios enumerados, pero no todos los endpoints ni todas las combinaciones posibles de datos.
🔐 Seguridad y buenas prácticas
- Las contraseñas persistidas se almacenan mediante bcrypt.
- Las variables de entorno se centralizan y validan.
- El archivo .env no debe incluirse en Git.
- Las constantes de dominio se definen mediante Object.freeze().
- Los datos de mocking se separan de la lógica HTTP.
- El parámetro qty tiene límites para evitar cargas excesivas.
- Los endpoints de seed están destinados a entornos de desarrollo y pruebas.
  📌 Próximas mejoras
- Ampliar la cobertura funcional a productos, comercios y más combinaciones de estados.
- Agregar transacciones para las operaciones de seed.
- Implementar autenticación y autorización para la carga de datos.
- Ampliar la estrategia de limpieza para nuevos escenarios de pruebas, manteniendo el aislamiento de shipnow_test.
- Ampliar los escenarios de mocking para simular diferentes etapas de entrega.
- Agregar contenedores Docker.
📎 Carga de archivos con Multer — Módulo 7
El Módulo 7 permite adjuntar documentos a usuarios y comprobantes a pedidos existentes. Las solicitudes usan multipart/form-data y el campo binario se llama file. Los archivos se almacenan en el sistema de archivos del servidor y sus metadatos se guardan en MongoDB.
Método	Endpoint	Campos	Descripción
POST	/api/users/:uid/documents	documentType + file	Adjunta un documento al usuario
POST	/api/orders/:oid/proof	file	Adjunta o reemplaza el comprobante del pedido


Restricciones: se aceptan PDF (application/pdf), JPG (image/jpeg) y PNG (image/png) de hasta 5 MB. El tipo de documento del usuario debe ser dni, license u other. Se valida el MIME declarado y la firma inicial del archivo; esta verificación de firma no sustituye un análisis completo de archivos potencialmente maliciosos.

Almacenamiento: los documentos se guardan en uploads/users/documents/ y los comprobantes en uploads/orders/proofs/. Los nombres almacenados se generan automáticamente. La carpeta uploads/ está excluida de Git; no se deben publicar documentos reales ni información sensible. El almacenamiento es local, no un servicio de nube.

Los metadatos incluyen originalName, generatedName, path, mimeType, size, documentType (para documentos de usuario) y uploadedAt. En el caso de un comprobante, al subir uno nuevo se reemplaza el anterior y se intenta eliminar el archivo previo.
Ejemplos con Thunder Client o Postman
Documento de usuario:
1. Elegir POST http://localhost:8080/api/users/ID_DEL_USUARIO/documents.
2. Seleccionar Body → Form (multipart/form-data).
3. En campos de texto, agregar documentType con valor dni.
4. En archivos, agregar file y seleccionar un PDF, JPG o PNG válido.
5. Enviar la solicitud. Una carga exitosa devuelve HTTP 201, status: success y payload.document.
Comprobante de pedido:
1. Elegir POST http://localhost:8080/api/orders/ID_DEL_PEDIDO/proof.
2. Seleccionar Body → Form y adjuntar el archivo en el campo file.
3. Enviar la solicitud. Una carga exitosa devuelve HTTP 201, status: success y payload.proof.
Los identificadores deben corresponder a registros existentes en MongoDB. La especificación interactiva de ambos endpoints está en src/docs/uploads.yaml, disponible en http://localhost:8080/api/docs. La especificación actual documenta 18 operaciones HTTP.
Errores de carga
Código	HTTP	Situación
FILE_REQUIRED	400	No se adjuntó un archivo
INVALID_FILE_TYPE	400	Formato o firma de archivo no admitidos
INVALID_DOCUMENT_TYPE	400	documentType fuera de los valores permitidos
INVALID_FILE_FIELD	400	Nombre incorrecto del campo de archivo
FILE_TOO_LARGE	413	Archivo superior a 5 MB
USER_NOT_FOUND	404	Usuario inexistente
ORDER_NOT_FOUND	404	Pedido inexistente
INVALID_DATA	400	Identificador inválido
FILE_UPLOAD_ERROR	500	Error de almacenamiento del archivo


Las respuestas de error siguen el formato { "status": "error", "code": "...", "message": "..." } del middleware global.
Pruebas del Módulo 7
El archivo test/functional/uploads.test.js agrega 11 tests para carga válida de documentos y comprobantes, persistencia de metadatos, archivo faltante, tipo de documento incorrecto, usuario/pedido inexistente, formato MIME rechazado, PDF con firma incorrecta, límite de tamaño, nombre de campo inválido y reemplazo de comprobante.
npm test
npm run test:functional
Resultados comprobados: Jest: 25/25 en 5 suites; Mocha: 35/35; 60/60 en total. Los tests funcionales usan exclusivamente MongoDB local shipnow_test bajo NODE_ENV=test, con comprobaciones de seguridad antes de limpiar colecciones. Los archivos subidos durante las pruebas requieren limpieza controlada; no se debe ejecutar esta suite mientras se usa el mismo directorio de carga para documentos importantes.

Consideración de seguridad: estos endpoints todavía no incorporan autenticación/autorización. Antes de exponerlos públicamente, se deben implementar controles de acceso, límites de uso y medidas adicionales de inspección de archivos.

📚 Entrega
Proyecto: ShipNow API  

Pre-entregas: Módulos 1, 2, 3, 4, 5, 6 y 7  

Repositorio: https://github.com/elmirsantiago/shipnow-api

El proyecto implementa una API REST con arquitectura por capas, mocking de datos relacionados, manejo centralizado de errores, logging con Winston y documentación interactiva con Swagger/OpenAPI. Las suites automatizadas cuentan con 60 pruebas aprobadas: 25 de Jest y 35 funcionales con Mocha, Chai y Supertest. El Módulo 7 añade carga de documentos y comprobantes con Multer, validación de archivos y documentación Swagger.