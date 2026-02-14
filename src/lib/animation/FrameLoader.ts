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
        if (this.frames.size >= this.totalFrames) return;
        // Allow concurrent preloads if not everything is loaded, but avoid spamming

        let loadedCount = 0;

        const loadNextBatch = (startIndex: number) => {
            if (startIndex >= this.totalFrames) {
                this.isLoading = false;
                return;
            }

            const endIndex = Math.min(startIndex + batchSize, this.totalFrames);
            let batchLoaded = 0;
            let batchErrors = 0;

            for (let i = startIndex; i < endIndex; i++) {
                if (this.frames.has(i)) {
                    batchLoaded++;
                    if (batchLoaded === endIndex - startIndex) {
                        // Continue to next batch
                        if ('requestIdleCallback' in window) {
                            (window as any).requestIdleCallback(() => loadNextBatch(endIndex));
                        } else {
                            setTimeout(() => loadNextBatch(endIndex), 0);
                        }
                    }
                    continue;
                }

                const img = new Image();
                const frameNumber = (i + 1).toString().padStart(this.padLength, '0');
                img.src = `${this.basePath}/frame_${frameNumber}${this.extension}`;

                img.onload = () => {
                    this.frames.set(i, img);
                    batchLoaded++;

                    if (batchLoaded + batchErrors === endIndex - startIndex) {
                        if ('requestIdleCallback' in window) {
                            (window as any).requestIdleCallback(() => loadNextBatch(endIndex));
                        } else {
                            setTimeout(() => loadNextBatch(endIndex), 0);
                        }
                    }
                };

                img.onerror = () => {
                    // console.error(`Failed to load frame ${i}`);
                    batchErrors++;
                    // Retry once? Or just skip. For now, skip to avoid stalling.
                    // We treat error as "processed" for batch completion purposes
                    if (batchLoaded + batchErrors === endIndex - startIndex) {
                        setTimeout(() => loadNextBatch(endIndex), 0);
                    }
                }
            }
        };

        // If not already loading or stuck, start/continue
        if (!this.isLoading) {
            this.isLoading = true;
            // Find first missing frame to start from, optimization
            let firstMissing = 0;
            while (this.frames.has(firstMissing) && firstMissing < this.totalFrames) {
                firstMissing++;
            }
            loadNextBatch(firstMissing);
        }
    }

    public isLoaded(index: number): boolean {
        return this.frames.has(index);
    }
}
