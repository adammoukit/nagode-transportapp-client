import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";
import {
  searchTrips,
  fetchAvailableSeats,
  createBooking,
  cancelBooking,
  fetchUserBookings,
  fetchBookingDetails,
  setSelectedTrip,
  setSelectedSeats,
  updateBookingForm,
  setStep,
  clearBookingProcess,
  clearError,
} from "../slices/bookingSlice";

export const useBooking = () => {
  const dispatch = useDispatch();
  const bookingState = useSelector((state) => state.booking);

  const searchAvailableTrips = useCallback(
    (searchCriteria) => {
      return dispatch(searchTrips(searchCriteria));
    },
    [dispatch]
  );

  const getSeats = useCallback(
    (tripId) => {
      return dispatch(fetchAvailableSeats(tripId));
    },
    [dispatch]
  );

  const bookTrip = useCallback(
    (bookingData) => {
      return dispatch(createBooking(bookingData));
    },
    [dispatch]
  );

  const cancelReservation = useCallback(
    (bookingId) => {
      return dispatch(cancelBooking(bookingId));
    },
    [dispatch]
  );

  const getUserBookings = useCallback(() => {
    return dispatch(fetchUserBookings());
  }, [dispatch]);

  const getBookingDetails = useCallback(
    (bookingId) => {
      return dispatch(fetchBookingDetails(bookingId));
    },
    [dispatch]
  );

  const selectTrip = useCallback(
    (trip) => {
      dispatch(setSelectedTrip(trip));
    },
    [dispatch]
  );

  const selectSeats = useCallback(
    (seats) => {
      dispatch(setSelectedSeats(seats));
    },
    [dispatch]
  );

  const updateForm = useCallback(
    (formData) => {
      dispatch(updateBookingForm(formData));
    },
    [dispatch]
  );

  const navigateToStep = useCallback(
    (step) => {
      dispatch(setStep(step));
    },
    [dispatch]
  );

  const resetBooking = useCallback(() => {
    dispatch(clearBookingProcess());
  }, [dispatch]);

  const clearBookingError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Calcul du prix total
  const totalPrice = useMemo(() => {
    if (!bookingState.selectedTrip || bookingState.selectedSeats.length === 0) {
      return 0;
    }

    const seatPrice = bookingState.selectedTrip.pricePerSeat || 0;
    return seatPrice * bookingState.selectedSeats.length;
  }, [bookingState.selectedTrip, bookingState.selectedSeats]);

  // Vérification si le formulaire est complet
  const isFormComplete = useMemo(() => {
    const { passengerInfo, contactInfo } = bookingState.bookingForm;
    return (
      passengerInfo.firstName &&
      passengerInfo.lastName &&
      passengerInfo.email &&
      contactInfo.phone &&
      bookingState.selectedSeats.length > 0
    );
  }, [bookingState.bookingForm, bookingState.selectedSeats]);

  return {
    // State
    searchResults: bookingState.searchResults,
    availableSeats: bookingState.availableSeats,
    selectedTrip: bookingState.selectedTrip,
    selectedSeats: bookingState.selectedSeats,
    bookingForm: bookingState.bookingForm,
    currentBooking: bookingState.currentBooking,
    userBookings: bookingState.userBookings,
    loading: bookingState.loading,
    seatsLoading: bookingState.seatsLoading,
    bookingLoading: bookingState.bookingLoading,
    error: bookingState.error,
    step: bookingState.step,

    // Actions
    searchTrips: searchAvailableTrips,
    getAvailableSeats: getSeats,
    createBooking: bookTrip,
    cancelBooking: cancelReservation,
    getUserBookings,
    getBookingDetails,
    selectTrip,
    selectSeats,
    updateBookingForm: updateForm,
    setStep: navigateToStep,
    clearBooking: resetBooking,
    clearError: clearBookingError,

    // Derived data
    totalPrice,
    isFormComplete,
    canProceedToNextStep: {
      toSeats: !!bookingState.selectedTrip,
      toForm: bookingState.selectedSeats.length > 0,
      toSummary: isFormComplete,
    },
  };
};

// Hook pour le processus de réservation
export const useBookingProcess = () => {
  const booking = useBooking();

  const nextStep = useCallback(() => {
    const steps = ["search", "seats", "form", "summary", "confirmation"];
    const currentIndex = steps.indexOf(booking.step);
    if (currentIndex < steps.length - 1) {
      booking.setStep(steps[currentIndex + 1]);
    }
  }, [booking.step, booking.setStep]);

  const prevStep = useCallback(() => {
    const steps = ["search", "seats", "form", "summary", "confirmation"];
    const currentIndex = steps.indexOf(booking.step);
    if (currentIndex > 0) {
      booking.setStep(steps[currentIndex - 1]);
    }
  }, [booking.step, booking.setStep]);

  return {
    ...booking,
    nextStep,
    prevStep,
    isFirstStep: booking.step === "search",
    isLastStep: booking.step === "confirmation",
  };
};

// Hook pour la gestion des sièges
export const useSeatSelection = () => {
  const { selectedSeats, selectSeats, availableSeats } = useBooking();

  const toggleSeat = useCallback(
    (seatId) => {
      const isSelected = selectedSeats.includes(seatId);
      let newSelection;

      if (isSelected) {
        newSelection = selectedSeats.filter((id) => id !== seatId);
      } else {
        newSelection = [...selectedSeats, seatId];
      }

      selectSeats(newSelection);
    },
    [selectedSeats, selectSeats]
  );

  const isSeatSelected = useCallback(
    (seatId) => {
      return selectedSeats.includes(seatId);
    },
    [selectedSeats]
  );

  const isSeatAvailable = useCallback(
    (seatId) => {
      return availableSeats.some(
        (seat) => seat.id === seatId && seat.available
      );
    },
    [availableSeats]
  );

  return {
    selectedSeats,
    toggleSeat,
    isSeatSelected,
    isSeatAvailable,
    clearSelection: () => selectSeats([]),
  };
};
