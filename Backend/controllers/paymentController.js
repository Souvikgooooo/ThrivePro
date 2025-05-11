const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Bill = require ('../models/Bill'); // Corrected casing
const Transfer = require ('../models/Transfer');
const crypto = require('crypto');
const ProviderBankDetail = require('../models/ProviderBankDetails');
const ServiceRequest = require('../models/ServiceRequest');


// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});


// Process payment from customer to provider
exports.processPaymentFromCustomerToMe = catchAsync(async (req, res, next) => {
  const { id } = req.params; // bill id
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new AppError('Missing payment verification details', 400));
  }

  // Validate service request and ownership
  const serviceRequest = await ServiceRequest.findById(id).populate('customer').populate('provider'); // Populate provider for bill creation
  if (!serviceRequest || serviceRequest.customer._id.toString() !== req.user.id) {
    return next(new AppError('Invalid service request or unauthorized access', 403));
  }

  // Attempt to find the bill
  let bill = await Bill.findOne({ request: serviceRequest._id });

  // If bill not found AND service request is 'completed' (meaning it should have a bill)
  if (!bill && serviceRequest.status === 'completed') {
    console.log(`Bill not found for completed ServiceRequest ID: ${serviceRequest._id}. Attempting to create it now.`);
    try {
      bill = await Bill.create({
        request: serviceRequest._id,
        customer: serviceRequest.customer._id,
        provider: serviceRequest.provider._id, // Assuming provider is populated or serviceRequest.provider stores the ID
        service: serviceRequest.service,
        amount: serviceRequest.servicePriceSnapshot,
        status: 'unpaid', // Corrected initial bill status
      });
      console.log(`Just-in-time bill created for ServiceRequest ID: ${serviceRequest._id}`);
    } catch (billError) {
      console.error(`Error creating just-in-time bill for ServiceRequest ID ${serviceRequest._id}:`, billError);
      return next(new AppError('Failed to generate bill for payment. Please try again later.', 500));
    }
  } else if (!bill) {
    // If bill is still not found (e.g., service request not 'completed')
    return next(new AppError('Bill not found or order not yet ready for payment.', 400));
  }
  
  // Check if bill is already paid
  if (bill.status === 'paid') {
    return next(new AppError('Bill already paid', 400));
  }

  // Prevent duplicate payment
  const existingPayment = await Payment.findOne({ bill: bill._id });
  if (existingPayment && existingPayment.status === 'captured') {
    return next(new AppError('Duplicate payment detected. Payment already captured.', 400));
  }

  if (existingPayment && existingPayment.status !== 'created') {
    return next(new AppError('Invalid transfer status', 400));
  }

  // Verify payment with Razorpay
  const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return next(new AppError('Invalid payment signature', 400));
  }

  // Fetch Razorpay order to verify amount
  const rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
  if (rzpOrder.amount_paid !== bill.amount * 100) { // Check amount_paid on the order
    // Note: For more precise validation, it might be better to fetch the payment itself
    // and check its amount, as order.amount is the total order amount, 
    // and order.amount_paid reflects what was actually paid.
    // If using payment_capture: 1, order.amount_paid should equal order.amount upon successful payment.
    console.warn(`Amount mismatch or payment not fully captured on order: Razorpay Order Amount Paid: ${rzpOrder.amount_paid}, Bill Amount: ${bill.amount * 100}`);
    // Depending on strictness, you might allow if rzpOrder.amount_paid >= bill.amount * 100
    // For now, let's assume it must match exactly or payment wasn't fully processed for this order.
    // This check might be redundant if signature verification is robust and payment_capture is 1.
    // Let's fetch the payment to get the method and confirm amount.
  }

  // Fetch the payment details from Razorpay to get the method and confirm details
  const rzpPayment = await razorpay.payments.fetch(razorpay_payment_id);
  if (!rzpPayment) {
    return next(new AppError('Could not fetch Razorpay payment details.', 500));
  }
  if (rzpPayment.order_id !== razorpay_order_id) {
    return next(new AppError('Payment ID does not match the Order ID.', 400));
  }
  if (rzpPayment.amount !== bill.amount * 100) {
    return next(new AppError('Payment amount mismatch with fetched payment.', 400));
  }
  if (rzpPayment.status !== 'captured') {
     // This might happen if payment is authorized but not yet captured, or failed.
     // For auto-capture (payment_capture: 1 in order creation), it should be 'captured'.
    return next(new AppError(`Payment not successfully captured by Razorpay. Status: ${rzpPayment.status}`, 400));
  }


  // Find or Create Payment entry
  let payment = await Payment.findOne({ bill: bill._id, razorpay_order_id: razorpay_order_id });

  if (payment) {
    // If payment entry exists, update it
    if (payment.status === 'captured') {
      // This means we might be processing a webhook or re-verification for an already captured payment.
      // It's generally okay if details match. If this is purely from client-side handler, it might indicate a retry.
      console.log('Payment already marked as captured in DB for this order. Verifying details.');
    }
    payment.razorpay_payment_id = rzpPayment.id; // Use ID from fetched payment
    payment.payment_method = rzpPayment.method; // Use method from fetched payment
    payment.status = 'captured';
    // Update other fields if necessary, e.g., wallet, vpa from rzpPayment
    await payment.save();
  } else {
    // If no payment entry exists, create a new one
    payment = await Payment.create({
      bill: bill._id,
      customer: serviceRequest.customer._id,
      provider: serviceRequest.provider._id,
      amount: bill.amount, // Amount from the bill
      platform_fee: bill.amount * 0.1, // Example: 10% platform fee, adjust as needed
      status: 'captured', // Directly to captured as Razorpay confirmed payment
      payment_method: rzpPayment.method, // Use method from fetched payment
      razorpay_order_id: rzpPayment.order_id,
      razorpay_payment_id: rzpPayment.id,
      // transaction_id: rzpPayment.id // Or a separate field if needed
    });
  }

  if (!payment) {
    // This case should ideally not be reached if create/save is successful
    return next(new AppError('Failed to create or update payment entry.', 500));
  }

  // Update bill status to 'paid'
  bill.status = 'paid';
  await bill.save();

  // Update ServiceRequest status
  if (serviceRequest) {
    serviceRequest.status = 'PaymentCompleted'; // Matched to enum in ServiceRequest model
    await serviceRequest.save();
  }

  // Initiate transfer to provider using Razorpay
  const transferAmount = payment.amount - payment.platform_fee;
  const transfer = await Transfer.create({
    payment: payment._id,
    provider: serviceRequest.provider._id, // Corrected: Use the populated provider from ServiceRequest
    amount: transferAmount,
    status: 'created',
    transfer_mode: 'imps' // Corrected: Use a valid enum value, e.g., 'imps' or 'upi'
  });

  res.status(200).json({
    status: 'success',
    message: 'Payment processed and transfer initiated',
    payment,
    transfer
  });
});


// Process payment from me to customer
exports.processPaymentFromMeToProvider = catchAsync(async (req, res, next) => {
  const { transferId } = req.params;

  // 1. Validate transfer entry
  const transfer = await Transfer.findById(transferId).populate('provider payment');
  if (!transfer) {
    return next(new AppError('Transfer not found', 404));
  }

  if (transfer.status === 'captured') {
    return next(new AppError('Duplicate transfer detected. Transfer already captured.', 400));
  }
  
  if (transfer.status !== 'created') {
    return next(new AppError('Invalid transfer status', 400));
  }

  // 2. Validate provider bank details
  const providerBankDetails = await ProviderBankDetail.findOne({ provider: transfer.provider._id });
  if (!providerBankDetails || providerBankDetails.verification_status !== 'verified') {
    return next(new AppError('Provider bank details not verified or missing', 400));
  }

  // 3. Perform Razorpay fund transfer
  const fundTransfer = await razorpay.transfers.create({
    account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
    amount: transfer.amount,
    currency: 'INR',
    mode: transfer.transfer_mode,
    purpose: 'payout',
    fund_account_id: providerBankDetails.razorpay_fund_id,
    notes: {
      payment_id: transfer.payment._id.toString(),
      provider_id: transfer.provider._id.toString()
    }
  });

  // 4. Update transfer status
  transfer.status = 'captured';
  await transfer.save();

  res.status(200).json({
    status: 'success',
    message: 'Payment successfully transferred to provider',
    fundTransfer
  });
});


// testing
exports.createOrder = catchAsync(async(req, res, next) => {
  // Use the main razorpay instance initialized at the top of the file
  // const razorpay = new Razorpay({
  //     key_id: "rzp_test_V3eLJGsq0GMluZ",
  //     key_secret: "0OT7aG5vG6bvT60WmtBoEY5G"
  // })

  const options = {
      amount: req.body.amount, // Amount in paise
      currency: req.body.currency, // e.g., INR
      receipt: `rcpt_${Date.now()}`, // Generate a more unique receipt ID
      payment_capture: 1 // Auto capture payment
  };

  if (!options.amount || !options.currency) {
    return next(new AppError('Amount and currency are required to create an order.', 400));
  }
  if (typeof options.amount !== 'number' || options.amount <= 0) {
    return next(new AppError('Invalid amount for order creation.', 400));
  }


  try {
      // Use the globally initialized razorpay instance
      const response = await razorpay.orders.create(options);

      res.status(200).json({ // Send 200 OK on success
          status: 'success',
          order_id: response.id,
          currency: response.currency,
          amount: response.amount,
          receipt: response.receipt
      });
  } catch (error) {
      console.error("Error creating Razorpay order:", error); // Log the actual error
      // Pass the error to the centralized error handler
      return next(new AppError(error.message || 'Failed to create Razorpay order.', error.statusCode || 500));
  }
})

exports.getPaymentDetails = catchAsync(async(req, res) => {
  const {paymentId} = req.params;

  const razorpay = new Razorpay({
      key_id: "rzp_test_GcZZFDPP0jHtC4",
      key_secret: "6JdtQv2u7oUw7EWziYeyoewJ"
  })
  
  try {
      const payment = await razorpay.payments.fetch(paymentId)

      if (!payment){
          return res.status(500).json("Error at razorpay loading")
      }

      res.json({
          status: payment.status,
          method: payment.method,
          amount: payment.amount,
          currency: payment.currency
      })
  } catch(error) {
      res.status(500).json("failed to fetch")
  }
})
