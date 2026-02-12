import { zodIncomingBookingType } from "@/zod/incommingBooking";
import { create } from "zustand";

interface ActiveState {
    isActive: boolean;
    setIsActive: () => void;
}

interface IsBookingAcceptedState {
    isBookingAccepted: boolean;
    setIsBookingAccepted: ()=> void;
}

interface OutForServiceState {
    outForService: boolean;
    setOutForService: ()=> void;
}

interface ArrivedAtDestinationState {
    arrivedAtDestination: boolean;
    setArrivedAtDestination: ()=> void;
}

interface ArrivedNearbyState {
    arrivedNearby: boolean;
    setArrivedNearby: ()=> void;
}

interface IncomingBookingState {
    incomingBooking: zodIncomingBookingType | null;
    setIncomingBooking: (booking: zodIncomingBookingType | null) => void;
}

interface LocationState {
    location: {
        latitude: number;
        longitude: number;
    } | null;

    setLocation: (location: {
        latitude: number;
        longitude: number;
    } | null) => void;
}

interface ProfileStatusState {
    isProfileCompleted: boolean;
    setIsProfileCompleted: () => void;
}

interface AddressState {
    address: string | null;
    setAddress: (address: string | null) => void;
}



export const useActive = create<ActiveState>()( (set) => ({
        isActive: false,
        setIsActive: () => set((state) => ({ isActive: !state.isActive })),
    }),
)

export const useIncommingBooking = create<IncomingBookingState>()((set)=> ({
        incomingBooking: null,
        setIncomingBooking: (booking: zodIncomingBookingType | null) => set((state) => ({ incomingBooking: booking })),
    }),
)


export const useIsBookingAccepted = create<IsBookingAcceptedState>()((set)=> ({
    isBookingAccepted: false,
    setIsBookingAccepted: ()=> set((state) => ({ isBookingAccepted: !state.isBookingAccepted })),
}),
)


export const useOutForService = create<OutForServiceState>()((set)=>({
    outForService: false,
    setOutForService: ()=> set((state) => ({ outForService: !state.outForService })),
}),
)


export const useArrivedAtDestination = create<ArrivedAtDestinationState>()((set)=>({
    arrivedAtDestination: false,
    setArrivedAtDestination: ()=> set((state) => ({ arrivedAtDestination: !state.arrivedAtDestination })),
}),
)


export const useArrivedNearby = create<ArrivedNearbyState>()((set)=>({
    arrivedNearby: false,
    setArrivedNearby: ()=> set((state) => ({ arrivedNearby: !state.arrivedNearby })),
}),
)


export const useLocation = create<LocationState>()((set)=> ({
    location: null,
    setLocation: (location: {latitude: number, longitude: number} | null) => set(() => ({ location: location })),
}))


export const useProfileStatus = create<ProfileStatusState>()((set)=> ({
    isProfileCompleted: false,
    setIsProfileCompleted: () => set((state) => ({ isProfileCompleted: !state.isProfileCompleted })),
}))


export const useAddress = create<AddressState>()((set)=> ({
    address: null,
    setAddress: (address: string | null) => set(() => ({ address: address })),
}))