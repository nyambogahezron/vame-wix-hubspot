import dotenv from 'dotenv';
dotenv.config();
const ENV = {
    PORT: Number(process.env['APP_PORT']) || 3000,
    DATABASE_URL: process.env['DB_URL'],
    WIX_APP_ID: process.env['WIX_APP_ID'],
    WIX_APP_SECRET: process.env['WIX_APP_SECRET'],
    WIX_PUBLIC_KEY: process.env['WIX_PUBLIC_KEY'],
    HUBSPOT_CLIENT_ID: process.env['HUBSPOT_CLIENT_ID'],
    HUBSPOT_CLIENT_SECRET: process.env['HUBSPOT_CLIENT_SECRET'],
    HUBSPOT_REDIRECT_URI: process.env['HUBSPOT_REDIRECT_URI'],
    HUBSPOT_DEVELOPER_API_KEY: process.env['HUBSPOT_DEVELOPER_API_KEY'],
};
export default ENV;
//# sourceMappingURL=env.js.map