// app/api/validate/route.js
import { NextResponse } from "next/server";
import { schema, YOUTUBE_REGEX, INSTAGRAM_REGEX } from "@/lib/socialMediaValidator";

// If Node < 18, uncomment below:
// import fetch from "node-fetch";

export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ Validate input using Joi
    const { value, error } = schema.validate(body, { abortEarly: false });
    if (error) {
      return NextResponse.json(
        { ok: false, errors: error.details.map(d => d.message) },
        { status: 400 }
      );
    }

    const { url, verifyRemote } = value;
    let type = "unknown";
    let meta = {};

    // Determine platform and extract meta
    if (YOUTUBE_REGEX.test(url)) {
      type = "youtube";
      meta.videoId = url.match(YOUTUBE_REGEX)[1];
    } else if (INSTAGRAM_REGEX.test(url)) {
      type = "instagram";
      const m = url.match(INSTAGRAM_REGEX);
      meta.kind = m[1]; // p / reel / tv
      meta.id = m[2];
    } else {
      type = "linkedin"; // fallback
    }

    // Optional remote verification
    let remote = {};
    if (verifyRemote) {
      try {
        if (type === "youtube") {
          // Use YouTube oEmbed to check availability
          const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
            url
          )}&format=json`;

          const res = await fetch(oembedUrl);
          if (res.ok) {
            const data = await res.json();
            remote = {
              status: res.status,
              isValid: true,
              title: data.title,
              author_name: data.author_name,
              thumbnail_url: data.thumbnail_url,
            };
          } else {
            // Video unavailable or deleted
            remote = { status: res.status, isValid: false, message: "Video unavailable" };
          }
        } else if (type === "instagram") {
          // Only validate format; availability cannot be reliably checked server-side
          remote = { isValid: true, message: "Availability must be checked on frontend" };
        } else {
          // Generic: try HEAD request
          const res = await fetch(url, { method: "HEAD" });
          const ct = res.headers.get("content-type") || "";
          remote = {
            status: res.status,
            contentType: ct,
            isImage: ct.startsWith("image/"),
            isVideo: ct.startsWith("video/"),
            isValid: res.ok,
          };
        }
      } catch (err) {
        remote = { error: err.message, isValid: false };
      }
    }

    return NextResponse.json({
      ok: true,
      data: { type, url, meta, remote },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
