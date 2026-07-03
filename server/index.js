import express from 'express';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, initializeDatabase } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3001;

initializeDatabase();

app.use(express.json());

function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function formatWhatsappPhone(phone) {
  const cleanPhone = normalizePhone(phone);
  return cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
}

function formatDate(dateValue) {
  const [year, month, day] = dateValue.split('-');
  return `${day}/${month}/${year}`;
}

function buildConfirmationMessage(appointment) {
  return `Olá, ${appointment.patient_name}! Sua consulta na Clínica Iluminamente foi confirmada para ${formatDate(appointment.slot_date)} às ${appointment.slot_time}. Até breve.`;
}

function getAppointmentById(id) {
  return db.prepare(`
    SELECT
      appointments.id,
      appointments.patient_name,
      appointments.patient_phone,
      appointments.patient_notes,
      appointments.status,
      appointments.confirmation_message,
      appointments.requested_at,
      appointments.confirmed_at,
      appointment_slots.professional_id,
      appointment_slots.slot_date,
      appointment_slots.slot_time,
      professionals.name AS professional_name,
      professionals.specialty,
      session_records.session_summary,
      session_records.patient_report,
      session_records.clinical_notes,
      session_records.updated_at AS session_updated_at
    FROM appointments
    JOIN appointment_slots ON appointment_slots.id = appointments.slot_id
    JOIN professionals ON professionals.id = appointment_slots.professional_id
    LEFT JOIN session_records ON session_records.appointment_id = appointments.id
    WHERE appointments.id = ?
  `).get(id);
}

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/slots', (request, response) => {
  const slots = db.prepare(`
    SELECT
      appointment_slots.id,
      appointment_slots.slot_date,
      appointment_slots.slot_time,
      professionals.name AS professional_name,
      professionals.specialty
    FROM appointment_slots
    JOIN professionals ON professionals.id = appointment_slots.professional_id
    WHERE appointment_slots.status = 'available'
      AND appointment_slots.slot_date >= date('now')
    ORDER BY appointment_slots.slot_date, appointment_slots.slot_time
  `).all();

  response.json(slots);
});

app.post('/api/appointments', (request, response) => {
  const { slotId, patientName, patientPhone, patientNotes } = request.body;
  const selectedSlotId = Number(Array.isArray(slotId) ? slotId[0] : slotId);
  const cleanPhone = normalizePhone(patientPhone);

  if (!selectedSlotId || !patientName || cleanPhone.length < 10) {
    response.status(400).json({ message: 'Informe nome, telefone e horário disponível.' });
    return;
  }

  const slot = db.prepare(`
    SELECT id, status
    FROM appointment_slots
    WHERE id = ?
  `).get(selectedSlotId);

  if (!slot || slot.status !== 'available') {
    response.status(409).json({ message: 'Este horário não está mais disponível.' });
    return;
  }

  const transaction = db.transaction(() => {
    const result = db.prepare(`
      INSERT INTO appointments (slot_id, patient_name, patient_phone, patient_notes)
      VALUES (?, ?, ?, ?)
    `).run(selectedSlotId, patientName.trim(), cleanPhone, patientNotes?.trim() || null);

    db.prepare(`
      UPDATE appointment_slots
      SET status = 'reserved'
      WHERE id = ?
    `).run(selectedSlotId);

    return result.lastInsertRowid;
  });

  const appointmentId = transaction();
  response.status(201).json(getAppointmentById(appointmentId));
});

app.post('/api/login', (request, response) => {
  const { email, password } = request.body;
  const user = db.prepare(`
    SELECT id, name, email, password_hash, role
    FROM staff_users
    WHERE email = ?
  `).get(String(email || '').trim().toLowerCase());

  if (!user || !bcrypt.compareSync(String(password || ''), user.password_hash)) {
    response.status(401).json({ message: 'E-mail ou senha inválidos.' });
    return;
  }

  response.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

app.get('/api/appointments', (request, response) => {
  const appointments = db.prepare(`
    SELECT
      appointments.id,
      appointments.patient_name,
      appointments.patient_phone,
      appointments.patient_notes,
      appointments.status,
      appointments.confirmation_message,
      appointments.requested_at,
      appointments.confirmed_at,
      appointment_slots.professional_id,
      appointment_slots.slot_date,
      appointment_slots.slot_time,
      professionals.name AS professional_name,
      professionals.specialty,
      session_records.session_summary,
      session_records.patient_report,
      session_records.clinical_notes,
      session_records.updated_at AS session_updated_at
    FROM appointments
    JOIN appointment_slots ON appointment_slots.id = appointments.slot_id
    JOIN professionals ON professionals.id = appointment_slots.professional_id
    LEFT JOIN session_records ON session_records.appointment_id = appointments.id
    ORDER BY appointment_slots.slot_date, appointment_slots.slot_time
  `).all();

  response.json(appointments);
});

app.post('/api/appointments/:id/confirm', (request, response) => {
  const { staffUserId } = request.body;
  const appointment = getAppointmentById(request.params.id);

  if (!appointment) {
    response.status(404).json({ message: 'Agendamento não encontrado.' });
    return;
  }

  if (appointment.status === 'confirmed') {
    response.json({
      appointment,
      whatsappUrl: `https://wa.me/${formatWhatsappPhone(appointment.patient_phone)}?text=${encodeURIComponent(appointment.confirmation_message)}`,
    });
    return;
  }

  const message = buildConfirmationMessage(appointment);

  db.prepare(`
    UPDATE appointments
    SET status = 'confirmed',
        confirmation_message = ?,
        confirmed_by = ?,
        confirmed_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(message, staffUserId || null, appointment.id);

  const updatedAppointment = getAppointmentById(appointment.id);
  const whatsappUrl = `https://wa.me/${formatWhatsappPhone(updatedAppointment.patient_phone)}?text=${encodeURIComponent(message)}`;

  response.json({
    appointment: updatedAppointment,
    whatsappUrl,
  });
});

app.post('/api/appointments/:id/session', (request, response) => {
  const { staffUserId, sessionSummary, patientReport, clinicalNotes } = request.body;
  const appointment = getAppointmentById(request.params.id);

  if (!appointment) {
    response.status(404).json({ message: 'Agendamento não encontrado.' });
    return;
  }

  if (!staffUserId || !sessionSummary?.trim() || !patientReport?.trim()) {
    response.status(400).json({ message: 'Informe resumo da sessão, relatório e profissional responsável.' });
    return;
  }

  const transaction = db.transaction(() => {
    db.prepare(`
      INSERT INTO session_records (
        appointment_id,
        professional_id,
        staff_user_id,
        session_summary,
        patient_report,
        clinical_notes
      )
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(appointment_id) DO UPDATE SET
        staff_user_id = excluded.staff_user_id,
        session_summary = excluded.session_summary,
        patient_report = excluded.patient_report,
        clinical_notes = excluded.clinical_notes,
        updated_at = CURRENT_TIMESTAMP
    `).run(
      appointment.id,
      appointment.professional_id,
      staffUserId,
      sessionSummary.trim(),
      patientReport.trim(),
      clinicalNotes?.trim() || null,
    );

    db.prepare(`
      UPDATE appointments
      SET status = 'completed'
      WHERE id = ?
    `).run(appointment.id);

    db.prepare(`
      UPDATE appointment_slots
      SET status = 'completed'
      WHERE id = (
        SELECT slot_id
        FROM appointments
        WHERE id = ?
      )
    `).run(appointment.id);
  });

  transaction();
  response.json(getAppointmentById(appointment.id));
});

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get(/.*/, (request, response) => {
  response.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(port, () => {
  console.log(`Iluminamente API running on http://localhost:${port}`);
});

server.keepAliveTimeout = 65000;

const localKeepAlive = setInterval(() => {}, 60 * 60 * 1000);

process.on('SIGTERM', () => {
  clearInterval(localKeepAlive);
  server.close();
});
