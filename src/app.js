"use strict";
import express from 'express';
import routes from './routes/index.js';

export const app = express();

app.use(express.json());
app.use('/api', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`))

