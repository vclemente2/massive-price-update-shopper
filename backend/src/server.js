import { config } from 'dotenv';
import app from './app.js';
config({ path: './backend/.env' });

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server is running on port ${port}`))
