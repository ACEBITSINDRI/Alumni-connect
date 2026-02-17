import { Readable } from 'stream';

/**
 * Middleware to fix multipart/form-data requests in Firebase Cloud Functions.
 * Firebase Functions consume the request stream, which causes Multer (busboy) to fail
 * with "Unexpected end of form". This middleware restores the stream from req.rawBody.
 */
export const fixMultipartBody = (req, res, next) => {
    if (req.method === 'POST' && req.headers['content-type']?.startsWith('multipart/form-data') && req.rawBody) {
        const stream = new Readable();
        stream.push(req.rawBody);
        stream.push(null);

        // Replace the request stream with our new stream
        req.pipe = stream.pipe.bind(stream);
        req.unpipe = stream.unpipe.bind(stream);
        req.on = stream.on.bind(stream);
    }
    next();
};
