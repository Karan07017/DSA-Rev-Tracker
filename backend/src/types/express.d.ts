declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        googleId: string;
        email: string;
      };
    }
  }
}

export {}; // Ensure it's treated as a module
