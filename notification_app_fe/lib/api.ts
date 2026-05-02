const EVALUATION_SERVER_URL = process.env.NEXT_PUBLIC_EVALUATION_SERVER_URL || "/evaluation-service";

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getAccessToken(): Promise<string> {
    if (accessToken && Date.now() < tokenExpiresAt) {
        return accessToken;
    }

    try {
        const response = await fetch(`${EVALUATION_SERVER_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: process.env.NEXT_PUBLIC_AFFORDMED_EMAIL,
                name: process.env.NEXT_PUBLIC_AFFORDMED_NAME,
                rollNo: process.env.NEXT_PUBLIC_AFFORDMED_ROLL_NO,
                accessCode: process.env.NEXT_PUBLIC_AFFORDMED_ACCESS_CODE,
                clientID: process.env.NEXT_PUBLIC_AFFORDMED_CLIENT_ID,
                clientSecret: process.env.NEXT_PUBLIC_AFFORDMED_CLIENT_SECRET
            })
        });

        if (!response.ok) {
            throw new Error(`Auth API returned ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.access_token) {
            accessToken = data.access_token as string;
            tokenExpiresAt = data.expires_in * 1000;
            return accessToken;
        }
        throw new Error("Failed to retrieve access token");
    } catch (error) {
        console.error("Auth error:", error);
        throw error;
    }
}

export interface Notification {
    ID: string;
    Type: "Placement" | "Result" | "Event";
    Message: string;
    Timestamp: string;
}

export async function fetchNotifications(params?: { limit?: number; page?: number; notification_type?: string }): Promise<Notification[]> {
    const token = await getAccessToken();
    const searchParams = new URLSearchParams();
    if (params) {
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.notification_type) searchParams.append('notification_type', params.notification_type);
    }
    const queryString = searchParams.toString();
    const finalUrl = `${EVALUATION_SERVER_URL}/notifications${queryString ? '?' + queryString : ''}`;

    const response = await fetch(finalUrl, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    const data = await response.json();
    return data.notifications || [];
}
