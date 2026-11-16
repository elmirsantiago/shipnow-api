
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "ShipNow API",
      version: "1.0.0",
      description:
        "API REST para la gestión de usuarios, comercios, productos, pedidos y entregas. Incluye generación de datos ficticios, manejo centralizado de errores y logging con Winston."
    },

    servers: [
      {
        url: "http://localhost:8080",
        description: "Servidor local de desarrollo"
      }
    ],

    tags: [
      {
        name: "Users",
        description: "Gestión de usuarios"
      },
      {
        name: "Orders",
        description: "Gestión de pedidos"
      },
      {
        name: "Deliveries",
        description: "Modelo y datos de entregas"
      },
      {
        name: "Mocks",
        description: "Generación de datos de prueba"
      },
      {
        name: "Logger",
        description: "Validación del sistema de logging"
      }
    ],

    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Identificador del usuario"
            },
            firstName: {
              type: "string",
              example: "Martina"
            },
            lastName: {
              type: "string",
              example: "Gomez"
            },
            email: {
              type: "string",
              format: "email",
              example: "martina@test.com"
            },
            role: {
              type: "string",
              enum: ["admin", "customer", "store", "courier"],
              example: "customer"
            }
          }
        },

        OrderItem: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Auriculares Bluetooth"
            },
            quantity: {
              type: "integer",
              minimum: 1,
              example: 2
            },
            price: {
              type: "number",
              minimum: 0,
              example: 15000
            }
          }
        },

        Order: {
          type: "object",
          properties: {
            _id: {
              type: "string"
            },
            customer: {
              type: "string"
            },
            store: {
              type: "string"
            },
            deliveryAddress: {
              type: "string",
              example: "Mendoza 1200, Rosario"
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem"
              }
            },
            total: {
              type: "number",
              example: 30000
            },
            status: {
              type: "string",
              enum: [
                "created",
                "assigned",
                "picked_up",
                "in_transit",
                "delivered",
                "cancelled"
              ]
            },
            priority: {
              type: "string",
              enum: ["low", "normal", "high"]
            }
          }
        },

        Delivery: {
          type: "object",
          properties: {
            _id: {
              type: "string"
            },
            order: {
              type: "string"
            },
            courier: {
              type: "string"
            },
            status: {
              type: "string"
            },
            assignedAt: {
              type: "string",
              format: "date-time"
            },
            deliveredAt: {
              type: "string",
              format: "date-time",
              nullable: true
            }
          }
        },

        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error"
            },
            code: {
              type: "string",
              example: "INVALID_DATA"
            },
            message: {
              type: "string",
              example: "Datos inválidos"
            }
          }
        },

        SuccessResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success"
            },
            payload: {
              description: "Datos devueltos por la operación"
            }
          }
        }
      }
    }
  },

  // Archivos YAML con la documentación de endpoints
  apis: ["./src/docs/*.yaml"]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
