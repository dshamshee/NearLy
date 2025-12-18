'use server'

import dbConnect from "@/utils/dbConnection"

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

resend.domains.create({ name: 'example.com' });

export async function emailVerificationAction(email: string){
    await dbConnect();
}