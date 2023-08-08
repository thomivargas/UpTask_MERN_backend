import Usuario from '../models/Usuario.js';
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';
import { emailRegister, emailOlvidePassword } from '../helpers/email.js';

export const registrar = async (req, res) => {
    const {email} = req.body;
    const existeUsuario = await Usuario.findOne({email})

    if(existeUsuario) {
        const error = new Error('El usuario ya existe'); 
        return res.status(400).json({msg: error.message});
    }
    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save();
        emailRegister({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        });
        res.json({msg: 'Usuario creado correctamente'});
    } catch(error) {
        console.log(error.response.data.msg);
    }
};

export const autenticar = async (req, res) => {
    const {email, password} = req.body;

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if(!usuario) {
        const error = new Error('El usuario no existe'); 
        return res.status(404).json({msg: error.message});  
    }
    // Comprobar si el usuario esta confirmado
    if(!usuario.confirmado) {
        const error = new Error('Cuenta no confirmada'); 
        return res.status(403).json({msg: error.message});  
    }
    // Comprobar el password
    if(await usuario.compararPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        });
    } else {
        const error = new Error('Password incorrecto'); 
        return res.status(403).json({msg: error.message});  
    }
};    

export const confirmar = async (req, res) => {
    const {token} = req.params;
    const usuarioConfirmar = await Usuario.findOne({token});

    if(!usuarioConfirmar) {
        const error = new Error('Token no valido'); 
        return res.status(403).json({msg: error.message});  
    }
    try{
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = '';
        await usuarioConfirmar.save();
        res.json({msg: 'Usuario confirmado'});
    } catch(error) {
        console.log(error);
    }
}

export const olvidePassword = async (req, res) => {
    const {email} = req.body;
    const usuario = await Usuario.findOne({email});
    if(!usuario) {
        const error = new Error('El usuario no existe'); 
        return res.status(404).json({msg: error.message});  
    }

    try {
        usuario.token = generarId();
        await usuario.save();

        // Enviar email

        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        });

        res.json({msg: 'Se envio un correo para reestablecer el password'});
    } catch (error) {
        console.log(error);    
    }
}

export const comprobarToken = async (req, res) => {
    const {token} = req.params;
    const tokenValido = await Usuario.findOne({token});

    if(tokenValido) {
        res.json({msg: 'Token valido'});
    } else {
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }
}

export const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const usuario = await Usuario.findOne({token});

    if(usuario) {
        usuario.password = password;
        usuario.token = "";
        try {
            await usuario.save();
            res.json({msg: 'Password actualizado'});
        } catch(error) {
            console.log(error);
        }
        
    } else {
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }
}

export const perfil = async (req, res) => {
    const { usuario } = req;
    console.log(usuario)
    res.json(usuario);
}