const fs = require('fs');
const path = require('path');
const https = require('http'); 

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of env) {
        if (!line.trim() || line.startsWith('#')) continue;
        const index = line.indexOf('=');
        if (index > 0) {
            const key = line.substring(0, index).trim();
            const val = line.substring(index + 1).trim();
            process.env[key] = val;
        }
    }
}

const EVALUATION_SERVER_URL = "http://20.207.122.201/evaluation-service";

function getWeight(type) {
    switch (type) {
        case "Placement": return 3;
        case "Result": return 2;
        case "Event": return 1;
        default: return 0;
    }
}

function comparePriority(a, b) {
    const weightA = getWeight(a.Type);
    const weightB = getWeight(b.Type);

    if (weightA !== weightB) {
        return weightA - weightB; 
    }

    const timeA = new Date(a.Timestamp).getTime();
    const timeB = new Date(b.Timestamp).getTime();
    return timeA - timeB;
}

function postAuth(url, data) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);
        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

function getNotifications(url, token) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.end();
    });
}

async function runStage1() {
    try {
        console.log("Authenticating to get token...");
        const authRes = await postAuth(`${EVALUATION_SERVER_URL}/auth`, {
            email: process.env.AFFORDMED_EMAIL,
            name: process.env.AFFORDMED_NAME,
            rollNo: process.env.AFFORDMED_ROLL_NO,
            accessCode: process.env.AFFORDMED_ACCESS_CODE,
            clientID: process.env.AFFORDMED_CLIENT_ID,
            clientSecret: process.env.AFFORDMED_CLIENT_SECRET
        });
        
        const token = authRes.access_token;
        if (!token) throw new Error("No token received");

        console.log("Fetching notifications...");
        const notifRes = await getNotifications(`${EVALUATION_SERVER_URL}/notifications`, token);

        const notifications = notifRes.notifications;
        if (!notifications) throw new Error("No notifications received");

        console.log(`Received ${notifications.length} notifications.`);
        console.log("Applying Priority Logic (Top 10)...");

        const sorted = [...notifications].sort((a, b) => comparePriority(b, a));
        const top10 = sorted.slice(0, 10);

        console.log("\n================ TOP 10 PRIORITY NOTIFICATIONS ================\n");
        top10.forEach((n, i) => {
            console.log(`${(i + 1).toString().padStart(2, ' ')}. [${n.Type}] - ${n.Timestamp}`);
            console.log(`    Message: ${n.Message}`);
            console.log(`    ID: ${n.ID}\n`);
        });

    } catch (err) {
        console.error("Error in Stage 1 script:", err);
    }
}

runStage1();
