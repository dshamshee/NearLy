"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function Assessment() {

    const [isLoading, setIsLoading] = useState(false);

    const handleSendAssessment = async () => {
        setIsLoading(true);
        try {
        const response = await axios.post("/api/send-assesment", {
            to: "danishshamshee@gmail.com",
        });
        if (response.data.success) {
            toast.success("Assessment sent successfully");
            setIsLoading(false);
        } else {
            toast.error("Failed to send assessment");
            setIsLoading(false);
        }
        } catch (error) {
            toast.error("Failed to send assessment");
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">
            <h1>Assessment</h1>
            <Button className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600" onClick={handleSendAssessment} disabled={isLoading}>{isLoading ? "Sending..." : "Send Assessment"}</Button>
        </div>
    );
}