// src/types/express/index.d.ts
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      /** Our auth middleware will attach `user` here */
      user?: {
        id: string;
        role: string;
      };
    }
  }
}
