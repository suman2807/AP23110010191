const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../.env');
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

const { Log } = require('./dist/index.js');

async function test() {
    console.log("Starting log test...");
    await Log("frontend", "info", "component", "Testing the logging middleware successfully.");
    console.log("Log request sent.");
}

test();
