export class FrameLoader {
    private frames: Map<number, HTMLImageElement> = new Map();
    private totalFrames: number;
    private basePath: string;
    private extension: string;
    private isLoading: boolean = false;
    private padLength: number;

    constructor(totalFrames: number, basePath: string, extension: string = '.jpg', padLength: number = 3) {
        this.totalFrames = totalFrames;
        this.basePath = basePath;
        this.extension = extension;
        this.padLength = padLength;
    }

    public getFrame(index: number): HTMLImageElement | undefined {
        return this.frames.get(index);
    }

    public preload(batchSize: number = 10): void {
        if (this.frames.size >= this.totalFrames || this.isLoading) return;

        this.isLoading = true;
        let loadedCount = 0;

        const loadNextBatch = (startIndex: number) => {
            if (startIndex >= this.totalFrames) {
                this.isLoading = false;
                return;
            }

            const endIndex = Math.min(startIndex + batchSize, this.totalFrames);
            let batchLoaded = 0;

            for (let i = startIndex; i < endIndex; i++) {
                if (this.frames.has(i)) {
                    batchLoaded++;
                    if (batchLoaded === endIndex - startIndex) {
                        // If all in this batch were already loaded (race condition?), just proceed
                        loadNextBatch(endIndex);
                    }
                    continue;
                }

                const img = new Image();
                // Construct filename: frame_001.jpg
                // Note: The previous logic might have renamed them to frame_001.jpg (1-based) or frame_000.jpg (0-based).
                // My previous investigation showed ezgif-frame-001.jpg.
                // Assuming my rename script worked, let's verify if I used 1-based indexing in rename logic.
                // The script: $newName = "frame_" + $_.Name.Replace("ezgif-frame-", "").Replace(".jpg", "").PadLeft(3, '0') + ".jpg"
                // Original was 001..240 so it's 1-based.
                // So index 0 frame is actually frame_001.jpg

                const frameNumber = (i + 1).toString().padStart(this.padLength, '0');
                img.src = `${this.basePath}/frame_${frameNumber}${this.extension}`;

                img.onload = () => {
                    this.frames.set(i, img);
                    batchLoaded++;
                    loadedCount++;

                    if (batchLoaded === endIndex - startIndex) {
                        // Batch complete, schedule next batch
                        // Use requestIdleCallback if available for smoother UI, or simple setTimeout
                        if ('requestIdleCallback' in window) {
                            (window as any).requestIdleCallback(() => loadNextBatch(endIndex));
                        } else {
                            setTimeout(() => loadNextBatch(endIndex), 10);
                        }
                    }
                };

                img.onerror = () => {
                    console.error(`Failed to load frame ${i}`);
                    // Skip this frame and continue
                    batchLoaded++;
                    if (batchLoaded === endIndex - startIndex) {
                        setTimeout(() => loadNextBatch(endIndex), 10);
                    }
                }
            }
        };

        // Start loading from the first missing frame, or 0
        loadNextBatch(0);
    }

    public isLoaded(index: number): boolean {
        return this.frames.has(index);
    }
}
