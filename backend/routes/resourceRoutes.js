const express = require('express');
const { getResourcesForScenario, updateResourceStatus } = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:scenarioId', authMiddleware, getResourcesForScenario);
router.put('/:scenarioId/:resourceType', authMiddleware, updateResourceStatus);

module.exports = router;
