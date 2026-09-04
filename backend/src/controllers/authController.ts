import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { config } from '../config/env';

export const authController = {
  /**
   * Handle Google Login
   * Expects { credential } (Google ID Token) in request body
   */
  async googleLogin(req: Request, res: Response) {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({ error: 'Google credential is required' });
      }

      // 1. Verify Google token
      const profile = await authService.verifyGoogleToken(credential);

      // 2. Find or Create User in our system
      const user = await authService.findOrCreateUser(profile);

      // 3. Generate our application JWT
      const token = authService.generateToken(user);

      // 4. Set JWT in HTTP-only cookie
      const isProduction = config.nodeEnv === 'production';
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // 5. Return user data and token
      res.status(200).json({
        message: 'Authentication successful',
        token, // Add token to response so frontend can store it in localStorage
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
        }
      });
    } catch (error) {
      console.error('Google login error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  },

  /**
   * Handle Logout
   */
  logout(req: Request, res: Response) {
    const isProduction = config.nodeEnv === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  },

  /**
   * Check Current User Session
   */
  getCurrentUser(req: Request, res: Response) {
    // req.user will be populated by authMiddleware
    // Return the user object if authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    res.status(200).json({ user: req.user });
  }
};
