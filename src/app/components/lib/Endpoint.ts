import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "https://wvgte32lna.execute-api.us-east-1.amazonaws.com/prod/",
});
