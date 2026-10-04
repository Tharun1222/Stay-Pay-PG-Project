
import api from "./api";

export const getRooms = async (availableOnly = false) => {
  const response = await api.get("/rooms", {
    params: { availableOnly },
  });

  console.log("API response:", response.data);

  return response.data;
};

export const getRoomById = async (id) => {
  const response = await api.get(`/rooms/${id}`);
  return response.data;
};

export const addRoom = async (room) => {
  const response = await api.post("/rooms", room);
  return response.data;
};

export const updateRoom = async (id, room) => {
  const response = await api.put(`/rooms/${id}`, room);
  return response.data;
};

export const deleteRoom = async (id) => {
  const response = await api.delete(`/rooms/${id}`);
  return response.data;
};

