import { create } from "zustand";
import type { zodSearchingType } from "@/zod/searching";

// Minimal type for workers in store; dashboard can use its own extended type
export interface CustomerNearbyWorker {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  workExperience?: string;
  latitude: number | { toString(): string };
  longitude: number | { toString(): string };
  averageRating?: number;
  serviceCharge?: number;
}

interface CustomerState {
  // Map & UI
  mapLoaded: boolean;
  setMapLoaded: (value: boolean) => void;

  // Booking
  bookingDetails: zodSearchingType | null;
  nearbyWorkers: CustomerNearbyWorker[] | null;
  fetchingNearbyWorkers: boolean;
  trackingBookingId: string | null;
  setBookingDetails: (data: zodSearchingType | null | ((prev: zodSearchingType | null) => zodSearchingType | null)) => void;
  setNearbyWorkers: (workers: CustomerNearbyWorker[] | null) => void;
  setFetchingNearbyWorkers: (value: boolean) => void;
  setTrackingBookingId: (id: string | null) => void;

  // Booking flow
  isBookingsent: boolean;
  isBookingAccepted: boolean;
  isBookingRejected: boolean;
  setIsBookingsent: (value: boolean) => void;
  setIsBookingAccepted: (value: boolean) => void;
  setIsBookingRejected: (value: boolean) => void;

  // Worker status
  isWorkerArrived: boolean;
  isWorkerOnTheWay: boolean;
  isServiceStarted: boolean;
  workerCurrentLocation: { latitude: number; longitude: number } | null;
  setIsWorkerArrived: (value: boolean) => void;
  setIsWorkerOnTheWay: (value: boolean) => void;
  setIsServiceStarted: (value: boolean) => void;
  setWorkerCurrentLocation: (location: { latitude: number; longitude: number } | null) => void;

  // Payment
  requestedPaymentAmount: number;
  isPaymentReceived: boolean;
  verifyPayment: boolean;
  makePayment: boolean;
  yourOTP: string;
  setRequestedPaymentAmount: (amount: number) => void;
  setIsPaymentReceived: (value: boolean) => void;
  setVerifyPayment: (value: boolean) => void;
  setMakePayment: (value: boolean) => void;
  setYourOTP: (value: string) => void;

  // Actions
  increasePrice: () => void;
  resetAfterRejection: () => void;
  resetBookingFlow: () => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  mapLoaded: false,
  setMapLoaded: (value) => set({ mapLoaded: value }),

  bookingDetails: null,
  nearbyWorkers: null,
  fetchingNearbyWorkers: false,
  trackingBookingId: null,
  setBookingDetails: (data) =>
    set((state) => ({
      bookingDetails:
        typeof data === "function" ? data(state.bookingDetails) : data,
    })),
  setNearbyWorkers: (workers) => set({ nearbyWorkers: workers }),
  setFetchingNearbyWorkers: (value) => set({ fetchingNearbyWorkers: value }),
  setTrackingBookingId: (id) => set({ trackingBookingId: id }),

  isBookingsent: false,
  isBookingAccepted: false,
  isBookingRejected: false,
  setIsBookingsent: (value) => set({ isBookingsent: value }),
  setIsBookingAccepted: (value) => set({ isBookingAccepted: value }),
  setIsBookingRejected: (value) => set({ isBookingRejected: value }),

  isWorkerArrived: false,
  isWorkerOnTheWay: false,
  isServiceStarted: false,
  workerCurrentLocation: null,
  setIsWorkerArrived: (value) => set({ isWorkerArrived: value }),
  setIsWorkerOnTheWay: (value) => set({ isWorkerOnTheWay: value }),
  setIsServiceStarted: (value) => set({ isServiceStarted: value }),
  setWorkerCurrentLocation: (location) =>
    set({ workerCurrentLocation: location }),

  requestedPaymentAmount: 0,
  isPaymentReceived: false,
  verifyPayment: false,
  makePayment: true,
  yourOTP: "",
  setRequestedPaymentAmount: (amount) =>
    set({ requestedPaymentAmount: amount }),
  setIsPaymentReceived: (value) => set({ isPaymentReceived: value }),
  setVerifyPayment: (value) => set({ verifyPayment: value }),
  setMakePayment: (value) => set({ makePayment: value }),
  setYourOTP: (value) => set({ yourOTP: value }),

  increasePrice: () => {
    const { bookingDetails } = get();
    if (!bookingDetails) return;
    set({
      bookingDetails: {
        ...bookingDetails,
        priceRange: (bookingDetails.priceRange ?? 0) + 100,
      },
      isBookingsent: false,
    });
  },

  resetAfterRejection: () =>
    set({ isBookingRejected: false, isBookingsent: false }),

  resetBookingFlow: () =>
    set({
      mapLoaded: false,
      bookingDetails: null,
      nearbyWorkers: null,
      fetchingNearbyWorkers: false,
      trackingBookingId: null,
      isBookingsent: false,
      isBookingAccepted: false,
      isBookingRejected: false,
      isWorkerArrived: false,
      isWorkerOnTheWay: false,
      isServiceStarted: false,
      workerCurrentLocation: null,
      requestedPaymentAmount: 0,
    }),
}));
