import cv2
import numpy as np
import os
import sys
import json
import base64

# Get video path from Node.js
if len(sys.argv) < 2:
    print(json.dumps({"error": "Video path not provided"}))
    sys.exit(1)

video_path = sys.argv[1]

# Paths for YOLO configuration and weights files
weights_path = r"D:\video-processing-system\server\src\service\yolo\yolov3.weights"
cfg_path = r"D:\video-processing-system\server\src\service\yolo\yolov3.cfg"
names_path = r"D:\video-processing-system\server\src\service\yolo\coco.names"

# Validate file paths
if not (os.path.exists(cfg_path) and os.path.exists(weights_path) and os.path.exists(names_path)):
    print(json.dumps({"error": "YOLO config, weights, or names file not found."}))
    sys.exit(1)

# Load YOLO model
yolo_net = cv2.dnn.readNet(weights_path, cfg_path)

# Get YOLO layer names
layer_names = yolo_net.getLayerNames()
output_layers = [layer_names[i - 1] for i in yolo_net.getUnconnectedOutLayers()]

# Load COCO class labels
with open(names_path, "r") as f:
    classes = [line.strip() for line in f.readlines()]

# Function to process a frame and get object detections
def process_frame(frame):
    height, width, _ = frame.shape
    blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), swapRB=True, crop=False)
    yolo_net.setInput(blob)
    outputs = yolo_net.forward(output_layers)

    boxes, confidences, class_ids, detections = [], [], [], []

    for output in outputs:
        for detection in output:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = float(scores[class_id])

            if confidence > 0.5:
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                boxes.append([x, y, w, h])
                confidences.append(confidence)
                class_ids.append(class_id)

    indices = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

    for i in indices.flatten():
        x, y, w, h = boxes[i]
        label = str(classes[class_ids[i]])
        confidence = confidences[i]
        detections.append({
            'class': label,
            'confidence': confidence,
            'box': [x, y, w, h]
        })
        # Optional drawing (if you want to visualize the frame)
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, f"{label} {confidence:.2f}", (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    return detections, frame

def process_video(video_path):
    cap = cv2.VideoCapture(video_path)

    all_detections = []  # List to store detections for all frames
    all_frames_base64 = []  # List to store all frames encoded as base64

    frame_count = 0  # To track the number of frames processed
    frames_to_process = 5  # Number of frames to process

    while cap.isOpened() and frame_count < frames_to_process:
        ret, frame = cap.read()

        if not ret:
            break

        frame_count += 1

        # Process the frame with YOLO detections
        detections, processed_frame = process_frame(frame)

        # Append detections to all_detections
        all_detections.append(detections)

        # Encode the frame as base64
        _, buffer = cv2.imencode('.jpg', processed_frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')

        # Append the base64 encoded frame to the list
        all_frames_base64.append(frame_base64)

    cap.release()

    # Return all detections and frames as JSON
    return {
        "detections": all_detections,
        "frames": all_frames_base64
    }

# Process video and get results
result = process_video(video_path)

# Print out the JSON result (or send it over the network to Node.js)
print(json.dumps(result, indent=4))
