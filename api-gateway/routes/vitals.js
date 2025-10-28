const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const Redis = require('ioredis'); // NOUVEAU: Importer ioredis

// NOUVEAU: Créer un client Redis pour PUBLIER
const redisPublisher = new Redis(process.env.REDIS_URI);
const VITALS_CHANNEL = process.env.VITALS_CHANNEL || 'vitals-channel';
redisPublisher.on('connect', () => {
    console.log('[API-Vitals] Connecté à Redis (Publisher) !');
});

// Configuration de la base de données TimescaleDB
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// POST /api/vitals
router.post('/', async (req, res) => {
  const data = req.body;
  
  // 1. Logique de stockage (Lot 1) - Inchangée
  const { patientId, deviceId, timestamp, vitals } = data;
  const { heartRate, spo2, bloodPressure } = vitals;

  const query = `
    INSERT INTO vital_signs(time, patient_id, device_id, heart_rate, spo2, systolic, diastolic)
    VALUES($1, $2, $3, $4, $5, $6, $7)
  `;
  const values = [
    timestamp, patientId, deviceId, heartRate, spo2,
    bloodPressure.systolic, bloodPressure.diastolic
  ];

  try {
    // 2. Insérer dans TimescaleDB
    await pool.query(query, values);
    
    // 3. Publier sur Redis (Canal pour le Dashboard ET l'Alert Engine)
    await redisPublisher.publish(VITALS_CHANNEL, JSON.stringify(data));
    
    console.log(`[API-Vitals] Données insérées et publiées sur ${VITALS_CHANNEL}`);
    res.status(200).json({ message: 'Données reçues, stockées et publiées' });

  } catch (err) {
    console.error('[API-Vitals] Erreur insertion/publication :', err.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;