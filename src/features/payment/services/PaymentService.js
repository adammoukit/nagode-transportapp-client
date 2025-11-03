import api from "../../../utils/Axios";

const paymentService = {
  // Traitement d'un paiement
  processPayment: async (paymentData) => {
    const response = await api.post("/payments/process", paymentData);
    return response.data;
  },

  // Confirmation de paiement
  confirmPayment: async (paymentIntentId) => {
    const response = await api.post("/payments/confirm", {
      paymentIntentId,
    });
    return response.data;
  },

  // Remboursement
  refundPayment: async (paymentId) => {
    const response = await api.post(`/payments/${paymentId}/refund`);
    return response.data;
  },

  // Récupération de l'historique des paiements
  getPaymentHistory: async () => {
    const response = await api.get("/payments/history");
    return response.data;
  },

  // Sauvegarde d'une carte de paiement
  savePaymentMethod: async (paymentMethodData) => {
    const response = await api.post("/payments/methods", paymentMethodData);
    return response.data;
  },

  // Récupération des méthodes de paiement sauvegardées
  getPaymentMethods: async () => {
    const response = await api.get("/payments/methods");
    return response.data;
  },
};

export default paymentService;
