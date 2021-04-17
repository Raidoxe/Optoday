export type Task = {
    name: string;
    importance: number;
    TTD: number;
    AI: string;
    Auth?: string;
}

export type AuthResultData = {
    auth: string,
    result: boolean
}