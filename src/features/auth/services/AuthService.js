import api from "../../../utils/Axios";

const authService = {
  // Connexion utilisateur
  login: async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  // Inscription utilisateur
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Récupération du profil utilisateur
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Rafraîchissement du token
  refreshToken: async () => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },

  // Déconnexion
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Mot de passe oublié
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Réinitialisation du mot de passe
  resetPassword: async (token, newPassword) => {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },
};

export default authService;
