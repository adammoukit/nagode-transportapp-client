import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tripsService from "../services/TripsService";

// Async thunks
export const fetchAllTrips = createAsyncThunk(
  "trips/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const data = await tripsService.getAllTrips(filters);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur de chargement des trajets" }
      );
    }
  }
);

export const fetchTripDetails = createAsyncThunk(
  "trips/fetchDetails",
  async (tripId, { rejectWithValue }) => {
    try {
      const data = await tripsService.getTripDetails(tripId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Erreur de chargement des détails du trajet",
        }
      );
    }
  }
);

export const fetchPopularTrips = createAsyncThunk(
  "trips/fetchPopular",
  async (_, { rejectWithValue }) => {
    try {
      const data = await tripsService.getPopularTrips();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Erreur de chargement des trajets populaires",
        }
      );
    }
  }
);

export const fetchSchedule = createAsyncThunk(
  "trips/fetchSchedule",
  async ({ routeId, date }, { rejectWithValue }) => {
    try {
      const data = await tripsService.getSchedule(routeId, date);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur de chargement des horaires" }
      );
    }
  }
);

export const fetchStations = createAsyncThunk(
  "trips/fetchStations",
  async (_, { rejectWithValue }) => {
    try {
      const data = await tripsService.getStations();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur de chargement des stations" }
      );
    }
  }
);

const tripsSlice = createSlice({
  name: "trips",
  initialState: {
    trips: [],
    popularTrips: [],
    selectedTrip: null,
    stations: [],
    schedule: [],
    filters: {
      from: "",
      to: "",
      date: "",
      passengers: 1,
    },
    loading: false,
    detailsLoading: false,
    scheduleLoading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        from: "",
        to: "",
        date: "",
        passengers: 1,
      };
    },
    clearSelectedTrip: (state) => {
      state.selectedTrip = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all trips
      .addCase(fetchAllTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload.trips;
      })
      .addCase(fetchAllTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch trip details
      .addCase(fetchTripDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchTripDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedTrip = action.payload.trip;
      })
      .addCase(fetchTripDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      // Fetch popular trips
      .addCase(fetchPopularTrips.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPopularTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.popularTrips = action.payload.trips;
      })
      .addCase(fetchPopularTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch schedule
      .addCase(fetchSchedule.pending, (state) => {
        state.scheduleLoading = true;
        state.error = null;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.scheduleLoading = false;
        state.schedule = action.payload.schedule;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.error = action.payload;
      })
      // Fetch stations
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.stations = action.payload.stations;
      });
  },
});

export const { setFilters, clearFilters, clearSelectedTrip, clearError } =
  tripsSlice.actions;

export default tripsSlice.reducer;
