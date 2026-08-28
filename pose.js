import {
    FilesetResolver,
    PoseLandmarker,
    DrawingUtils
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm";

const video = document.getElementById("camera");
const status = document.getElementById("status");

let poseLandmarker = null;
let lastVideoTime = -1;

async function initializePoseDetection() {

    status.textContent = "Loading body detection... 🧠";

    try {

        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm"
        );

        poseLandmarker = await PoseLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",

                    delegate: "GPU"
                },

                runningMode: "VIDEO",

                numPoses: 1
            }
        );

        status.textContent = "Body detection ready! 🧍";

        console.log("Pose detection initialized successfully.");

        detectPose();

    } catch (error) {

        console.error("Pose detection error:", error);

        status.textContent =
            "Could not load body detection. Check the browser console.";

    }
}


function detectPose() {

    if (!poseLandmarker) {
        requestAnimationFrame(detectPose);
        return;
    }

    if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {

        lastVideoTime = video.currentTime;

        const results = poseLandmarker.detectForVideo(
            video,
            performance.now()
        );

        if (results.landmarks && results.landmarks.length > 0) {

            const landmarks = results.landmarks[0];

            console.log("Body detected:", landmarks);

            updateBodyStatus(landmarks);
        }
    }

    requestAnimationFrame(detectPose);
}


function updateBodyStatus(landmarks) {

    const nose = landmarks[0];

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    console.log({
        nose,
        leftShoulder,
        rightShoulder,
        leftHip,
        rightHip
    });
}


initializePoseDetection();
