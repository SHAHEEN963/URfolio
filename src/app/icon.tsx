import { ImageResponse } from "next/og";
import { MARK_D } from "@/lib/mark-path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B1412",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 1080 1080" fill="#D6A274">
          <path d={MARK_D} />
        </svg>
      </div>
    ),
    { ...size }
  );
}
