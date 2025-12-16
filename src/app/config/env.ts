import dotenv from "dotenv"

dotenv.config()

interface envConfig{
     PORT: string,
     DB_URL: string,
    NODE_ENV: "development" | "production"
}

const loadEnvVars = ():envConfig =>{

    const reqEnvVars : string[] = [  "PORT", "DB_URL", "NODE_ENV" ]

    reqEnvVars.forEach(key=>{
        if(!process.env[key]){
            throw new Error(`missing  env vars ${key}`)
        }
    })

    return  {
    PORT:process.env.PORT as string,    
    DB_URL: process.env.DB_URL as string,
    NODE_ENV:process.env.NODE_ENV as "development" | "production"
}
}

export const envVers:envConfig = loadEnvVars()