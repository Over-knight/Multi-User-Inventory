import { Request,
    Response,
    NextFunction
 } from "express";
 export const isAdmin = (req: Request, res: Response, next: NextFunction):void => {
    if (req.user?.role !== "admin") {
        res.status(403).json({ message: "Access denied, Admins only"});
        return;
    }
    next();
 };

 export const isVendor = (req: Request, res: Response, next: NextFunction):void => {
    if (req.user?.role !== "admin") {
        res.status(403).json({ message: "Access denied, Vendors only"});
        return;
    }
    next();
 ;}

 export const isStaff = (req: Request, res: Response, next: NextFunction):void => {
    if (req.user?.role !== "admin") {
        res.status(403).json({ message: "Access denied, Staffs only"});
        return;
    }
    next();
 };