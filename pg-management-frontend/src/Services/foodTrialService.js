import api from "./api";

export const submitFoodTrial = (trial) =>
  api.post("/food-trials", trial);

export const getFoodTrials = () =>
  api.get("/food-trials");

export const updateFoodTrialStatus = (id, status) =>
  api.patch(`/food-trials/${id}/status`, { status });

export const deleteFoodTrial = (id) =>
  api.delete(`/food-trials/${id}`);