const controller = {}
const pool = require('../../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

//? Login controller
controller.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query("SELECT username, password FROM usuarios WHERE username = '" + username + "'")
        if (![rows][0].length > 0) return res.status(404).json('Credenciales no validas')
        const result = [rows][0][0]

        //? match passwords with bcryptjs
        const matchPass = await bcrypt.compare(password, result.password)
        if (!matchPass) return res.status(404).json('contrasena incorrecta')

        //? create json web token
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 100) + 60 * 60 * 24 * 30,
                username
            },
            process.env.SECRET
        )

        //? create serialize cookie
        const serialized = cookie.serialize('sessionToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: "/"
        });

        //? set cookie in header
        res.setHeader("Set-Cookie", serialized);
        return res.status(200).redirect('/home')

    } catch (error) {
        res.status(500).json(error);
    }
}

//? logout controller
controller.logout = async (req, res) => {
    try {
        //? destroy cookie and jwt 
        const { sessionToken } = req.cookies;
        if (!sessionToken) return res.status(500).json({ error: "Not logged in" })

        const serialized = cookie.serialize('sessionToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });

        res.setHeader("Set-Cookie", serialized);
        return res.status(200).redirect('/')
    } catch (error) {
        return res.status(500).json(error)
    }
}