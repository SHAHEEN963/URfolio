import { ImageResponse } from "next/og";
import { MARK_D } from "@/lib/mark-path";
import { meta } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

/**
 * Generated in the brand style rather than a photo (brief §7 SEO). Vesterbro
 * can't be embedded here — Adobe Fonts never exposes the font file to the
 * build (Phase 0 flag 2) — so this uses ImageResponse's default sans until
 * an outlined "URfolio" wordmark SVG is supplied.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#1B1412",
          color: "#F2EAE6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="84" height="84" viewBox="0 0 1080 1080" fill="#D6A274">
            <path d={MARK_D} />
          </svg>
          <span style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em" }}>URfolio</span>
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 30, color: "#B6AEAB", maxWidth: 900 }}>
          {meta.description.split(":")[0]}: AI drafts it, a designer finishes it.
        </div>
      </div>
    ),
    { ...size }
  );
}
