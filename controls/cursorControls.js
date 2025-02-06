export default class CursorControls {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;

        this.isDragging = false;
        this.previousMouseX = 0;
        this.previousMouseY = 0;
        this.zoomSpeed = 1.2;
        this.rotationSpeed = 0.005;

        // Event listeners for Mouse & Touchpad
        this.addMouseControls();
        this.addTouchpadControls();
    }

    addMouseControls() {
        this.renderer.domElement.addEventListener("mousedown", (event) => {
            this.isDragging = true;
            this.previousMouseX = event.clientX;
            this.previousMouseY = event.clientY;
        });

        this.renderer.domElement.addEventListener("mouseup", () => {
            this.isDragging = false;
        });

        this.renderer.domElement.addEventListener("mousemove", (event) => {
            if (!this.isDragging) return;

            let deltaX = event.clientX - this.previousMouseX;
            let deltaY = event.clientY - this.previousMouseY;

            this.previousMouseX = event.clientX;
            this.previousMouseY = event.clientY;

            this.camera.rotation.y -= deltaX * this.rotationSpeed;
            this.camera.rotation.x -= deltaY * this.rotationSpeed;
        });

        this.renderer.domElement.addEventListener("wheel", (event) => {
            let zoomFactor = event.deltaY > 0 ? this.zoomSpeed : 1 / this.zoomSpeed;
            this.camera.position.z *= zoomFactor;
        });
    }

    addTouchpadControls() {
        let touchStartX = 0, touchStartY = 0;
        let lastDistance = 0;

        this.renderer.domElement.addEventListener("touchstart", (event) => {
            if (event.touches.length === 1) {
                // Single touch (Drag)
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
            } else if (event.touches.length === 2) {
                // Pinch gesture (Zoom)
                lastDistance = this.getTouchDistance(event);
            }
        });

        this.renderer.domElement.addEventListener("touchmove", (event) => {
            if (event.touches.length === 1) {
                // Single finger drag (Rotate Camera)
                let deltaX = event.touches[0].clientX - touchStartX;
                let deltaY = event.touches[0].clientY - touchStartY;

                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;

                this.camera.rotation.y -= deltaX * this.rotationSpeed;
                this.camera.rotation.x -= deltaY * this.rotationSpeed;
            } else if (event.touches.length === 2) {
                // Pinch gesture (Zoom)
                let currentDistance = this.getTouchDistance(event);
                let zoomFactor = currentDistance > lastDistance ? 0.98 : 1.02;

                this.camera.position.z *= zoomFactor;
                lastDistance = currentDistance;
            }
        });
    }

    getTouchDistance(event) {
        let dx = event.touches[0].clientX - event.touches[1].clientX;
        let dy = event.touches[0].clientY - event.touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    update() {
        // You can add more control logic if needed
    }
}
