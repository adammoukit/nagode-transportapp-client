import api from "../../../utils/Axios";

const tripsService = {
  // Récupération de tous les trajets
  getAllTrips: async (filters = {}) => {
    const response = await api.get("/trips", { params: filters });
    return response.data;
  },

  // Récupération des trajets populaires
  getPopularTrips: async () => {
    const response = await api.get("/trips/popular");
    return response.data;
  },

  // Récupération des horaires
  getSchedule: async (routeId, date) => {
    const response = await api.get("/trips/schedule", {
      params: { routeId, date },
    });
    return response.data;
  },

  // Récupération des stations
  getStations: async () => {
    const response = await api.get("/stations");
    return response.data;
  },

  // Récupération des avis sur un trajet
  getTripReviews: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/reviews`);
    return response.data;
  },

  // Ajout d'un avis
  addReview: async (tripId, reviewData) => {
    const response = await api.post(`/trips/${tripId}/reviews`, reviewData);
    return response.data;
  },
};

export default tripsService;
