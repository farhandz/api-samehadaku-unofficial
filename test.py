from ultralytics import YOLO

# Load the YOLO model
model = YOLO("bisindov2.pt")

# Perform prediction on the video source (0 for the default webcam)

model.export(format="onnx", simplify=True)  # creates 'yolov8n.onnx'

# Load the exported ONNX model
# onnx_model = YOLO("bisindo.onnx")
# The 'show=True' argument ensures that the results are displayed in real-time
