import jwt from 'jsonwebtoken';

const accessSecret = process.env.ACCESS_TOKEN_SECRET_KEY;

function generateToken(identity, expiration){
    const token = jwt.sign({"identity": identity},
        accessSecret,
        {expiresIn: expiration});

    return token;
}

async function authorizeUser(req, res){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({error: "Unauthorized"});
    return await jwt.verify(token, accessSecret, (err, user) => {
        if (err) return res.status(403).json({error: "Forbidden, token expired"});
        return user.identity;
    });
}


export {generateToken, authorizeUser};
