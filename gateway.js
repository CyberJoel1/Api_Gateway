const express= require('express');
const app= express();
const routes= require('./routes');
const PORT= 3000;
const morgan = require("morgan");

app.use(express.json());
app.use(morgan('dev'));
app.use('/',routes);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(express.urlencoded({ extended: true }));
app.listen(PORT,()=>{
    console.log('Servidor escuchando '+ PORT);
})