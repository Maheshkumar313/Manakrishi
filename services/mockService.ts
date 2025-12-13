import { Booking, BookingStatus, User, UserRole } from '../types';

const STORAGE_KEYS = {
  USER: 'manakrishi_user',
  BOOKINGS: 'manakrishi_bookings',
};

// Mock Auth
export const mockLogin = async (phone: string, name?: string): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate Admin login for a specific number
      const role = phone === '9999999999' ? UserRole.ADMIN : UserRole.FARMER;
      
      // Use provided name or fallback logic
      const userName = name || (role === UserRole.ADMIN ? 'Manakrishi Admin' : `Farmer ${phone.slice(-4)}`);

      const user: User = {
        id: phone,
        phone,
        role,
        name: userName
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      resolve(user);
    }, 800);
  });
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

// Mock Database
const getStoredBookings = (): Booking[] => {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return data ? JSON.parse(data) : [];
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBooking: Booking = {
        ...booking,
        id: Date.now().toString(),
        status: BookingStatus.REQUESTED,
        createdAt: Date.now(),
      };
      const bookings = getStoredBookings();
      bookings.unshift(newBooking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      resolve(newBooking);
    }, 800);
  });
};

export const getBookings = async (user: User): Promise<Booking[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getStoredBookings();
      if (user.role === UserRole.ADMIN) {
        resolve(all);
      } else {
        resolve(all.filter(b => b.userId === user.id));
      }
    }, 500);
  });
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getStoredBookings();
      const index = all.findIndex(b => b.id === bookingId);
      if (index !== -1) {
        all[index].status = status;
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(all));
      }
      resolve();
    }, 500);
  });
};