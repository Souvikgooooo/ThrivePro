const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User'); // To validate provider
const Service = require('../models/Service'); // Import Service model
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createServiceRequest = catchAsync(async (req, res, next) => {
  const {
    providerId,
    // service_id, // No longer expecting service_id directly from client for this approach
    serviceName,
    servicePrice,
    customerAddress,
    nearestPoint,
    time_slot,
  } = req.body;

  const customerId = req.user.id; // Authenticated user's ID

  console.log('Received booking payload (attempting lookup by name/provider):', req.body);

  // Basic validation (service_id removed, serviceName and providerId become more critical)
  if (!providerId || !serviceName || !servicePrice || !customerAddress || !time_slot) {
    return next(new AppError('Please provide provider, service name, price, address, and time slot.', 400));
  }

  // Validate providerId (check if it's a valid provider)
  const providerUser = await User.findOne({ _id: providerId, role: 'provider' });
  if (!providerUser) {
    return next(new AppError('Invalid service provider selected.', 404));
  }

  // Lookup the service by name and providerId
  // This assumes service names are unique per provider. If not, this logic is flawed.
  const actualService = await Service.findOne({ name: serviceName, provider: providerId });

  if (!actualService) {
    // If service not found by name and provider, reject request
    // This is because ServiceRequest model requires a valid reference to a Service document
    return next(new AppError(`Service "${serviceName}" not found for the selected provider. Booking cannot proceed.`, 404));
  }
  const actualServiceId = actualService._id; // Get the _id of the found service

  // Parse time_slot to ensure it's a valid date
  const requestedDateTime = new Date(time_slot);
  if (isNaN(requestedDateTime.getTime())) {
      return next(new AppError('Invalid date or time format for the time slot.', 400));
  }
  // Optional: Check if requestedDateTime is in the past
  if (requestedDateTime < new Date()) {
      return next(new AppError('The requested time slot cannot be in the past.', 400));
  }

  const newServiceRequest = await ServiceRequest.create({
    customer: customerId,
    provider: providerId,
    service: actualServiceId, // Use the _id of the service found by name/provider
    serviceNameSnapshot: serviceName, // Snapshot of service name at time of booking
    servicePriceSnapshot: servicePrice, // Snapshot of price at time of booking
    customerAddress,
    customerPhoneNumberSnapshot: req.user.phone_number, // Taking from authenticated user profile
    customerNameSnapshot: req.user.name, // Taking from authenticated user profile
    nearestPoint,
    time_slot: requestedDateTime,
    status: 'pending', // Initial status, changed to lowercase
    // Add any other fields from your ServiceRequest model schema
  });

  res.status(201).json({
    status: 'success',
    message: 'Service request created successfully. Waiting for provider confirmation.',
    data: {
      serviceRequest: newServiceRequest,
    },
  });
});

// TODO: Implement other controller functions as outlined in serviceRequestRoutes.js

exports.getCustomerServiceRequests = catchAsync(async (req, res, next) => {
  const customerId = req.user.id; // Assuming authMiddleware.authenticate populates req.user
  console.log(`[getCustomerServiceRequests] Attempting to fetch requests for customer ID: ${customerId}`);

  const serviceRequests = await ServiceRequest.find({ customer: customerId })
    .populate('provider', 'name email') // Populate provider's name and email
    .populate('service', 'name description') // Populate basic service details
    .sort({ createdAt: -1 }); // Show newest requests first

  if (!serviceRequests) {
    return next(new AppError('Could not retrieve your service requests or none found.', 404));
  }

  res.status(200).json({
    status: 'success',
    results: serviceRequests.length,
    data: {
      serviceRequests,
    },
  });
});

exports.getServiceRequestDetails = catchAsync(async (req, res, next) => {
  const { id: requestId } = req.params;
  const customerId = req.user.id;

  const serviceRequest = await ServiceRequest.findOne({ _id: requestId, customer: customerId })
    .populate('provider', 'name email phone_number profile_image') // Populate provider details
    .populate('service', 'name description images'); // Populate service details

  if (!serviceRequest) {
    return next(new AppError('Service request not found or you are not authorized to view it.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      serviceRequest,
    },
  });
});

exports.getProviderServiceRequests = catchAsync(async (req, res, next) => {
  const providerId = req.user.id; // Assuming authMiddleware.authenticate populates req.user
  console.log(`[getProviderServiceRequests] Attempting to fetch requests for provider ID: ${providerId}`);

  const serviceRequests = await ServiceRequest.find({ provider: providerId })
    .populate('customer', 'name email phone_number') // Populate customer's name, email, phone
    .populate('service', 'name description') // Populate basic service details like name
    .sort({ createdAt: -1 }); // Show newest requests first

  if (!serviceRequests) {
    // This case might not be strictly necessary if find() returns [] for no matches,
    // but good for clarity or if an actual error occurred.
    return next(new AppError('Could not retrieve service requests or none found.', 404));
  }

  res.status(200).json({
    status: 'success',
    results: serviceRequests.length,
    data: {
      serviceRequests,
    },
  });
});

exports.updateServiceRequestStatus = catchAsync(async (req, res, next) => {
  const { id: requestId } = req.params;
  const { status: newStatus } = req.body; // Renamed for clarity
  const providerId = req.user.id;

  // Validate that newStatus is a valid status string provider can set
  const allowedStatusesByProvider = ['accepted', 'rejected', 'in-progress', 'completed'];
  if (!newStatus || !allowedStatusesByProvider.includes(newStatus)) {
    return next(new AppError(
      `Invalid status value '${newStatus}'. Provider can set status to: ${allowedStatusesByProvider.join(', ')}.`, 
      400
    ));
  }

  const serviceRequest = await ServiceRequest.findById(requestId);

  if (!serviceRequest) {
    return next(new AppError('Service request not found.', 404));
  }

  // Ensure the logged-in provider is the one assigned to this request
  if (serviceRequest.provider.toString() !== providerId) {
    return next(new AppError('You are not authorized to update this service request.', 403));
  }

  const currentStatus = serviceRequest.status;
  let isValidTransition = false;

  // Define valid transitions
  if (currentStatus === 'pending' && (newStatus === 'accepted' || newStatus === 'rejected')) {
    isValidTransition = true;
  } else if (currentStatus === 'accepted' && newStatus === 'in-progress') {
    isValidTransition = true;
  } else if (currentStatus === 'in-progress' && newStatus === 'completed') {
    isValidTransition = true;
  }
  // Add other transitions here if needed, e.g., cancellation from 'accepted' or 'in-progress'

  if (!isValidTransition) {
    return next(new AppError(`Cannot change status from '${currentStatus}' to '${newStatus}'.`, 400));
  }

  serviceRequest.status = newStatus;
  await serviceRequest.save();

  // If status is 'completed', generate a bill
  if (newStatus === 'completed') {
    const Bill = require('../models/Bill'); // Ensure Bill model is imported
    try {
      // Check if a bill already exists for this request to prevent duplicates
      const existingBill = await Bill.findOne({ request: serviceRequest._id });
      if (!existingBill) {
        await Bill.create({
          request: serviceRequest._id,
          customer: serviceRequest.customer,
          provider: serviceRequest.provider,
          service: serviceRequest.service,
          amount: serviceRequest.servicePriceSnapshot, // Use the snapshotted price
          status: 'unpaid', // Corrected initial bill status
          // You might want to add bill_date, due_date, etc.
        });
        console.log(`Bill created for ServiceRequest ID: ${serviceRequest._id}`);
      } else {
        console.log(`Bill already exists for ServiceRequest ID: ${serviceRequest._id}`);
      }
    } catch (billError) {
      console.error(`Error creating bill for ServiceRequest ID ${serviceRequest._id}:`, billError);
      // Decide if this should be a critical error stopping the response,
      // or just log it and continue. For now, logging.
      // return next(new AppError('Failed to generate bill for the completed service.', 500));
    }
  }

  // TODO: Potentially send notifications to customer upon status change

  res.status(200).json({
    status: 'success',
    message: `Service request status updated to ${newStatus} successfully.`,
    data: {
      serviceRequest,
    },
  });
});
