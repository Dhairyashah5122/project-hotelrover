export interface Hotel {
  _id: string;
  name: string;
  address: string;
  logo: string;
  image: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  totalRooms: number;
  floors: string;
  secretKey: string;
  rooms?: Room[];
  housekeepers?: Housekeeper[];
}

export interface Room {
  _id: string;
  number: string;
  type: "Standard" | "Deluxe" | "Suite" | "Presidential";
  floor: number;
  capacity: number;
  price: number;
  status: "Available" | "Occupied" | "Maintenance";
  amenities: string[];
  assignedHousekeeper?: string;
}

export interface Housekeeper {
  _id: string;
  userId: string;
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  hotelId: string;
  isActive: boolean;
}

export interface ShiftHours {
  _id: number;
  housekeeperId: string;
  date: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
}

export interface Assignment {
  _id: string;
  housekeeperId: string;
  roomId: string;
  task: string;
  status: "Dirty" | "In Progress" | "Clean" | "Inspected";
  startTime: string;
  endTime: string;
  totalMinutes: number;
  createdAt: string;
}

export interface AssignmentReport extends Assignment {
  reportDate: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: "SuperAdmin" | "Admin" | "Manager" | "Housekeeper";
}
