import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import expressBodyParser from 'body-parser';

import routes from './routes';

const app = express();
app.use(cors());
app.use(expressBodyParser.urlencoded({extended: true}));
app.use('/', routes);

dotenv.config();
const PORT = Number(process.env.PORT ?? 80);

app.listen(PORT, () => {
  console.log(`Server Listening on Port ${PORT}`);
});
