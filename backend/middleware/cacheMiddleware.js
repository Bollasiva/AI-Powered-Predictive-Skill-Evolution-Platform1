const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); // Cache for 1 hour

/**
 * Cache Middleware
 * @param {number} duration - Optional TTL in seconds
 */
const cacheMiddleware = (duration) => (req, res, next) => {
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
        res.sendResponse = res.json;
        res.json = (body) => {
            myCache.set(key, body, duration);
            res.sendResponse(body);
        };
        next();
    }
};

module.exports = cacheMiddleware;
