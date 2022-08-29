const express= require('express');
const app= express();
const routes= require('./routes');
const PORT= 3000;
const morgan = require("morgan");

app.use(express.json());
app.use(morgan('dev'));
app.use('/',routes);

app.listen(PORT,()=>{
    console.log('Servidor escuchando '+ PORT);
})