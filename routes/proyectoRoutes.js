import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { 
    obtenerProyectos, 
    nuevoProyecto, 
    obtenerProyecto, 
    editarProyecto, 
    eliminarProyecto, 
    agregarColaborador, 
    eliminarColaborador,
    buscarColaborador
} from '../controllers/proyectoController.js';


const router = express.Router();

// Obtener todos los proyectos
router.get('/', checkAuth, obtenerProyectos);

// Crear un nuevo proyecto
router.post('/', checkAuth, nuevoProyecto);

// Obtener un proyecto por su ID
router.get('/:id', checkAuth, obtenerProyecto);

// Actualizar un proyecto por su ID
router.put('/:id', checkAuth, editarProyecto);

// Eliminar un proyecto por su ID
router.delete('/:id', checkAuth ,eliminarProyecto);

// Buscar un colaborador por su email
router.post('/colaboradores', checkAuth, buscarColaborador);

// Agregar un colaborador a un proyecto
router.post('/colaboradores/:id', checkAuth, agregarColaborador);

// Eliminar un colaborador de un proyecto
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador);

export default router;

