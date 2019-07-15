import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {
    const header = request.request ?
        // http
        request.request.headers.authorization :
        // ws
        request.connection.context.Authorization;

    if (header) {
        const token = header.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    }

    if (requireAuth) {
        throw new Error('Authentication required')
    }

    return null;
}
export default getUserId;