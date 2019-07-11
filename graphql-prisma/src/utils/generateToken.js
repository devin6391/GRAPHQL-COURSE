import jwt from 'jsonwebtoken';

export default function generateToken(userId) {
    return jwt.sign({
        userId
    }, 'thisisasecret', {
        expiresIn: '7 days'
    })
}