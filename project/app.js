// src/api.js
import axios from "axios";

export const registerUser = async (username, password) => {
  try {
    const res = await axios.post("http://localhost:8000/api/v1/auth/register", {
      username,
      password,
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};
