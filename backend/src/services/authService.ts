import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { User, IUser } from '../models/User';

const client = new OAuth2Client(config.google.clientId);

export const authService = {
  /**
   * Verify Google OAuth ID Token
   */
  async verifyGoogleToken(token: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.google.clientId,
      });
      const payload = ticket.getPayload();
      
      if (!payload) {
        throw new Error('Invalid Google token payload');
      }

      return {
        googleId: payload.sub,
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture,
      };
    } catch (error) {
      console.error('Error verifying Google token:', error);
      throw new Error('Authentication failed');
    }
  },

  /**
   * Generate JWT for our application
   */
  generateToken(user: Partial<IUser>) {
    // Only sign essential data
    const payload = {
      id: user._id,
      googleId: user.googleId,
      email: user.email,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });
  },

  /**
   * Find or Create user in the database
   */
  async findOrCreateUser(profile: { googleId: string; email: string; name: string; picture?: string }): Promise<IUser> {
    let user = await User.findOne({ googleId: profile.googleId });

    if (!user) {
      // If user is not found by googleId, check by email to prevent duplicate email issues
      user = await User.findOne({ email: profile.email });
      
      if (user) {
        // Link google account to existing email
        user.googleId = profile.googleId;
        user.name = profile.name;
        user.picture = profile.picture;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          googleId: profile.googleId,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
        });
      }
    } else {
      // Update profile info if it changed
      let changed = false;
      if (user.name !== profile.name) {
        user.name = profile.name;
        changed = true;
      }
      if (user.picture !== profile.picture) {
        user.picture = profile.picture;
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    }

    return user;
  }
};
