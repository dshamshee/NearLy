import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zodIncomingBookingType } from "@/zod/incommingBooking";
import { toast } from "sonner";
import type { Socket } from "socket.io-client";

interface WorkerState {
  // Core state
  isActive: boolean;
  incomingBooking: zodIncomingBookingType | null;
  isBookingAccepted: boolean;
  outForService: boolean;
  arrivedAtDestination: boolean;
  arrivedNearby: boolean;
  location: { latitude: number; longitude: number };
  amount: number;

  // Payment state
  isPaymentReceived: boolean;
  verifyPayment: boolean;
  makePayment: boolean;
  yourOTP: string;

  // Flow state
  isMapLoaded: boolean;
  isWorkDoneClicked: boolean;
  workDoneInterval: number;

  // Actions
  setAvailability: (status: boolean) => void;
  updateLocation: (lat: number, lng: number) => void;
  setIncomingBooking: (booking: zodIncomingBookingType | null) => void;
  setBookingAccepted: (value: boolean) => void;
  setOutForService: (value: boolean) => void;
  setArrivedAtDestination: (value: boolean) => void;
  setArrivedNearby: (value: boolean) => void;
  setAmount: (value: number) => void;
  setIsPaymentReceived: (value: boolean) => void;
  setVerifyPayment: (value: boolean) => void;
  setMakePayment: (value: boolean) => void;
  setYourOTP: (value: string) => void;
  setIsMapLoaded: (value: boolean) => void;
  setIsWorkDoneClicked: (value: boolean) => void;
  setWorkDoneInterval: (value: number | ((prev: number) => number)) => void;
  resetBookingFlow: () => void;

  // Socket Logic
  initSocketListeners: (socket: Socket | null) => void;
  cleanupListeners: (socket: Socket | null) => void;
}

const initialBookingState = {
  incomingBooking: null as zodIncomingBookingType | null,
  isBookingAccepted: false,
  outForService: false,
  arrivedAtDestination: false,
  arrivedNearby: false,
  isWorkDoneClicked: false,
  workDoneInterval: 0,
};

export const useWorkerStore = create<WorkerState>()(
  persist(
    (set, get) => ({
      isActive: false,
      ...initialBookingState,
      location: { latitude: 0, longitude: 0 },
      amount: 0,
      isPaymentReceived: false,
      verifyPayment: false,
      makePayment: true,
      yourOTP: "",
      isMapLoaded: false,

      setAvailability: (status) => set({ isActive: status }),

      updateLocation: (lat, lng) =>
        set({ location: { latitude: lat, longitude: lng } }),

      setIncomingBooking: (booking) =>
        set({
          incomingBooking: booking,
          amount: booking?.jobDetails?.priceRange ?? 0,
          ...(booking ? { isBookingAccepted: false } : {}),
        }),

      setBookingAccepted: (value) => set({ isBookingAccepted: value }),

      setOutForService: (value) => set({ outForService: value }),

      setArrivedAtDestination: (value) =>
        set({ arrivedAtDestination: value }),

      setArrivedNearby: (value) => set({ arrivedNearby: value }),

      setAmount: (value) => set({ amount: value }),

      setIsPaymentReceived: (value) => set({ isPaymentReceived: value }),

      setVerifyPayment: (value) => set({ verifyPayment: value }),

      setMakePayment: (value) => set({ makePayment: value }),

      setYourOTP: (value) => set({ yourOTP: value }),

      setIsMapLoaded: (value) => set({ isMapLoaded: value }),

      setIsWorkDoneClicked: (value) => set({ isWorkDoneClicked: value }),

      setWorkDoneInterval: (value) =>
        set((state) => ({
          workDoneInterval:
            typeof value === "function" ? value(state.workDoneInterval) : value,
        })),

      resetBookingFlow: () =>
        set({
          ...initialBookingState,
          incomingBooking: get().incomingBooking, // Keep incomingBooking for display
        }),

      initSocketListeners: (socket) => {
        if (!socket) return;

        const handleIncomingRequest = (data: zodIncomingBookingType) => {
          set({
            incomingBooking: data,
            amount: data.jobDetails.priceRange,
            isBookingAccepted: false,
            arrivedNearby: false,
            outForService: false,
            arrivedAtDestination: false,
            isWorkDoneClicked: false,
            workDoneInterval: 0,
          });
          toast.info("New booking request received!", {
            position: "top-right",
            description: "You have a new booking request. Check details below.",
          });
        };

        const handlePaymentReceived = (data: { amount: number }) => {
          set({
            isPaymentReceived: true,
            verifyPayment: true,
            amount: data.amount,
          });
          toast.success("Payment received successfully", {
            position: "top-right",
          });
        };

        const handlePaymentError = (error: { message: string }) => {
          set({ isPaymentReceived: false });
          toast.error(error.message, {
            position: "top-right",
          });
        };

        socket.on("incoming-request", handleIncomingRequest);
        socket.on("payment-received", handlePaymentReceived);
        socket.on("payment-error", handlePaymentError);
      },

      cleanupListeners: (socket) => {
        if (!socket) return;
        socket.off("incoming-request");
        socket.off("payment-received");
        socket.off("payment-error");
      },
    }),
    {
      name: "worker-storage",
      partialize: (state) => ({
        isActive: state.isActive,
        incomingBooking: state.incomingBooking,
        isBookingAccepted: state.isBookingAccepted,
        outForService: state.outForService,
        arrivedAtDestination: state.arrivedAtDestination,
        arrivedNearby: state.arrivedNearby,
      }),
    }
  )
);
