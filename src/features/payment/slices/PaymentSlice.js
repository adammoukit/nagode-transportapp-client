import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "../services/PaymentService";

// Async thunks
export const processPayment = createAsyncThunk(
  "payment/process",
  async (paymentData, { rejectWithValue }) => {
    try {
      const data = await paymentService.processPayment(paymentData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur de paiement" }
      );
    }
  }
);

export const confirmPayment = createAsyncThunk(
  "payment/confirm",
  async (paymentIntentId, { rejectWithValue }) => {
    try {
      const data = await paymentService.confirmPayment(paymentIntentId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur de confirmation" }
      );
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  "payment/history",
  async (_, { rejectWithValue }) => {
    try {
      const data = await paymentService.getPaymentHistory();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Erreur de chargement de l historique",
        }
      );
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  "payment/methods",
  async (_, { rejectWithValue }) => {
    try {
      const data = await paymentService.getPaymentMethods();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur de chargement des méthodes" }
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentMethod: "",
    paymentMethods: [],
    paymentProcessing: false,
    paymentSuccess: false,
    paymentError: null,
    transactionId: null,
    paymentHistory: [],
    loading: false,
  },
  reducers: {
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    resetPayment: (state) => {
      state.paymentProcessing = false;
      state.paymentSuccess = false;
      state.paymentError = null;
      state.transactionId = null;
    },
    clearError: (state) => {
      state.paymentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.paymentProcessing = true;
        state.paymentError = null;
        state.paymentSuccess = false;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.paymentProcessing = false;
        state.paymentSuccess = true;
        state.transactionId = action.payload.transactionId;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.paymentProcessing = false;
        state.paymentError = action.payload;
        state.paymentSuccess = false;
      })
      // Confirm payment
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.paymentSuccess = true;
        state.transactionId = action.payload.transactionId;
      })
      // Fetch payment history
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload.payments;
      })
      .addCase(fetchPaymentHistory.rejected, (state) => {
        state.loading = false;
      })
      // Fetch payment methods
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload.methods;
      });
  },
});

export const { setPaymentMethod, resetPayment, clearError } =
  paymentSlice.actions;
export default paymentSlice.reducer;
