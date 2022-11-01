require("dotenv").config();
import express from "express";
const app = express();
const port = Number(process.env.PORT);
import user from './routes/users'
import {authorization} from './midleware/Authorization'
import translate from './routes/translate'

app.use(express.json());

app.use('/user', user);

app.use(authorization);  

app.use('/translate', translate);

app.listen(port, () => {
  console.log(`app listening ${port}`);
});