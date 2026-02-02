import passport, { Profile } from "passport";
import { Strategy as googleStrategy, VerifyCallback } from "passport-google-oauth2";
import { envVers } from "./env";
import { User } from "../modulars/users/user.model";
import { Role } from "../modulars/users/user.interface";

passport.use(
    new googleStrategy ({
         clientID:envVers.GOOGLE_CLIENT_ID,
         clientSecret:envVers.GOOGLE_CLIENT_SECRET,
         callbackURL:envVers.GOOGLE_CALLBACK_URL
    }, async (accessToken:string, refreshToken:string, profile:Profile, done:VerifyCallback )=>{
        try {
            const email = profile.emails?.[0].value
            if(!email){
                return done(null, false,{message:"email not found"})
            }

            let user = await User.findOne({email})

            if(!user){
                user = await User.create({
                    email,
                    name:profile.displayName,
                    picture:profile.photos?.[0].value,
                    role:Role.USER,
                    IsVerified:true,
                    auths:[{
                       provider:"google",
                       providerID:profile.id
                    }]
                })
            }

            return done (null, user)
                
        } catch (error) {
            console.log('google Strategy error', error);

            return done ( error)
        }
    } )
)


// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user:any, done:(err:any, id?:unknown)=>void)=>{
    done(null, user._id)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser( async (id:string, done:any)=>{
      try {
        const user = await User.findById(id)
        done(null, user)
      } catch (error) {
         done(error)
      }
})