import api from "../../../utils/Axios";

const bookingService = {
  // Recherche de trajets
  searchTrips: async (searchCriteria) => {
    const response = await api.get("/trips/search", {
      params: searchCriteria,
    });
    return response.data;
  },

  // Récupération des détails d'un trajet
  getTripDetails: async (tripId) => {
    const response = await api.get(`/trips/${tripId}`);
    return response.data;
  },

  // Vérification des sièges disponibles
  getAvailableSeats: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/seats`);
    return response.data;
  },

  // Création d'une réservation
  createBooking: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  // Annulation d'une réservation
  cancelBooking: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  // Récupération des réservations utilisateur
  getUserBookings: async () => {
    const response = await api.get("/bookings/user");
    return response.data;
  },

  // Récupération du détail d'une réservation
  getBookingDetails: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },
};

export default bookingService;
