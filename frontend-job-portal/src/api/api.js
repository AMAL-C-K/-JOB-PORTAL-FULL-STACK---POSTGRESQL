const BASE_URL = "https://job-portal-backend-api-78w1.onrender.com/api";
export const apiFetch = async (endpoint, options = {}) => {
  let accessToken = localStorage.getItem("access");

  const createHeaders = (token) => {
    const headers = {
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Do not manually set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  };

  // First API request
  let response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: createHeaders(accessToken),
  });

  /*
    IMPORTANT:
    Login endpoint can also return 401 when username/password are incorrect.
    Do NOT try to refresh the token for login.
  */
  if (response.status === 401 && endpoint !== "/token/") {
    const refreshToken = localStorage.getItem("refresh");

    // No refresh token → logout
    if (!refreshToken) {
      throw new Error("Your session has expired. Please login again.");
    }

    try {
      // Request new access token
      const refreshResponse = await fetch(`${BASE_URL}/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      const refreshData = await refreshResponse.json();

      // Refresh token invalid/expired
      if (!refreshResponse.ok) {
        
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        window.location.href = "/login";
        throw new Error("Your session has expired. Please login again.");
        
      }

      // Save new access token
      accessToken = refreshData.access;
      localStorage.setItem("access", accessToken);

      // Retry original request
      response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: createHeaders(accessToken),
      });
    } catch (error) {

      // Refresh failed → logout
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      window.location.href = "/login";
      throw new Error("Your session has expired. Please login again.");
    }
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  // Parse response
  let data = {};
  try {
    data = await response.json();
  } catch (err) {
    // Empty/non-JSON response
  }

  // Handle errors
  if (!response.ok) {
    throw new Error(data.detail || data.error || "Something went wrong");
  }

  return data;
};
