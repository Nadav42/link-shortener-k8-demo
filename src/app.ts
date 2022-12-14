import express from 'express';
import cors from 'cors';
import compression from 'compression';

export const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

