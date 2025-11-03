import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookingService from "../services/BookingService";

// Async thunks
export const searchTrips = createAsyncThunk(
  "booking/searchTrips",
  async (searchCriteria, { rejectWithValue }) => {
    try {
      const data = await bookingService.searchTrips(searchCriteria);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur de recherche" }
      );
    }
  }
);

export const fetchAvailableSeats = createAsyncThunk(
  "booking/fetchSeats",
  async (tripId, { rejectWithValue }) => {
    try {
      const data = await bookingService.getAvailableSeats(tripId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur de chargement des sièges" }
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const data = await bookingService.createBooking(bookingData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur de réservation" }
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await bookingService.cancelBooking(bookingId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur d'annulation" }
      );
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  "booking/fetchUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const data = await bookingService.getUserBookings();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Erreur de chargement des réservations",
        }
      );
    }
  }
);

export const fetchBookingDetails = createAsyncThunk(
  "booking/fetchDetails",
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await bookingService.getBookingDetails(bookingId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Erreur de chargement de la réservation",
        }
      );
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    searchResults: [],
    availableSeats: [],
    selectedTrip: null,
    selectedSeats: [],
    bookingForm: {
      passengerInfo: {},
      contactInfo: {},
      specialRequests: "",
    },
    currentBooking: null,
    userBookings: [],
    bookingHistory: [],
    loading: false,
    seatsLoading: false,
    bookingLoading: false,
    error: null,
    step: "search", // search -> seats -> form -> summary -> confirmation
  },
  reducers: {
    setSelectedTrip: (state, action) => {
      state.selectedTrip = action.payload;
      state.step = "seats";
    },
    setSelectedSeats: (state, action) => {
      state.selectedSeats = action.payload;
      state.step = "form";
    },
    updateBookingForm: (state, action) => {
      state.bookingForm = { ...state.bookingForm, ...action.payload };
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    clearBookingProcess: (state) => {
      state.selectedTrip = null;
      state.selectedSeats = [];
      state.bookingForm = {
        passengerInfo: {},
        contactInfo: {},
        specialRequests: "",
      };
      state.currentBooking = null;
      state.step = "search";
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search trips
      .addCase(searchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.trips;
      })
      .addCase(searchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch available seats
      .addCase(fetchAvailableSeats.pending, (state) => {
        state.seatsLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSeats.fulfilled, (state, action) => {
        state.seatsLoading = false;
        state.availableSeats = action.payload.seats;
      })
      .addCase(fetchAvailableSeats.rejected, (state, action) => {
        state.seatsLoading = false;
        state.error = action.payload;
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.bookingLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.currentBooking = action.payload.booking;
        state.step = "confirmation";
        // Add to user bookings
        state.userBookings.unshift(action.payload.booking);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.bookingLoading = false;
        state.error = action.payload;
      })
      // Cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.userBookings.findIndex(
          (booking) => booking.id === action.payload.booking.id
        );
        if (index !== -1) {
          state.userBookings[index] = action.payload.booking;
        }
      })
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.userBookings = action.payload.bookings;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch booking details
      .addCase(fetchBookingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentBooking = action.payload.booking;
      });
  },
});

export const {
  setSelectedTrip,
  setSelectedSeats,
  updateBookingForm,
  setStep,
  clearBookingProcess,
  clearError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
