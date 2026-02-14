
interface AnimationConfig {
    fps?: number; // Target FPS (30 or 60)
    canvasContext: CanvasRenderingContext2D;
    frameLoader: any; // Using any for now to avoid circular typing issues, strictly refers to FrameLoader
    totalFrames: number;
    width: number;
    height: number;
}

export class AnimationController {
    private ctx: CanvasRenderingContext2D;
    private frameLoader: any;
    private width: number;
    private height: number;
    private totalFrames: number;

    private isPlaying: boolean = false;
    private currentFrameIndex: number = 0;
    private lastFrameTime: number = 0;
    private fpsInterval: number;
    private animationFrameId: number | null = null;

    // Interaction State
    private mouseX: number = 0;
    private mouseY: number = 0;
    private targetX: number = 0;
    private targetY: number = 0;

    constructor(config: AnimationConfig) {
        this.ctx = config.canvasContext;
        this.frameLoader = config.frameLoader;
        this.totalFrames = config.totalFrames;
        this.width = config.width;
        this.height = config.height;

        const fps = config.fps || 30; // Default to 30 for safety, can be upgraded to 60
        this.fpsInterval = 1000 / fps;
    }

    public setDimensions(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public updateInteraction(normalizeX: number, normalizeY: number) {
        // normalized input from -1 to 1 based on mouse position from center
        this.targetX = normalizeX * 20; // Max shift 20px
        this.targetY = normalizeY * 20;
    }

    public start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.lastFrameTime = performance.now();
        this.loop();
    }

    public stop() {
        this.isPlaying = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    private loop = () => {
        if (!this.isPlaying) return;

        this.animationFrameId = requestAnimationFrame(this.loop);

        const now = performance.now();
        const elapsed = now - this.lastFrameTime;

        if (elapsed > this.fpsInterval) {
            this.lastFrameTime = now - (elapsed % this.fpsInterval);

            // Update frame index
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.totalFrames;

            this.draw();
        }

        // Smoothly interpolate mouse movement (Lerp)
        this.mouseX += (this.targetX - this.mouseX) * 0.1;
        this.mouseY += (this.targetY - this.mouseY) * 0.1;
    };

    private draw() {
        const img = this.frameLoader.getFrame(this.currentFrameIndex);

        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (img) {
            this.drawCover(img);
        }
    }

    private drawCover(img: HTMLImageElement) {
        // Parallax offset
        const offsetX = this.mouseX;
        const offsetY = this.mouseY;

        // Calculate aspect ratios
        const canvasRatio = this.width / this.height;
        const imgRatio = img.width / img.height;

        let drawWidth, drawHeight, drawX, drawY;

        // "Contain" logic but we want "Cover"
        if (canvasRatio > imgRatio) {
            // Canvas is wider than image (relative to height)
            drawWidth = this.width;
            drawHeight = this.width / imgRatio;
            drawX = 0;
            drawY = (this.height - drawHeight) / 2;
        } else {
            // Canvas is taller than image
            drawHeight = this.height;
            drawWidth = this.height * imgRatio;
            drawX = (this.width - drawWidth) / 2;
            drawY = 0;
        }

        // Apply scaling to ensure no edges are visible with parallax
        const scale = 1.05; // 5% overscan
        drawWidth *= scale;
        drawHeight *= scale;
        drawX = (this.width - drawWidth) / 2; // Re-center with scale
        drawY = (this.height - drawHeight) / 2;

        // Apply parallax
        drawX += offsetX;
        drawY += offsetY;

        this.ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }
}
