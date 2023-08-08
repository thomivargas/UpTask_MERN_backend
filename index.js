import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';

const app = express();
app.use(express.json());
dotenv.config()
connectDB();

//Configuracion de cors
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.includes(origin)){
            // puede consultar la API
            callback(null, true)
        }else{
            // bloquear el acceso
            callback(new Error('Not allowed by CORS'))
        }
    },
};

app.use(cors(corsOptions));

//Rounting 
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes); 
app.use('/api/tareas', tareaRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Socket.io

import { Server } from 'socket.io';

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});

io.on('connection', (socket) => {
    //console.log('Nuevo cliente conectado', socket.id);
    
    socket.on('abrirProyecto', (proyecto) => {
        socket.join(proyecto);
    });

    socket.on('nueva-tarea', (tarea) => {
        const proyecto = tarea.proyecto;
        io.to(proyecto).emit('tarea-agregada', tarea);
    });

    socket.on('eliminar-tarea', (tarea) => {
        const proyecto = tarea.proyecto;
        io.to(proyecto).emit('tarea-eliminada', tarea);
    });

    socket.on('editar-tarea', tarea => {
        const proyecto = tarea.proyecto._id;
        io.to(proyecto).emit('tarea-editada', tarea);
    });

    socket.on('completar-tarea', tarea => {
        const proyecto = tarea.proyecto._id;
        io.to(proyecto).emit('tarea-completada', tarea);
    })
});