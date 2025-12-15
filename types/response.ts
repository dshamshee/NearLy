export interface Response {
    success: boolean;
    message: string;
    data?: unknown;
    error?: unknown;
    statusCode: number;
}
