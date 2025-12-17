import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

passport.deserializeUser((id: any, done) => {
    const user = { ...id }; 
    done(null, user);
});

passport.serializeUser((user: any, done) => {
    try {
        console.log("Attempting to serialize:", user?.email);
        if (!user) {
            return done(new Error("No user to serialize"));
        }
        // Force the whole object through
        return done(null, user); 
    } catch (err) {
        return done(err);
    }
});

// Google Strategy Setup
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    // Scope defines what info you request from Google
    scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/gmail.readonly",
    ] 
},
(accessToken, refreshToken, profile, done) => {
    try {
      console.log("🎯 Google Strategy Verify Callback reached!");
      
      const userProfile = {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : 'N/A',
          accessToken: accessToken,
      };

      console.log("Strategy created profile for:", userProfile.email);
      return done(null, userProfile);
    } catch (error) {
        console.error("Critical error in Strategy verify callback:", error);
        return done(error as Error);
    }
}));

export default passport;