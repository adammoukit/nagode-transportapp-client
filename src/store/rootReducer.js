import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../features/auth/slices/authSlice";
import tripsReducer from "../features/trips/slices/TripsSlice";
import bookingReducer from "../features/booking/slices/bookingSlice";
import paymentReducer from "../features/payment/slices/PaymentSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  trips: tripsReducer,
  booking: bookingReducer,
  payment: paymentReducer,
});

export default rootReducer;
