const express = require('express');
const serviceRequestController = require('../controllers/serviceRequestController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// All routes in this file will require general authentication
router.use(authMiddleware.authenticate);

// POST /api/service-requests - Customer creates a new service request
router.post('/', serviceRequestController.createServiceRequest);

// GET /api/service-requests/customer - Customer views their own service requests
router.get('/customer', serviceRequestController.getCustomerServiceRequests); // Uncommented

// GET /api/service-requests/:id/customer - Customer views details of a specific request
router.get('/:id/customer', serviceRequestController.getServiceRequestDetails);

// GET /api/service-requests/provider - Provider views requests assigned to them
router.get('/provider', authMiddleware.providerRoleAuthenticate, serviceRequestController.getProviderServiceRequests); // Reinstated providerRoleAuthenticate

// PATCH /api/service-requests/:id/provider - Provider updates status (accept/reject)
router.patch('/:id/provider', authMiddleware.providerRoleAuthenticate, serviceRequestController.updateServiceRequestStatus); // Uncommented


// TODO: Add more routes as needed, e.g., for a customer to cancel a request, or view details of a specific request.

module.exports = router;
