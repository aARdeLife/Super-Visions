const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadModel() {
    const model = await tf.loadGraphModel('https://tfhub.dev/tensorflow/coco-ssd/tfjs/1/default/1', { fromTFHub: true });
return model;
}

function drawRectangles(predictions) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;

    for (let i = 0; i < predictions.length; i++) {
        const [x, y, width, height] = predictions[i].bbox;
        ctx.strokeRect(x, y, width, height);
    }
}

async function detectObjects() {
    const predictions = await model.executeAsync(tf.browser.fromPixels(video).expandDims(0));

    drawRectangles(predictions);

    requestAnimationFrame(detectObjects);
}

async function main() {
    await setupCamera();
    video.play();

    model = await loadModel();

    detectObjects();
}

main();
