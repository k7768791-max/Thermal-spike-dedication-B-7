import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const predictThermalSpike = (payload) =>
  API.post("/api/predict", payload).then(r => r.data);

export const healthCheck = () =>
  API.get("/api/health").then(r => r.data);

export default API;
