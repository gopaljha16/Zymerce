// src/utils/auth.js
export const saveTokens = (tokens) => {
  localStorage.setItem("access_token", tokens.access);
  localStorage.setItem("refresh_token", tokens.refresh);
};

export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

export const getAccessToken = () => localStorage.getItem("access_token");

export const authFetch = (url, options = {}) => {
  const token = getAccessToken();
  const headers = options.headers ? {...options.headers} : {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  return fetch(url, {...options, headers});
};
