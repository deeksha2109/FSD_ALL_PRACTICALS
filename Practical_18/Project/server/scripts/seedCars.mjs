import fetch from 'node-fetch';

const BASE = process.env.BASE_URL || 'http://localhost:5000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rentalhub.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function main() {
  try {
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    if (!loginRes.ok) {
      const t = await loginRes.text();
      throw new Error(`Login failed: ${loginRes.status} ${t}`);
    }
    const { token } = await loginRes.json();
    const seedRes = await fetch(`${BASE}/api/cars/seed`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!seedRes.ok) {
      const t = await seedRes.text();
      throw new Error(`Seed failed: ${seedRes.status} ${t}`);
    }
    const data = await seedRes.json();
    console.log('Seed success:', data);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
