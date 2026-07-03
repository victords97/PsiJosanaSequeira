import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'iluminamente.sqlite');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS staff_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'professional',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS professionals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      specialty TEXT NOT NULL,
      whatsapp_phone TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS appointment_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      professional_id INTEGER NOT NULL,
      slot_date TEXT NOT NULL,
      slot_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (professional_id, slot_date, slot_time),
      FOREIGN KEY (professional_id) REFERENCES professionals(id)
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slot_id INTEGER NOT NULL UNIQUE,
      patient_name TEXT NOT NULL,
      patient_phone TEXT NOT NULL,
      patient_notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      confirmation_message TEXT,
      confirmed_by INTEGER,
      requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      confirmed_at TEXT,
      FOREIGN KEY (slot_id) REFERENCES appointment_slots(id),
      FOREIGN KEY (confirmed_by) REFERENCES staff_users(id)
    );

    CREATE TABLE IF NOT EXISTS session_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id INTEGER NOT NULL UNIQUE,
      professional_id INTEGER NOT NULL,
      staff_user_id INTEGER NOT NULL,
      session_summary TEXT NOT NULL,
      patient_report TEXT NOT NULL,
      clinical_notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (appointment_id) REFERENCES appointments(id),
      FOREIGN KEY (professional_id) REFERENCES professionals(id),
      FOREIGN KEY (staff_user_id) REFERENCES staff_users(id)
    );
  `);
}

function seedStaffUser() {
  const existing = db
    .prepare('SELECT id FROM staff_users WHERE email = ?')
    .get('equipe@iluminamente.com.br');

  if (existing) {
    return;
  }

  const passwordHash = bcrypt.hashSync('Ilumina@123', 10);

  db.prepare(`
    INSERT INTO staff_users (name, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `).run('Conta Teste Iluminamente', 'equipe@iluminamente.com.br', passwordHash, 'professional');
}

function seedProfessionalsAndSlots() {
  const professionalCount = db.prepare('SELECT COUNT(*) as total FROM professionals').get().total;

  if (professionalCount === 0) {
    db.prepare(`
      INSERT INTO professionals (name, specialty, whatsapp_phone)
      VALUES (?, ?, ?)
    `).run('Dra. Marina Luz', 'Psicóloga clínica', '5592999999999');
  }

  const professional = db.prepare('SELECT id FROM professionals WHERE active = 1 LIMIT 1').get();
  const slotCount = db.prepare('SELECT COUNT(*) as total FROM appointment_slots').get().total;

  if (!professional || slotCount > 0) {
    return;
  }

  const today = new Date();
  const insertSlot = db.prepare(`
    INSERT OR IGNORE INTO appointment_slots (professional_id, slot_date, slot_time)
    VALUES (?, ?, ?)
  `);

  for (let dayOffset = 1; dayOffset <= 12; dayOffset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);

    const weekday = date.getDay();
    if (weekday === 0 || weekday === 6) {
      continue;
    }

    const isoDate = date.toISOString().slice(0, 10);
    ['09:00', '10:30', '14:00', '15:30'].forEach((time) => {
      insertSlot.run(professional.id, isoDate, time);
    });
  }
}

export function initializeDatabase() {
  createSchema();
  seedStaffUser();
  seedProfessionalsAndSlots();
}
