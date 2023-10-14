const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(bodyParser.json());

const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');

app.use('/movies', movieRoutes);
app.use('/users', userRoutes);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: ' HomeWork Week 9 Tejo Mulyono',
      version: '1.0.0',
      description: 'Restfull API and Middleware',
    },
    servers: [
        {
          url: "http://localhost:3000/",
        },
      ],
    },
    apis: ["./routes/*.js"],
  };
  
  
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/api/hello', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
