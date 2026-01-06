import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); // Cache for 1 hour

const cacheMiddleware = (duration: number) => (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests or specific POST requests (like recommendations)
    if (req.method !== 'GET' && req.method !== 'POST') {
        return next();
    }

    const key = `__express__${req.originalUrl || req.url}_${JSON.stringify(req.body)}`;
    const cachedResponse = myCache.get(key);

    if (cachedResponse) {
        console.log(`[Cache] Hit: ${key}`);
        return res.json(cachedResponse);
    } else {
        console.log(`[Cache] Miss: ${key}`);
        const sendResponse = res.json.bind(res);
        res.json = (body: any) => {
            myCache.set(key, body, duration);
            return sendResponse(body);
        };
        next();
    }
};

export default cacheMiddleware;
