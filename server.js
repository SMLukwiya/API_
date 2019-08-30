import express from 'express';
import dotenv from 'dotenv';
import DogController from './src/usingDB/controllers/Dog';
import OwnerController from './src/usingDB/controllers/Owners';
import Auth from './src/usingDB/middlewares/Auth';

dotenv.config();
const Dog = process.env.Type === 'db' ? DogController : '';
const app = express();

app.use(express.json())

app.post('/api/dogs', Auth.verifyToken, DogController.create);
app.get('/api/dogs', Auth.verifyToken, DogController.getAll);
app.get('/api/dogs/:id', Auth.verifyToken, DogController.getOne);
app.put('/api/dogs/:id', Auth.verifyToken, DogController.update);
app.delete('/api/dogs/:id', Auth.verifyToken, DogController.delete);
app.post('/api/owners', OwnerController.create);
app.post('/api/owners/login', OwnerController.login);
app.delete('/api/owners/:id', Auth.verifyToken, OwnerController.delete)

app.get('/', (req,res) => {
  return res.status(200).send('it is about that time')
})

app.listen(3000)
console.log('app running on port', 3000)
