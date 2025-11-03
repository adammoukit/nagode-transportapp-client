import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { useBooking } from "../../bookings/hooks/useBooking";
import {
  processPayment,
  confirmPayment,
  fetchPaymentHistory,
  fetchPaymentMethods,
  setPaymentMethod,
  resetPayment,
  clearError,
} from "../slices/PaymentSlice";

export const usePayment = () => {
  const dispatch = useDispatch();
  const paymentState = useSelector((state) => state.payment);

  const makePayment = useCallback(
    (paymentData) => {
      return dispatch(processPayment(paymentData));
    },
    [dispatch]
  );

  const confirmPaymentIntent = useCallback(
    (paymentIntentId) => {
      return dispatch(confirmPayment(paymentIntentId));
    },
    [dispatch]
  );

  const getHistory = useCallback(() => {
    return dispatch(fetchPaymentHistory());
  }, [dispatch]);

  const getPaymentMethods = useCallback(() => {
    return dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const selectPaymentMethod = useCallback(
    (method) => {
      dispatch(setPaymentMethod(method));
    },
    [dispatch]
  );

  const resetPaymentState = useCallback(() => {
    dispatch(resetPayment());
  }, [dispatch]);

  const clearPaymentError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    paymentMethod: paymentState.paymentMethod,
    paymentMethods: paymentState.paymentMethods,
    paymentProcessing: paymentState.paymentProcessing,
    paymentSuccess: paymentState.paymentSuccess,
    paymentError: paymentState.paymentError,
    transactionId: paymentState.transactionId,
    paymentHistory: paymentState.paymentHistory,
    loading: paymentState.loading,

    // Actions
    processPayment: makePayment,
    confirmPayment: confirmPaymentIntent,
    fetchPaymentHistory: getHistory,
    fetchPaymentMethods: getPaymentMethods,
    setPaymentMethod: selectPaymentMethod,
    resetPayment: resetPaymentState,
    clearError: clearPaymentError,
  };
};

// Hook pour le processus de paiement
export const usePaymentProcess = () => {
  const payment = usePayment();
  const { currentBooking, totalPrice } = useBooking(); // Note: nécessite l'import de useBooking

  const handlePayment = useCallback(
    async (paymentData) => {
      if (!currentBooking) {
        throw new Error("Aucune réservation à payer");
      }

      const completePaymentData = {
        ...paymentData,
        bookingId: currentBooking.id,
        amount: totalPrice,
        currency: "XOF",
      };

      return await payment.processPayment(completePaymentData);
    },
    [currentBooking, totalPrice, payment]
  );

  return {
    ...payment,
    handlePayment,
    canProcessPayment: !!currentBooking && totalPrice > 0,
  };
};

// Hook pour l'historique des paiements
export const usePaymentHistory = () => {
  const { fetchPaymentHistory, paymentHistory, loading } = usePayment();

  const getFilteredHistory = useCallback(
    (filters = {}) => {
      let filtered = paymentHistory;

      if (filters.status) {
        filtered = filtered.filter(
          (payment) => payment.status === filters.status
        );
      }

      if (filters.startDate && filters.endDate) {
        filtered = filtered.filter((payment) => {
          const paymentDate = new Date(payment.createdAt);
          return (
            paymentDate >= new Date(filters.startDate) &&
            paymentDate <= new Date(filters.endDate)
          );
        });
      }

      return filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    [paymentHistory]
  );

  return {
    paymentHistory,
    filteredHistory: getFilteredHistory,
    loading,
    refreshHistory: fetchPaymentHistory,
    totalSpent: paymentHistory.reduce(
      (sum, payment) => sum + payment.amount,
      0
    ),
  };
};
