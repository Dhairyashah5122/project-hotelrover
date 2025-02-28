import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
};

// Hotel services
export const hotelService = {
  getAll: async () => {
    const response = await api.get("/hotels");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },
  create: async (hotelData: any) => {
    const response = await api.post("/hotels", hotelData);
    return response.data;
  },
  update: async (id: string, hotelData: any) => {
    const response = await api.put(`/hotels/${id}`, hotelData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  },
};

// Room services
export const roomService = {
  getByHotel: async (hotelId: string) => {
    const response = await api.get(`/rooms/hotel/${hotelId}`);
    return response.data;
  },
  create: async (roomData: any) => {
    const response = await api.post("/rooms", roomData);
    console.log("first response", response);
    return response.data;
  },
  update: async (id: string, roomData: any) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },
  assignHousekeeper: async (roomId: string, housekeeperId: string) => {
    const response = await api.post(`/rooms/${roomId}/assign`, {
      housekeeperId,
    });
    return response.data;
  },
};

export const housekeeperService = {
  // Get all housekeepers for a specific hotel
  getAll: async (hotelId: string) => {
    const response = await api.get(`/housekeepers/${hotelId}`); // Make request to the hotel-specific route
    return response.data;
  },

  // Get housekeeper by ID
  getById: async (id: string) => {
    const response = await api.get(`/housekeepers/${id}`);
    return response.data;
  },

  // Create a new housekeeper
  create: async (housekeeperData: any) => {
    const response = await api.post("/housekeepers", housekeeperData);
    return response.data;
  },

  // Update an existing housekeeper
  update: async (id: string, housekeeperData: any) => {
    const response = await api.put(`/housekeepers/${id}`, housekeeperData);
    return response.data;
  },

  // Delete a housekeeper
  delete: async (id: string) => {
    const response = await api.delete(`/housekeepers/${id}`);
    return response.data;
  },
};

// Assignment services
export const assignmentService = {
  getAllAssignments: async () => {
    const response = await api.get("/assignments");
    return response.data;
  },

  // Fetch assignments for a specific housekeeper (this can now be consolidated into the above method)
  getByHousekeeper: async (housekeeperId: string) => {
    return assignmentService.getAllAssignments({ housekeeperId });
  },

  // Create a new assignment
  create: async (assignmentData: any) => {
    const response = await api.post("/assignments", assignmentData);
    return response.data;
  },

  // Start cleaning task
  startCleaning: async (id: string) => {
    const response = await api.put(`/assignments/${id}/start`);
    return response.data;
  },

  // Complete cleaning task
  completeCleaning: async (id: string) => {
    const response = await api.put(`/assignments/${id}/complete`);
    return response.data;
  },

  // Get reports (now this can be done using the new /assignments endpoint with filters)
  getReports: async (params: {
    startDate?: string;
    endDate?: string;
    housekeeperId?: string;
  }) => {
    const response = await api.get("/assignments", { params });
    return response.data;
  },
};

export default api;
