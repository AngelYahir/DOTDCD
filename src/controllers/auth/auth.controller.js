import {pool} from '../../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

//? Login controller
export const login = async (req, res) => {
    const { username, password } = req.body;


    const [rows] = await pool.query("SELECT * FROM usuarios WHERE username = '" + username + "'")
    if (![rows][0].length > 0) {
        req.flash('error', { title: 'Ooops!', message: 'No pudimos encontrar a '+username+'!, intentalo con un nombre de usuario valido.' })
        return res.redirect('/')
    }
    const result = [rows][0][0]

    //? match passwords with bcryptjs
    const matchPass = await bcrypt.compare(password, result.password)
    if (!matchPass) {
        req.flash('error', { title: 'Ooops!', message: 'Lo sentimos '+username+'!, tu contraseña es incorrecta, intentalo de nuevo.' })
        return res.redirect('/')
    }

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
    req.app.locals = {username: result.username, profile_img: result.profile_img}
    res.setHeader("Set-Cookie", serialized);
    return res.status(200).redirect('/dashboard')

}

//? logout controller
export const logout = async (req, res) => {
    try {
        //? destroy cookie and jwt 
        const { sessionToken } = req.cookies;
        if (!sessionToken) return res.status(500).json({ error: "Not logged in" })

        const serialized = cookie.serialize('sessionToken', null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });

        res.setHeader("Set-Cookie", serialized);
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}
