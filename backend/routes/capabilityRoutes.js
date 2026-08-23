const express = require('express');
const { getCapabilitySnapshot, simulateActions } = require('../controllers/capabilityController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:scenarioId', authMiddleware, getCapabilitySnapshot);
router.post('/simulate', authMiddleware, simulateActions);

module.exports = router;
