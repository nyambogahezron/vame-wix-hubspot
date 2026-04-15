import dotenv from 'dotenv'
dotenv.config()

 const env = {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL,
    WIX_CLIENT_ID: process.env.WIX_CLIENT_ID,
    WIX_CLIENT_SECRET: process.env.WIX_CLIENT_SECRET,
    WIX_REDIRECT_URI: process.env.WIX_REDIRECT_URI,
    HUBSPOT_CLIENT_ID: process.env.HUBSPOT_CLIENT_ID,
    HUBSPOT_CLIENT_SECRET: process.env.HUBSPOT_CLIENT_SECRET,
    HUBSPOT_REDIRECT_URI: process.env.HUBSPOT_REDIRECT_URI,
    WIX_WEBHOOK_SECRET: process.env.WIX_WEBHOOK_SECRET,
    HUBSPOT_WEBHOOK_SECRET: process.env.HUBSPOT_WEBHOOK_SECRET,

}

export default env