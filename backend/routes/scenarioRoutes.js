const express = require('express');
const { getScenarios, getScenarioById } = require('../controllers/scenarioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getScenarios);
router.get('/:scenarioId', authMiddleware, getScenarioById);

module.exports = router;
