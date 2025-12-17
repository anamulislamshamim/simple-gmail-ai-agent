import 'dotenv/config'
import express, { type Request, type Response } from "express";
import cors from "cors";
import passport from "./auth/auth.ts"; 
import chatRouter from "./routes/chat.routes.ts";
import cookieParser from "cookie-parser"; 
import session from "express-session";
import { createClient } from "redis"; 
import { RedisStore } from "connect-redis"; 

const SESSION_SECRET = "jh8b5blapg9im9p747g1h"; 

// Initialize Redis client
let redisClient = createClient({
    url: 'redis://localhost:6379' 
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error); 

// 💾 2. Create the Redis store instance
let redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
});

const app = express();

// --- Core Middleware ---

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(cookieParser());

// Session Middleware configured with the working settings
app.use(session({
    store: redisStore,
    secret: SESSION_SECRET, 
    resave: false,        
    saveUninitialized: true, // Kept at 'true' as this works with your current setup
    cookie: { 
        secure: false, 
        httpOnly: true,
        sameSite: 'lax',     // Set to 'lax' for local development cross-origin safety
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

// Initialize Passport and Session
app.use(passport.initialize());
app.use(passport.session()); 

// --- Passport Routes ---

app.get(
    "/api/auth/google",
    passport.authenticate("google", { 
        scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/gmail.readonly",
        ] 
    }) 
);

// --- Passport Routes ---

app.get(
    "/api/auth/callback/google",
    // Call passport.authenticate with NO options object, but use the custom handler
    (req, res, next) => {
        // We use 'any' here just to simplify the types for session and login methods
        passport.authenticate("google", async (err: any, user: any, info: any) => { 
            if (err) {
                console.error("Authentication error:", err);
                return res.redirect("http://localhost:5173/login?error=true");
            }
            if (!user) {
                console.error("No user returned from authentication");
                return res.redirect("http://localhost:5173/login?error=true");
            }

            console.log("🐛 User object received by logIn:", user); // <-- ADD THIS LINE

            // Manually call req.logIn() and wait for its completion
            await new Promise<void>((resolve, reject) => {
                req.logIn(user, (loginErr: any) => {
                    if (loginErr) {
                        return reject(loginErr);
                    }
                    resolve();
                });
            });

            // After req.logIn (which added passport.user to session), force the session save
            try {
                await new Promise<void>((resolve, reject) => {
                    req.session.save((sessionErr: any) => {
                        if (sessionErr) {
                            return reject(sessionErr);
                        }
                        resolve();
                    });
                });
                
                console.log("✅ Session saved! User:", req.user);
                return res.redirect("http://localhost:5173/chat");
                
            } catch (error) {
                console.error("Error saving session to Redis:", error);
                return res.redirect("http://localhost:5173/login?error=true");
            }

        })(req, res, next); // Don't forget to call the middleware with req, res, next
    }
);

// --- General Middleware ---

app.use(express.json());

app.use("/api/chat", chatRouter);

app.listen(3000, () => {
    console.log("Backend is running on port 3000");
});