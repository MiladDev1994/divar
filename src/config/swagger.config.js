// const swaggerJSDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");


// function swaggerConfig(app) {
//     const swaggerDocument = swaggerJSDoc({
//         swaggerDefinition: {
//             info: {
//                 title: "Divar-backend",
//                 description: "learning",
//                 version: "1.0.0"
//             }
//         },
//         apis: [process.cwd() + "/src/modules/**/*.swagger.js"]
//     })
    
//     const swagger = swaggerUi.setup(swaggerDocument, {});
//     console.log(swagger)
//     app.use("/", swaggerUi.serve, swagger)
// }

// module.exports = swaggerConfig;

const express = require("express"),
bodyParser = require("body-parser"),
swaggerJsdoc = require("swagger-jsdoc"),
swaggerUi = require("swagger-ui-express");

function swaggerConfig(app) {
    const options = {
        definition: {
            openapi: "3.1.0",
            info: {
                title: "LogRocket Express API with Swagger",
                version: "0.1.0",
                description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            },
        },
        apis: [process.cwd() + "/src/modules/**/*.swagger.js"],
    };
    
    const specs = swaggerJsdoc(options);
    app.use(
        "/",
        swaggerUi.serve,
        swaggerUi.setup(specs, { explorer: true })
    );
}

module.exports = swaggerConfig;