import { defineConfig } from 'drizzle-kit'
import ENV from './src/config/env'

export default defineConfig({
	out: './drizzle',
	schema: './src/database/schema/index.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: ENV.DATABASE_URL!,
	},
})
