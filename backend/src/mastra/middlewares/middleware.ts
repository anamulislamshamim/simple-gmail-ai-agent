import { type Request, type Response, type NextFunction } from "express";


export const ensureAuthenticated = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    if (req.isAuthenticated()) {
        return next();
    }
    
    // User is not logged in, reject the request.
    res.status(401).json({ error: "Access Denied: Please log in to access this resource." });
};