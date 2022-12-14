import nodemailer from 'nodemailer';

export const sendEmail = async (req, res) => {
    try {
        const contentHTML=`
            <h1>Informacion del usuario</h1>
            <ul>
                <li>Hola usuario</li>
            </ul>
            <h2>Asunto:</h2>
            <p>Esto es un recordatorio para hacerte saber que tu contrato está a punto de expirar</p>
            <p>Puedes renovar tu contrato en el siguiente enlace:</p>
            <a>Renovar contrato</a>
        `

        let transporter = nodemailer.createTransport({
            host: 'p3plzcpnl475182.prod.phx3.secureserver.net',
            secure: true,
            port: 465,
            auth: {
                user: 'test@suntay.com.mx',
                pass: 'dotdcd123'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({
            from: '"DOTDCD - ERP Support Service" <support.service@dotdcd.com.mx>', // sender address
            to: "desarrollo@dotdcd.com", // lista de destinatarios
            subject: "Firma de contrato", // Asunto
            // text: "Hello world?", // plain text body
            html: contentHTML, // html body
        });

        return res.status(200).json(nodemailer.getTestMessageUrl(info))

    } catch (error) {
        console.log(error)
    }
}