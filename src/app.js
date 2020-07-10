require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV , API_KEY } = require('./config');
const { v4 : uuid } =require('uuid');

const app = express();
app.use(morgan('dev'));
const id = uuid();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common' ;

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(function errorHandler(error, req , res , next){/*eslint-disable-line*/
  let response;
  if ( NODE_ENV === 'production'){
    response = { error : {message : 'server error' } };
  }else{
    console.error(error);/*eslint-disable-line*/
    response = { message : error.message, error };
  }
  res.status(500).json(response).send();
});

app.use( (req,res,next) =>{
  const token = req.get('Authorization');
  if(!token || token!== API_KEY){
    res.status(401).json({error:'that\'s not allowed'} );
  }
  next();
});

const store = require('./store');
/* 
const store = [
  {
    id:UUID,
    firstName: "String",
    lastName : "String",
    address1 : "String",
    address2 : "String",
    city : "String" ,
    state : "String",
    zip : integer 
  }

]

*/


app.get( '/', (req,res) => {
//   throw new Error('Error makes computer fans go brrrr');
  res.status(200).send('OwO wi mwaking gwod pwa gwas!');
});


app.get('/address' , (req,res) => {
  res.json(store);
});

app.post('/address', express.json(), (req,res) => {
  
  const {firstName, lastName , address1, address2 , city , state , zip } = req.body;
  
  const x = {};

  const responseError = (mesg) =>  res.status(400).send(mesg);

  x.id = id;
  

  !firstName ? responseError('everyone has a name') : x.firstName = firstName;

  !lastName ? responseError('we need you last name please'): x.lastName = lastName;

  !address1 ? responseError('we need an address') : x.address1 = address1;

  !address2 && !address1 ? responseError('there need to be some address')
    : !address2 && address1 ? x.address2 = 'N/A'
      : x.address2 = address2;

  !city ? responseError('we need an city') : x.city = city ;

  !state ? responseError('we need an state') 
    : state.length !== 2 ? responseError('state must be valid')
      : x.state = state;

  !zip ? responseError('must enter a zip code')
    : isNaN(Number(zip)) ? responseError('must be a valid zip, (this isn\'t a number)')
      :zip.toString().length !== 5 ? responseError('must be a valid zip code ')
        : x.zip = Number(zip) ; 

  store.push(x);
  
  res.status(200).json(store);
});

app.delete('/address/:id', (req,res)=>{
  const { id } = req.params;
  const index = store.findIndex( a => a.id === id);

  index === -1 ? res.status(404).send('sorry that\'s already gone') : store.splice(index,1) && res.status(201).send('we did the thing') ;
});


module.exports = app;