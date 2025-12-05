
import express from 'express';
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import projectRoutes from './routes/projectRoutes.ts';
import taskRoutes from './routes/taskRoutes.ts';
import searchRoutes from './routes/searchRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import teamRoutes from "./routes/teamRoutes.ts";
/* Routes Imports */

/*Configurations*/
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());

/*ROUTES*/

app.get('/', (req, res) => {
    res.send('This is home port');
});

app.use('/projects', projectRoutes);

app.use('/tasks', taskRoutes);

app.use('/search', searchRoutes)

app.use('/users', userRoutes)

app.use("/teams", teamRoutes);

/*SERVER*/
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});