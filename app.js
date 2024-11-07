const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const routes = require('./routes');

app.use(bodyParser());

// app.use('/', (req, res) => res.send('You is home'));

app.use('/users', routes.user);

app.use('/**', (req, res) => {
	res.send('Go Home');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
