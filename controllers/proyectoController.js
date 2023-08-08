import Proyecto from '../models/Proyecto.js';   
import Usuario from '../models/Usuario.js';

export const obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({
            '$or': [
                { 'colaboradores': { $in: req.usuario }},
                { 'creador': { $in: req.usuario }}
            ]
        }).select('-tareas');
        res.json( {proyectos} );
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const nuevoProyecto = async (req, res) => {
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;
    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

export const obtenerProyecto = async (req, res) => {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id).populate({path: 'tareas', populate: {path: 'completado', select: 'nombre'}}).populate('colaboradores', 'nombre email');
    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg: error.message});
    }
    if(
        proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(
        colaborador => colaborador._id.toString() === req.usuario._id.toString())
    ) {
        const error = new Error('Accion no valida');
        return res.status(404).json({msg: error.message});
    }
    
    res.json(proyecto);
}

export const editarProyecto = async (req, res) => {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg: error.message});
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no valida');
        return res.status(404).json({msg: error.message});
    }    
    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    try {
        const proyectoActualizado = await proyecto.save();
        res.json(proyectoActualizado);
    } catch (error) {
        console.log(error);
    }
}

export const eliminarProyecto = async (req, res) => {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg: error.message});
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no valida');
        return res.status(404).json({msg: error.message});
    }    
    try {
        await Proyecto.deleteOne();
        res.json({msg: 'Proyecto eliminado'});
    } catch(error) {
        console.log(error);
    }
}

export const buscarColaborador = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({email}).
        select('-password -confirmado -createdAt -token -updatedAt -__v');

    if(!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg: error.message});
    }

    res.json(usuario);
}

export const agregarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no valida');
        return res.status(404).json({msg: error.message});
    }

    const { email } = req.body;
    const usuario = await Usuario.findOne({email}).
        select('-password -confirmado -createdAt -token -updatedAt -__v');

    if(!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error('No puedes agregarte como colaborador');
        return res.status(404).json({msg: error.message});
    }
    if(proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error('El usuario ya es colaborador');
        return res.status(404).json({msg: error.message});
    }

    proyecto.colaboradores.push(usuario._id);
    try {
        await proyecto.save();
        res.json({msg: 'Colaborador agregado'});
    } catch (error) {
        console.log(error);
    }
}

export const eliminarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no valida');
        return res.status(404).json({msg: error.message});
    }
    proyecto.colaboradores.pull(req.body.id);
    try {
        await proyecto.save();
        res.json({msg: 'Colaborador eliminado'});
    } catch (error) {
        console.log(error);
    }
}

