import {validateToken} from "../services/authentication.js";

function chechForAuthenticationCookie (cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies?.token

        if(!tokenCookieValue) return next();

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            // console.log(req.user);
            
        } catch (error) {
            console.log(error);
        }
        return next();
    }
}
export {chechForAuthenticationCookie};