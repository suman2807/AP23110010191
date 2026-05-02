let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

type LogStack = "backend" | "frontend";
type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

const EVALUATION_SERVER_URL = process.env.NEXT_PUBLIC_EVALUATION_SERVER_URL || "http://20.207.122.201/evaluation-service";

async function getAccessToken(): Promise<string> {
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
        email: process.env.AFFORDMED_EMAIL || process.env.NEXT_PUBLIC_AFFORDMED_EMAIL,
        name: process.env.AFFORDMED_NAME || process.env.NEXT_PUBLIC_AFFORDMED_NAME,
        rollNo: process.env.AFFORDMED_ROLL_NO || process.env.NEXT_PUBLIC_AFFORDMED_ROLL_NO,
        accessCode: process.env.AFFORDMED_ACCESS_CODE || process.env.NEXT_PUBLIC_AFFORDMED_ACCESS_CODE,
        clientID: process.env.AFFORDMED_CLIENT_ID || process.env.NEXT_PUBLIC_AFFORDMED_CLIENT_ID,
        clientSecret: process.env.AFFORDMED_CLIENT_SECRET || process.env.NEXT_PUBLIC_AFFORDMED_CLIENT_SECRET
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
    throw new Error("Failed to retrieve access token from auth response.");
  } catch (error) {
    console.error("Error authenticating logging middleware:", error);
    throw error;
  }
}

export async function Log(stack: LogStack, level: LogLevel, pkg: string, message: string): Promise<void> {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`${EVALUATION_SERVER_URL}/logs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to push log to server. Status: ${response.status} ${response.statusText}. Body: ${errorText}`);
    }
  } catch (error) {
    console.error("Failed to execute log function:", error);
  }
}
