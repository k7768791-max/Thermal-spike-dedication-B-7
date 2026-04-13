import axios from "axios";

const API = axios.create({ baseURL: "https://thermal-spike-dedication-batch-7-backend-utc1.onrender.com" });

export const predictThermalSpike = (payload) =>
  API.post("/api/predict", payload).then(r => r.data);

export const healthCheck = () =>
  API.get("/api/health").then(r => r.data);

export default API;
