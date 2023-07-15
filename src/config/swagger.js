import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

import __dirname from '../utils.js'

export const swaggerUi = () => {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.1',
      info: {
        title: 'Ephemer gaming API Documentation',
        description: 'Hello there! In this document you will find the definitions for the product and cart modules, with all their routes, responses, schemas and possible inputs. All endpoints that require certain user roles must be tried with a valid cookie stored.'
      }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
  }

  const styleOptions = {
    customCssUrl: ['/css/styles.css', '/css/swagger.css'],
    customJs: '/js/swagger.js'
  }

  const specs = swaggerJsdoc(swaggerOptions)
  return [swaggerUiExpress.serve, swaggerUiExpress.setup(specs, styleOptions)]
}
