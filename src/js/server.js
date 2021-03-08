#!/usr/bin/env node

"use strict";

const path = require('path');

const express = require('express');

const app = express();
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, '../../www')));

app.listen(3000, ()=>{
    console.log('Server start on http://127.0.0.1:3000');
}).on('error', (e)=>{
    console.error(''+e);
    process.exit(-1);
});
