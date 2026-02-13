import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Arot Hisab - Fish Market Calculator";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: "linear-gradient(to bottom right, #3b82f6, #8b5cf6)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ fontSize: "80px" }}>🐟</div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: "72px", fontWeight: "bold" }}>
                            Arot Hisab
                        </div>
                        <div style={{ fontSize: "32px", opacity: 0.9 }}>
                            Fish Market Calculator
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        marginTop: "40px",
                        fontSize: "24px",
                        opacity: 0.8,
                    }}
                >
                    Automated Calculations for Wholesale Markets
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
