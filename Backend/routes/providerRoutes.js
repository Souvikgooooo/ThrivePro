const express = require('express');
const providerController = require('../controllers/providerController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Route for customers to find providers by service (requires general authentication)
router.get(
  '/by-service/:serviceName', 
  authMiddleware.authenticate, // General authentication
  providerController.getProvidersByService
);

// Protect all routes after this middleware for provider-specific actions
router.use(
  authMiddleware.authenticate,
  authMiddleware.providerRoleAuthenticate
);


// create new service
router.post('/services/create', providerController.createService); 

// update service
router.put('/services/:id', providerController.updateService); 

// delete service
router.delete('/services/:id', providerController.deleteService); 

// accept service request
router.patch(
  '/requests/:id/accept',
  providerController.acceptRequest
); 

// reject service request
router.patch(
  '/requests/:id/reject',
  providerController.rejectRequest
); 

// bill generate
router.post(
  '/requests/:id/bill',
  providerController.generateBill
); 

// add provider bank details
router.post(
  '/bankDetails',
  providerController.addProviderBankDetails
); 

// Route for recommending a provider
router.post('/recommend-provider', express.json(), providerController.recommendProvider); // Added express.json() explicitly

module.exports = router;
