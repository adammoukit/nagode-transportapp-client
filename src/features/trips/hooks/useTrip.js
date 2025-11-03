import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";
import {
  fetchAllTrips,
  fetchTripDetails,
  fetchPopularTrips,
  fetchSchedule,
  fetchStations,
  setFilters,
  clearFilters,
  clearSelectedTrip,
  clearError,
} from "../slices/TripsSlice";

export const useTrips = () => {
  const dispatch = useDispatch();
  const tripsState = useSelector((state) => state.trips);

  const searchTrips = useCallback(
    (filters = {}) => {
      return dispatch(fetchAllTrips(filters));
    },
    [dispatch]
  );

  const getTripDetails = useCallback(
    (tripId) => {
      return dispatch(fetchTripDetails(tripId));
    },
    [dispatch]
  );

  const getPopularTrips = useCallback(() => {
    return dispatch(fetchPopularTrips());
  }, [dispatch]);

  const getSchedule = useCallback(
    (routeId, date) => {
      return dispatch(fetchSchedule({ routeId, date }));
    },
    [dispatch]
  );

  const getStations = useCallback(() => {
    return dispatch(fetchStations());
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const resetSelectedTrip = useCallback(() => {
    dispatch(clearSelectedTrip());
  }, [dispatch]);

  const clearTripsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Mémoized derived data
  const filteredTrips = useMemo(() => {
    if (!tripsState.filters.from && !tripsState.filters.to) {
      return tripsState.trips;
    }

    return tripsState.trips.filter((trip) => {
      const matchesFrom =
        !tripsState.filters.from ||
        trip.departureStation
          ?.toLowerCase()
          .includes(tripsState.filters.from.toLowerCase());
      const matchesTo =
        !tripsState.filters.to ||
        trip.arrivalStation
          ?.toLowerCase()
          .includes(tripsState.filters.to.toLowerCase());

      return matchesFrom && matchesTo;
    });
  }, [tripsState.trips, tripsState.filters]);

  return {
    // State
    trips: filteredTrips,
    popularTrips: tripsState.popularTrips,
    selectedTrip: tripsState.selectedTrip,
    stations: tripsState.stations,
    schedule: tripsState.schedule,
    filters: tripsState.filters,
    loading: tripsState.loading,
    detailsLoading: tripsState.detailsLoading,
    scheduleLoading: tripsState.scheduleLoading,
    error: tripsState.error,

    // Actions
    searchTrips,
    getTripDetails,
    getPopularTrips,
    getSchedule,
    getStations,
    updateFilters,
    resetFilters,
    resetSelectedTrip,
    clearError: clearTripsError,

    // Derived data
    hasFilters: tripsState.filters.from || tripsState.filters.to,
  };
};

// Hook pour la recherche de trajets
export const useTripSearch = () => {
  const { searchTrips, loading, error, filters, updateFilters } = useTrips();

  const handleSearch = useCallback(
    (searchParams) => {
      updateFilters(searchParams);
      return searchTrips(searchParams);
    },
    [searchTrips, updateFilters]
  );

  return {
    search: handleSearch,
    loading,
    error,
    filters,
    updateFilters,
  };
};

// Hook pour les détails d'un trajet
export const useTripDetails = (tripId) => {
  const { getTripDetails, selectedTrip, detailsLoading, error } = useTrips();

  const fetchDetails = useCallback(() => {
    if (tripId) {
      return getTripDetails(tripId);
    }
  }, [getTripDetails, tripId]);

  return {
    trip: selectedTrip,
    loading: detailsLoading,
    error,
    fetchDetails,
  };
};
