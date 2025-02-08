const fs = require("fs");
const path = require("path");
const csvWriter = require("csv-writer").createObjectCsvWriter;
const { execSync } = require("child_process");
const yargs = require("yargs");

// Regular expression to parse Nginx logs
const LOG_PATTERN = /(?<ip>[\d.]+) - - \[(?<date>[^\]]+)\] "(?<method>\S+) (?<url>[^"]+) \S+" (?<status>\d+) (?<size>\d+)/;

// CLI options
const argv = yargs
    .option("filter", {
        alias: "f",
        describe: "Filter by HTTP status code (e.g., 200)",
        type: "string",
    })
    .option("sort", {
        alias: "s",
        describe: "Sort by field (ip, date, method, url, status, size)",
        type: "string",
    })
    .help()
    .alias("help", "h").argv;

const LOG_FILE = path.join(__dirname, "nginx.log");
const CSV_FILE = path.join(__dirname, "nginx_logs.csv");

// Function to parse Nginx logs
function parseLogs(logFile) {
    const logs = [];

    const data = fs.readFileSync(logFile, "utf8");
    const lines = data.split("\n");

    for (const line of lines) {
        const match = LOG_PATTERN.exec(line);
        if (match) {
            logs.push({
                ip: match.groups.ip,
                date: match.groups.date,
                method: match.groups.method,
                url: match.groups.url,
                status: match.groups.status,
                size: match.groups.size,
            });
        }
    }

    return logs;
}

// Filter logs (by HTTP status)
function filterLogs(logs, filter) {
    return filter ? logs.filter((log) => log.status === filter) : logs;
}

// Sort logs
function sortLogs(logs, sortBy) {
    return sortBy ? logs.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1)) : logs;
}

// Write logs to CSV
async function saveToCsv(logs, outputCsv) {
    const writer = csvWriter({
        path: outputCsv,
        header: [
            { id: "ip", title: "IP" },
            { id: "date", title: "Date" },
            { id: "method", title: "Method" },
            { id: "url", title: "URL" },
            { id: "status", title: "Status" },
            { id: "size", title: "Size" },
        ],
    });

    await writer.writeRecords(logs);
}

// Commit and push to Git
function commitToGit(filePath) {
    try {
        execSync(`git add ${filePath}`);
        execSync(`git commit -m "Updated logs: ${new Date().toISOString()}"`);
        execSync(`git push`);
        console.log("CSV file successfully saved and pushed to Git.");
    } catch (error) {
        console.error("Error committing to Git:", error.message);
    }
}

// Main process
(async () => {
    console.log("📖 Reading and parsing Nginx logs...");
    let logs = parseLogs(LOG_FILE);

    if (argv.filter) {
        console.log(`🔍 Filtering by HTTP status: ${argv.filter}`);
        logs = filterLogs(logs, argv.filter);
    }

    if (argv.sort) {
        console.log(`📌 Sorting by field: ${argv.sort}`);
        logs = sortLogs(logs, argv.sort);
    }

    console.log("💾 Saving to CSV...");
    await saveToCsv(logs, CSV_FILE);

    console.log("📤 Uploading to Git...");
    commitToGit(CSV_FILE);
})();
