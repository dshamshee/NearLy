import mongoose from "mongoose";

export interface Worker {
    role: "WORKER";
    name: string;
    email: string;
    phone: string;
    aadharNumber?: string;
    isAadharVerified?: boolean;
    password?: string;
    googleId?: string;
    avatar?: string;
    isActive?: boolean;
    isProfileCompleted?: boolean;
    profession: WorkerProfessions;
    otherProfession?: string;
    proficienciyLevel: "BEGINNER" | "INTERMEDIATE" | "EXPERT";
    workExperience?: "1 YEAR" | "2 YEARS" | "3 YEARS" | "4 YEARS" | "5 YEARS" | "MORE THAN 5 YEARS";
    reviews?: Review[];
    averageRating?: number;
    totalBookings?: number;
    totalEarnings?: number;
    currentBookingId?: mongoose.Types.ObjectId;
    longitude?: number;
    latitude?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum WorkerProfessions {
    PLUMBER = "PLUMBER",
    ELECTRICIAN = "ELECTRICIAN",
    CARPENTER = "CARPENTER",
    PAINTER = "PAINTER",
    CLEANER = "CLEANER",
    PIP_EFITTER = "PIP_EFITTER",
    MASON = "MASON",
    WELDER = "WELDER",
    LABOUR = "LABOUR",
    AC_TECHNICIAN = "AC_TECHNICIAN",
    OTHER = "OTHER",
}



export interface Review {
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}




