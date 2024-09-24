import jwt from 'jsonwebtoken';

const accessSecret = process.env.ACCESS_TOKEN_SECRET_KEY;

function generateToken(identity, expiration){
    const token = jwt.sign({"identity": identity},
        accessSecret,
        {expiresIn: expiration});

    return token;
}

async function authorizeUser(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    await jwt.verify(token, accessSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Forbidden, token expired" });
        }
        req.currentUserId = user.identity;  // Attach user data to request
        if (next) next();  // Pass control to the next middleware or route handler
    });
}


export {generateToken, authorizeUser};
