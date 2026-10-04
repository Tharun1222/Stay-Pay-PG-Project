import api from "./api";

export const submitEnquiry = (enquiry) =>
  api.post("/enquiries", enquiry);

export const getEnquiries = () =>
  api.get("/enquiries");

export const updateEnquiryStatus = (id, status) =>
  api.patch(`/enquiries/${id}/status`, { status });

export const deleteEnquiry = (id) =>
  api.delete(`/enquiries/${id}`);