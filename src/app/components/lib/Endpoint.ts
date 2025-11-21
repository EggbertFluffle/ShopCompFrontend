import axios from "axios";

export const instance = axios.create({
  baseURL: "https://jo2coyu025.execute-api.us-east-1.amazonaws.com/prod"
});
