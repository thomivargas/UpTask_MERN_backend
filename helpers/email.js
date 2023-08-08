import nodemailer from "nodemailer";

export const emailRegister = async (datos) => {
    const {email, nombre, token} = datos;
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    const info = await transport.sendMail({
        from: "'UpTask - Administrador de Proyectos' <cuentas@uptask.com>",
        to: email,
        subject: "UpTask - Confirma tu cuenta",
        html: `
            <h1>Confirma tu cuenta en UpTask</h1>
            <p>Hola ${nombre}, has creado una cuenta en UpTask, para poder usarla debes confirmar tu cuenta</p>
            <p>Confirma tu cuenta haciendo click en el siguiente enlace</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar cuenta</a>
        `
    });
    return info; 
}

export const emailOlvidePassword = async (datos) => {
    const {email, nombre, token} = datos;

    // TODO: Mover a variables de entorno
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    const info = await transport.sendMail({
        from: "'UpTask - Administrador de Proyectos' <cuentas@uptask.com>",
        to: email,
        subject: "UpTask - Reestablecer tu contraseña",
        html: `
            <h1>Reestablece tu contraseña en UpTask</h1>
            <p>Hola ${nombre}, has solicitado reestablecer tu contraseña en UpTask, para poder hacerlo has click en el siguiente enlace</p>
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer contraseña</a>
            `
    });
    return info; 
}
