"use client";

import FishAnimation from "@/components/FishAnimation/FishAnimation";

export default function FishDemoPage() {
    return (
        <main className="w-full min-h-screen bg-neutral-900 flex flex-col items-center justify-center">
            <div className="relative w-full h-[60vh] md:h-[80vh] bg-neutral-800">
                <FishAnimation frameCount={240} className="z-0" />

                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-widest uppercase mix-blend-overlay">
                        Deep Ocean
                    </h1>
                </div>
            </div>

            <div className="p-8 text-neutral-400 max-w-2xl text-center">
                <p>Scroll down to test visibility observer</p>
                <div className="h-[150vh]"></div>
                <p>Animation should pause when you see this</p>
            </div>
        </main>
    );
}
