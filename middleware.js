const API_KEY = process.env.API_KEY;

function authMiddleware(req, res, next) {
    const token = req.headers["x-api-key"];
    if (!token || token !== API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}

module.exports = authMiddleware;
