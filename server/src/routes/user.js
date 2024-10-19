const express = require('express');
const { updateProfile, getSubscriptionDetails, upgradeSubscription } = require('../controllers/userController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfileSchema, upgradeSubscriptionSchema } = require('../utils/validators');

const router = express.Router();

router.put('/profile', auth, validate(updateProfileSchema), updateProfile);
router.get('/subscription', auth, getSubscriptionDetails);
router.post('/subscription/upgrade', auth, validate(upgradeSubscriptionSchema), upgradeSubscription);

module.exports = router;