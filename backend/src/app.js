import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.json({ version: '1.0.0', author: 'Vinicius Bastos' }))
app.use(routes)

export default app;
