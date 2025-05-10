const Service = require('../models/Service');
const ServiceRequest = require('../models/ServiceRequest');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const Review = require('../models/Review');

// New controller function to get all services
exports.getAllServices = catchAsync(async (req, res, next) => {
  const services = await Service.find().populate('provider', 'name email'); // Populate provider details

  res.status(200).json({
    status: 'success',
    results: services.length,
    data: services
  });
});

exports.getAllParentServices = catchAsync(async (req, res, next) => {
  const parentServices = await Service.aggregate([
    { $match: { parent_service: null } },
    { $group: { _id: "$name", count: { $sum: 1 }, services: { $push: "$address" } } }
  ]);

  res.status(200).json({
    status: 'success',
    results: parentServices.length,
    data: parentServices
  });
});

exports.getFilteredServices = catchAsync(async (req, res, next) => {
  const { service_name } = req.params;
  let { radius = 10, minPrice = 0, maxPrice = Number.MAX_VALUE } = req.query; // Default radius 10km

  // Validate radius and prices
  radius = Number(radius);
  minPrice = Number(minPrice);
  maxPrice = Number(maxPrice);
console.log(radius, minPrice, maxPrice);
  if (isNaN(radius) || radius <= 0) return next(new AppError('Invalid radius parameter', 400));
  if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
    return next(new AppError('Invalid price range parameters', 400));
  }

  // 1. Get user's location
  const user = await User.findById(req.user.id);
  if (!user?.location?.coordinates) {
    return next(new AppError('User location not found', 400));
  }

  // 2. Perform geospatial query with price filter
  const services = await Service.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: user.location.coordinates
        },
        distanceField: 'distance',
        maxDistance: radius * 1000, // Convert km to meters
        spherical: true,
        query: { 
          name: service_name,
          parent_service: null, // Only parent services
          price: { $gte: minPrice, $lte: maxPrice }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'provider',
        foreignField: '_id',
        as: 'provider_info'
      }
    },
    {
      $unwind: '$provider_info'
    },
    {
      $project: {
        _id: 1,
        name: 1,
        price: 1,
        address: 1,
        provider: '$provider_info.name',
        distance: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: services.length,
    data: services.map(s => ({
      service_id: s._id,
      name: s.name,
      provider: s.provider,
      price: s.price,
      address: s.address
    }))
  });
});

exports.getServiceDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // 1. Find the main service with provider and parent service details
  const service = await Service.findById(id)
    .populate({ path: 'provider', select: 'name' }) // Ensure provider name is available
    .populate({ path: 'parent_service', select: 'name price' }); // Ensure parent service details are available

  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  // 2. Find child services
  const childServices = await Service.find({ parent_service: id })
    .select('_id name price');

  // 3. Format response
  const response = {
    service_id: service._id,
    name: service.name,
    description: service.description,
    price: service.price,
    provider: service.provider ? service.provider.name : "Not Available",
    address: service.address,
    parent_service: service.parent_service ? {
      name: service.parent_service.name,
      price: service.parent_service.price
    } : null,
    child_services: childServices.map(child => ({
      service_id: child._id,
      name: child.name,
      price: child.price
    }))
  };

  res.status(200).json({
    status: 'success',
    data: response
  });
});

exports.createServiceRequest = catchAsync(async (req, res, next) => {
  const { service_id, time_slot, customerAddress } = req.body; // Added customerAddress

  // 1. Validate required fields
  // Customer address might be optional depending on service type, handled by model if made required there.
  if (!service_id || !time_slot) { 
    return next(new AppError('Please provide service ID and time slot.', 400));
  }

  // 2. Validate time slot
  const requestedTime = new Date(time_slot);
  if (isNaN(requestedTime.getTime()) || requestedTime < new Date()) { // Enhanced validation
    return next(new AppError('Time slot must be a valid date in the future.', 400));
  }

  // 3. Check if service exists and get its details
  const service = await Service.findById(service_id).populate('provider', '_id'); // Ensure provider ID is available
  if (!service) {
    return next(new AppError('Service not found.', 404));
  }
  if (!service.provider || !service.provider._id) {
    return next(new AppError('Service provider information is missing.', 500));
  }


  // 4. Create service request with snapshots
  const newRequest = await ServiceRequest.create({
    service: service_id,
    customer: req.user.id,
    provider: service.provider._id, // Assign the provider from the service
    time_slot: requestedTime,
    serviceNameSnapshot: service.name, // Snapshot service name
    servicePriceSnapshot: service.price, // Snapshot service price
    customerAddress: customerAddress, // Store customer address
    status: 'pending' 
  });

  res.status(201).json({
    status: 'success',
    message: 'Service request sent successfully',
    request_id: newRequest._id
  });
});

// New controller function to get customer's accepted service requests (orders)
exports.getCustomerOrders = catchAsync(async (req, res, next) => {
  const customerId = req.user.id;

  const orders = await ServiceRequest.find({
    customer: customerId,
    // Fetch all relevant statuses for customer's order view (active and historical)
    status: { $in: ['accepted', 'in-progress', 'completed', 'rejected', 'pending'] } 
  })
  .populate('service', 'name description price') // Populate service details
  .populate('provider', 'name email') // Populate provider details
  .sort({ createdAt: -1 }); // Show newest orders first

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.submitReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  // 1. Validate input
  if (!rating || !comment) {
    return next(new AppError('Please provide both rating and comment', 400));
  }

  if (rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  // 2. Check service exists
  const service = await Service.findById(id);
  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  // 3. Check for existing review
  const existingReview = await Review.findOne({
    service: id,
    customer: req.user.id
  });

  if (existingReview) {
    return next(new AppError('You have already reviewed this service', 400));
  }

  // 4. Create review
  await Review.create({
    service: id,
    customer: req.user.id,
    rating,
    comment
  });

  res.status(201).json({
    status: 'success',
    message: 'Review submitted successfully'
  });
});
