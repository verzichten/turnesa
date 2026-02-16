import { PrismaClient } from '../src/generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// Clean SSL params from URL to let pg.Pool config handle it
let cleanedUrl = connectionString || '';
try {
  const urlObj = new URL(cleanedUrl);
  urlObj.searchParams.delete('sslmode');
  urlObj.searchParams.delete('sslrootcert');
  urlObj.searchParams.delete('sslcert');
  urlObj.searchParams.delete('sslkey');
  cleanedUrl = urlObj.toString();
} catch (e) {
  // ignore
}

const pool = new pg.Pool({ 
  connectionString: cleanedUrl,
  ssl: false
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seed script placeholder...');
  // TODO: Implement initial seed data if needed for the new schema
  console.log('✅ Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
