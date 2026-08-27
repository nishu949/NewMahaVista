import os
import time
import uuid
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types


# ==========================================================
# ENVIRONMENT
# ==========================================================

BASE_DIR = Path(__file__).resolve().parents[2]

ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        f"GEMINI_API_KEY not found.\n"
        f"Expected .env at: {ENV_FILE}"
    )


# ==========================================================
# GEMINI CLIENT
# ==========================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ==========================================================
# GENERATED VIDEO DIRECTORY
# ==========================================================

VIDEO_DIR = BASE_DIR / "generated_videos"

VIDEO_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ==========================================================
# PREDEFINED PROMPT
# ==========================================================

MAHARASHTRA_ANIMATION_PROMPT = """
Transform the uploaded photograph into a magical cinematic
animated travel scene inspired by beautiful hand-drawn
Japanese fantasy animation.

IMPORTANT:
- Preserve the main person, landmark, architecture,
  landscape, clothing and important visual identity
  from the uploaded photograph.
- Do not replace the main subject with a completely
  different subject.
- Convert the visual appearance into a warm,
  hand-painted animated aesthetic.
- Use soft painterly textures.
- Use expressive but natural animation.
- Create a magical Maharashtra tourism atmosphere.
- Keep the scene culturally respectful and authentic.
- Preserve important Maharashtra architectural and
  environmental details.

ANIMATION:
- Add gentle natural movement.
- Add subtle movement to trees, clouds, fabric and hair.
- Add atmospheric particles and soft sunlight.
- Add cinematic depth.
- Add a slow, smooth camera push-in.
- Add a gentle cinematic camera movement.
- Make the scene feel alive rather than static.

VISUAL STYLE:
- hand-drawn animated appearance
- warm cinematic lighting
- painterly backgrounds
- soft colors
- detailed environment
- magical atmosphere
- family friendly
- elegant travel-film feeling
- high visual quality

CAMERA:
Start with a beautiful wide composition based on the
uploaded photograph.

Slowly move the camera forward toward the main subject.

Use subtle environmental motion while keeping the
main subject recognizable.

Do not add text, subtitles, logos, watermarks or UI elements.

Create a short cinematic Maharashtra tourism story
from the uploaded photograph.

The final result should look like an animated
travel memory coming to life.
"""


# ==========================================================
# GENERATE VIDEO
# ==========================================================

def generate_maharashtra_video(
    image_bytes: bytes,
    mime_type: str = "image/jpeg"
):
    """
    Convert an uploaded image into an animated
    Maharashtra tourism video using Veo 3.1.
    """

    print("========================================")
    print("🎬 STARTING VIDEO GENERATION")
    print("========================================")

    # ------------------------------------------------------
    # Create Gemini image object
    # ------------------------------------------------------

    image = types.Image(
        image_bytes=image_bytes,
        mime_type=mime_type
    )

    print("✅ Image loaded")
    print("🚀 Sending image to Veo 3.1...")

    # ------------------------------------------------------
    # Start video generation
    # ------------------------------------------------------

    operation = client.models.generate_videos(
        model="veo-3.1-generate-preview",
        prompt=MAHARASHTRA_ANIMATION_PROMPT,
        image=image,
    )

    print("✅ Video generation started")

    # ------------------------------------------------------
    # Poll until generation finishes
    # ------------------------------------------------------

    while not operation.done:

        print("⏳ Video is still generating...")

        time.sleep(10)

        operation = client.operations.get(operation)

    print("✅ Video generation completed")

    # ------------------------------------------------------
    # Check response
    # ------------------------------------------------------

    if not operation.response:
        raise RuntimeError(
            "Gemini returned no video response."
        )

    generated_videos = (
        operation.response.generated_videos
    )

    if not generated_videos:
        raise RuntimeError(
            "Gemini did not return a generated video."
        )

    generated_video = generated_videos[0]

    # ------------------------------------------------------
    # Download generated video
    # ------------------------------------------------------

    print("⬇️ Downloading generated video...")

    client.files.download(
        file=generated_video.video
    )

    # ------------------------------------------------------
    # Save video
    # ------------------------------------------------------

    filename = (
        f"maharashtra_story_"
        f"{uuid.uuid4().hex}.mp4"
    )

    output_path = VIDEO_DIR / filename

    generated_video.video.save(
        str(output_path)
    )

    print("========================================")
    print("🎉 VIDEO GENERATED SUCCESSFULLY")
    print(f"📁 Saved: {output_path}")
    print("========================================")

    return {
        "filename": filename,
        "path": str(output_path)
    }