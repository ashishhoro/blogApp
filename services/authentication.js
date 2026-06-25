import  jwt  from "jsonwebtoken";

const createToken = (user) => {
    const payload = {
        _id: user._id,
        email: user.email,
        profile: user.profileImageUrl,
        role: user.role
    }

    const token = jwt.sign(
        payload,
        process.env.TOKENKEYSECRET,
        // {
        //     expiresIn: process.env.TOKENKEYSECRET_EXPRIRESIN
        // }
    )
    return token
}

const validateToken = (token) => {
    const payload = jwt.verify(token, process.env.TOKENKEYSECRET);
    return payload;
}

export {createToken, validateToken};