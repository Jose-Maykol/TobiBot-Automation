import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
  ssl: true,
});


try {
  await db.connect();
  console.log('Conectado a la base de datos');
} catch (error) {
  console.error('Error al conectar a la base de datos');
}


export default db;