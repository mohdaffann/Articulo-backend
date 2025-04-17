import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

export const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token
    if (!token)
        return res.status(400).json({ message: "user not authorized please login" })

    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log('decoded token:', decode.profile);

        req.user = decode
        next()
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token. Please log in again." });
    }
}

