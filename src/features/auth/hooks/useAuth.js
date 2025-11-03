import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
  clearError,
} from "../slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const login = useCallback(
    (credentials) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  const register = useCallback(
    (userData) => {
      return dispatch(registerUser(userData));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const fetchProfile = useCallback(() => {
    return dispatch(getProfile());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    profileLoading: authState.profileLoading,
    error: authState.error,

    // Actions
    login,
    register,
    logout,
    fetchProfile,
    clearError: clearAuthError,
  };
};

// Hook pour vérifier l'authentification
export const useAuthGuard = () => {
  const { isAuthenticated, loading } = useAuth();

  return {
    isAuthenticated,
    loading,
    requireAuth: (redirectPath = "/login") => {
      if (!isAuthenticated && !loading) {
        window.location.href = redirectPath;
        return false;
      }
      return isAuthenticated;
    },
  };
};

// Hook pour les permissions utilisateur
export const useUserPermissions = () => {
  const { user } = useAuth();

  const hasRole = useCallback(
    (role) => {
      return user?.roles?.includes(role) || false;
    },
    [user]
  );

  const hasPermission = useCallback(
    (permission) => {
      return user?.permissions?.includes(permission) || false;
    },
    [user]
  );

  return {
    hasRole,
    hasPermission,
    isAdmin: hasRole("admin"),
    isUser: hasRole("user") || !user, // Par défaut si pas de rôle
  };
};
