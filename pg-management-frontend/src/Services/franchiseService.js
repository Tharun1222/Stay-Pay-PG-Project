import api from "./api";

export const getNearbyFranchises = (latitude, longitude) =>
  api.get("/franchises/nearby", {
    params: {
      latitude,
      longitude
    }
  });