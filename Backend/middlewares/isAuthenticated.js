import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Please login to access this resource"
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if(!decode) {
            return res.status(401).json({
                success: false,
                message: "Invalid token, please login again"
            });
        }

        req.id = decode.userId;
        next();

    } catch (error) {
        console.log(error);
    }
}

export default isAuthenticated;