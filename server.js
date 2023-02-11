import express from "express";
import multer from "multer";
import path from "path";
import { spawn } from "child_process";

const app = express();
const port = 3000;
const jobs = {};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "tmp/");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    }
});

const upload = multer({ storage });

app.use(express.static("public"));

app.post("/process-mp3", upload.single("mp3"), async (req, res) => {
    const jobId = generateJobId();
    const mp3 = req.file;

    jobs[jobId] = { status: "processing" };

    try {
        const trackAnalysis = await processMp3(jobId, mp3.path);
        jobs[jobId].trackAnalysis = trackAnalysis;
        jobs[jobId].status = "completed";
    } catch (err) {
        console.error(err);
        jobs[jobId].status = "error";
    }

    res.json({ jobId });
});

app.get("/check-job-status", (req, res) => {
    const jobId = req.query.jobId;
    const job = jobs[jobId];
    res.json({ status: job.status, trackAnalysis: job.trackAnalysis });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

function generateJobId() {
    return [...Array(8)].map(() => Math.random().toString(36)[2]).join("");
}

function processMp3(jobId, mp3Path) {
    console.log("Processing MP3 file: " + mp3Path);
    const absolutePath = path.resolve(mp3Path);
    const tmpPath = path.resolve("./tmp");
    if (!absolutePath.startsWith(tmpPath)) {
        return Promise.reject("Invalid MP3 path: must be inside ./tmp directory");
    }

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python", ["process.py", absolutePath]);
        let data = "";
        let error = "";

        pythonProcess.stdout.on("data", chunk => {
            data += chunk.toString();
        });

        pythonProcess.stderr.on("data", chunk => {
            error += chunk.toString();
        });

        pythonProcess.on("close", code => {
            if (code !== 0) {
                reject(`Child process exited with code ${code}: ${error}`);
                return;
            }

            const waveformData = JSON.parse(data);
            resolve(waveformData);
        });
    });
}
