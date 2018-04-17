// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];  
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

app.listen(3000, () => console.log('Server listening on port 3000!'));

app.post('/api/login', (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send();
  knex('users').where('email',req.body.email).first().then(user => {
    if (user === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.hash),user];
  }).spread((result,user) => {
    if (result)
      res.status(200).json({user:{username:user.username,name:user.name,id:user.id,balance:user.balance}});
    else
      res.status(403).send("Invalid credentials");
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

app.post('/api/users', (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username || !req.body.name || !req.body.balance)
    return res.status(400).send();
  knex('users').where('email',req.body.email).first().then(user => {
    if (user !== undefined) {
      res.status(403).send("Email address already exists");
      throw new Error('abort');
    }
    return knex('users').where('username',req.body.username).first();
  }).then(user => {
    if (user !== undefined) {
      res.status(409).send("User name already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return knex('users').insert({email: req.body.email, hash: hash, username:req.body.username,
         name:req.body.name, balance:req.body.balance, role: 'user'});
  }).then(ids => {
    return knex('users').where('id',ids[0]).first().select('username','name','id','balance');
  }).then(user => {
    res.status(200).json({user:user});
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

app.get('/api/users/:id/transactions', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').join('transactions','users.id','transactions.user_id')
    .where('users.id',id)
    .orderBy('created','desc')
    .select('*').then(transaction => {
      res.status(200).json({transaction:transaction});
    }).catch(error => {
      console.log("ERR")
      res.status(500).json({ error });
    });
});

app.post('/api/users/:id/transactions', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').where('id',id).first().then(user => {
    return knex('transactions').insert({user_id: id, amount: req.body.amount, isWithdraw: req.body.isWithdraw, description: req.body.description, created: new Date()});
  }).then(ids => {
    return knex('transactions').where('id',ids[0]).first();
  }).then(transaction => {
    res.status(200).json({transaction:transaction});
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

app.delete('/api/users/:id/transactions/:transId', (req,res) => {
  // id of the person who is following
  let id = parseInt(req.params.id);
  // id of the person who is being followed
  let transId = parseInt(req.params.transId);
  // make sure both of these users exist
  knex('users').where('id',id).first().then(user => {
    // delete the entry in the followers table
    return knex('transactions').where({'user_id':id,'id':transId}).first().del();
  }).then(ids => {
    res.sendStatus(200);
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});