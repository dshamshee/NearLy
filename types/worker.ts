import mongoose from "mongoose";
import { Decimal128 } from "mongodb";

export interface Worker {
    userId: mongoose.Types.ObjectId;
    aadharNumber?: string;
    isAadharVerified?: boolean;
    isActive?: boolean;
    serviceCharge?: number;
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
    longitude?: Decimal128;
    latitude?: Decimal128;
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




