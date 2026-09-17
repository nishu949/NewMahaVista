import { useEffect, useState, useRef } from "react";
import {
  Sparkles,
  Lightbulb,
  XCircle,
  ArrowRight,
  Trophy,
  BookOpen,
  Play,
  RefreshCw,
  MapPin,
  LockKeyhole,
  Upload,
  Loader2,
  X,
  Download,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function MaharashtraMystery() {
  const [mystery, setMystery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [revealedClues, setRevealedClues] = useState([]);
  const [error, setError] = useState("");

  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [storyTheme, setStoryTheme] = useState("heritage");
  const [generatingStory, setGeneratingStory] = useState(false);
  const [storyVideoUrl, setStoryVideoUrl] = useState(null);
  const [storyError, setStoryError] = useState("");
  const [storyText, setStoryText] = useState("");
  const [storyTitle, setStoryTitle] = useState("");

  const fileInputRef = useRef(null);

  const storyThemes = [
    { value: "heritage", label: "🏛️ Heritage", desc: "Ancient monuments & history" },
    { value: "culture", label: "🎭 Culture", desc: "Traditions & festivals" },
    { value: "food", label: "🍛 Food", desc: "Maharashtrian cuisine" },
  ];

  // ==========================================================
  // PAGE BACKGROUND
  // ==========================================================
  const pageBackground = {
    backgroundImage: "url('/images/MystryImage.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  };

  const fetchMystery = async () => {
    try {
      setLoading(true);
      setError("");
      setAnswer("");
      setResult(null);
      setRevealedClues([]);
      setStoryVideoUrl(null);
      setShowStoryModal(false);

      const response = await fetch(`${API_BASE_URL}/api/mysteries/random`);
      if (!response.ok) throw new Error("Unable to load mystery.");
      const data = await response.json();
      setMystery(data.mystery);
    } catch (err) {
      console.error("Mystery loading error:", err);
      setError("Unable to load today's mystery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMystery();
  }, []);

  const handleDiscoverMore = () => {
    if (mystery?.wiki_url) {
      window.open(mystery.wiki_url, "_blank", "noopener,noreferrer");
    } else {
      console.warn("No Wikipedia URL available for this mystery.");
    }
  };

  const revealClue = async () => {
    if (!mystery) return;
    const nextClueNumber = revealedClues.length + 1;
    if (nextClueNumber > 3) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/mysteries/${mystery._id}/clue/${nextClueNumber}`
      );
      if (!response.ok) throw new Error("Unable to load clue.");
      const data = await response.json();
      setRevealedClues((previous) => [...previous, data.clue]);
    } catch (err) {
      console.error("Clue error:", err);
      setError("Unable to load clue.");
    }
  };

  const submitAnswer = async (event) => {
    event.preventDefault();
    if (!answer.trim() || !mystery) return;

    try {
      setChecking(true);
      setResult(null);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/mysteries/${mystery._id}/answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answer: answer.trim(),
            clues_used: revealedClues.length,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to check answer.");
      setResult(data);
    } catch (err) {
      console.error("Answer checking error:", err);
      setError(err.message || "Something went wrong while checking your answer.");
    } finally {
      setChecking(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStoryError("Please upload a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStoryError("Image size should be less than 5MB.");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (event) => setImagePreview(event.target.result);
    reader.readAsDataURL(file);
    setStoryError("");
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetStory = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setStoryVideoUrl(null);
    setStoryText("");
    setStoryTitle("");
    setStoryError("");
    setStoryTheme("heritage");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeStoryModal = () => {
    setShowStoryModal(false);
    resetStory();
  };

  const generateStory = async () => {
    if (!selectedImage) {
      setStoryError("Please upload a photo first.");
      return;
    }

    setGeneratingStory(true);
    setStoryError("");
    setStoryVideoUrl(null);
    setStoryText("");
    setStoryTitle("");

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("theme", storyTheme);
      if (mystery?.answer) formData.append("mystery_answer", mystery.answer);
      if (mystery?.title) formData.append("mystery_title", mystery.title);

      const response = await fetch(
        `${API_BASE_URL}/api/mysteries/generate-video`,
        { method: "POST", body: formData }
      );

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The backend returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "Unable to generate your video."
        );
      }

      if (!data?.video_url) {
        throw new Error("Video URL was not returned by the backend.");
      }

      const fullVideoUrl =
        data.video_url.startsWith("http://") || data.video_url.startsWith("https://")
          ? data.video_url
          : `${API_BASE_URL}${data.video_url}`;

      console.log("Generated video:", fullVideoUrl);
      setStoryVideoUrl(fullVideoUrl);
      setStoryTitle(data.title || "Your Maharashtra Adventure");
      setStoryText(
        data.story ||
          data.description ||
          "Your photo has been transformed into an animated Maharashtra adventure."
      );
    } catch (error) {
      console.error("Video generation error:", error);
      setStoryError(
        error.message || "Something went wrong while creating your animated story."
      );
    } finally {
      setGeneratingStory(false);
    }
  };

  const downloadStory = () => {
    if (!storyVideoUrl) return;
    const link = document.createElement("a");
    link.href = storyVideoUrl;
    link.download = "my-maharashtra-story.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const StoryModal = () => {
    if (!showStoryModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl border border-white/40">
          <button
            onClick={closeStoryModal}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <h2 className="text-2xl font-bold text-[#2d1a14] mb-2 pr-10">
            🎬 Create Your Animated Story
          </h2>

          <p className="text-[#72574c] mb-6">
            Upload a photo and choose a theme to generate a personalized story
            about Maharashtra.
          </p>

          {!storyVideoUrl && !generatingStory && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#3d2922] mb-2">
                  Choose Story Theme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {storyThemes.map((theme) => (
                    <button
                      type="button"
                      key={theme.value}
                      onClick={() => setStoryTheme(theme.value)}
                      className={`p-3 rounded-xl border-2 text-center transition ${
                        storyTheme === theme.value
                          ? "border-[#a45a24] bg-[#fff4df] shadow-sm"
                          : "border-[#eadbd3] hover:border-[#c9957d] bg-white/70 backdrop-blur-sm"
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {theme.label.split(" ")[0]}
                      </div>
                      <div className="text-sm font-medium text-[#2d1a14]">
                        {theme.label.split(" ").slice(1).join(" ")}
                      </div>
                      <div className="text-xs text-[#72574c] mt-1">
                        {theme.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#3d2922] mb-2">
                  Upload Your Photo
                </label>
                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#dcc8bd] rounded-2xl p-8 text-center hover:border-[#a45a24] hover:bg-[#fffaf7]/70 cursor-pointer transition bg-white/50"
                  >
                    <Upload className="w-10 h-10 text-[#965034] mx-auto mb-3" />
                    <p className="text-[#72574c]">Click to upload your photo</p>
                    <p className="text-xs text-[#a38b7e] mt-1">
                      JPG, PNG, WebP • Max 5MB
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {storyError && (
                <div className="mb-4 p-3 rounded-xl bg-[#fff1ef] border border-[#f0cbc5] text-sm text-[#7c4038]">
                  {storyError}
                </div>
              )}

              <button
                type="button"
                onClick={generateStory}
                disabled={!selectedImage || generatingStory}
                className="w-full py-4 rounded-xl bg-[#7f3f2b] text-white font-semibold hover:bg-[#693321] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Generate My Story
              </button>

              <p className="text-xs text-[#96796c] text-center mt-3">
                Your photo is processed securely by the MahaVista backend.
              </p>
            </>
          )}

          {generatingStory && (
            <div className="text-center py-12">
              <div className="relative w-20 h-20 mx-auto mb-5">
                <Loader2 className="w-16 h-16 text-[#7f3f2b] animate-spin absolute inset-0 m-auto" />
              </div>
              <h3 className="text-xl font-semibold text-[#2d1a14] mb-2">
                Creating Your Story...
              </h3>
              <p className="text-[#72574c] max-w-md mx-auto">
                Gemini is creating your personalized Maharashtra adventure.
                This may take a little while.
              </p>
              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-[#a45a24]">
                <Sparkles className="w-4 h-4" />
                <span>Generating your cinematic experience</span>
              </div>
            </div>
          )}

          {storyVideoUrl && !generatingStory && (
            <div>
              <div className="bg-black rounded-xl overflow-hidden mb-5">
                <video
                  key={storyVideoUrl}
                  src={storyVideoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-auto max-h-[500px] object-contain"
                  poster={imagePreview || undefined}
                >
                  Your browser does not support the video player.
                </video>
              </div>

              {storyTitle && (
                <h3 className="text-xl font-bold text-[#2d1a14] mb-2">
                  {storyTitle}
                </h3>
              )}

              {storyText && (
                <div className="bg-[#f8eadf]/80 backdrop-blur-sm rounded-xl p-4 mb-5 max-h-40 overflow-y-auto">
                  <p className="text-sm text-[#4e3830] leading-relaxed">
                    {storyText}
                  </p>
                </div>
              )}

              <div className="mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fff4df] text-[#965034] text-xs font-semibold">
                  {storyThemes.find((theme) => theme.value === storyTheme)
                    ?.label || "Heritage"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={resetStory}
                  className="flex-1 py-3 rounded-xl border border-[#dcc8bd] text-[#65453a] hover:bg-[#fffaf7] transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Create Another
                </button>

                <button
                  type="button"
                  onClick={downloadStory}
                  className="flex-1 py-3 rounded-xl bg-[#7f3f2b] text-white hover:bg-[#693321] transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Story
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative"
        style={pageBackground}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

        <div className="relative z-10 text-center bg-white/60 backdrop-blur-xl rounded-3xl px-10 py-8 shadow-2xl border border-white/40">
          <div className="w-14 h-14 rounded-full border-4 border-[#e7b39f] border-t-[#a84f32] animate-spin mx-auto mb-5" />
          <p className="text-[#3d2415] font-semibold">
            Finding a Maharashtra mystery...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================
  if (error && !mystery) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 relative"
        style={pageBackground}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

        <div className="relative z-10 text-center bg-white/70 backdrop-blur-xl rounded-3xl px-10 py-10 shadow-2xl border border-white/40 max-w-md">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-[#3d2415] font-medium mb-5">{error}</p>
          <button
            onClick={fetchMystery}
            className="px-5 py-3 rounded-xl bg-[#7f3f2b] text-white hover:bg-[#693321] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // CORRECT ANSWER
  // ==========================================================
  if (result?.correct) {
    return (
      <>
        <StoryModal />

        <div
          className="min-h-screen px-5 py-10 relative"
          style={pageBackground}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto">
            {/* SUCCESS HEADER — frosted glass */}
            <div className="text-center mb-10 bg-white/60 backdrop-blur-xl rounded-3xl px-6 py-8 shadow-2xl border border-white/40">
              <div className="w-20 h-20 rounded-full bg-[#f5dfb8]/90 flex items-center justify-center mx-auto mb-5">
                <Trophy className="w-10 h-10 text-[#a45a24]" />
              </div>

              <p className="text-sm uppercase tracking-[0.25em] text-[#a45a24] font-semibold mb-3">
                Mystery Solved
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-[#2d1a14] mb-4">
                🎉 You got it!
              </h1>

              <p className="text-[#5a3b31] max-w-xl mx-auto">
                You discovered something special from Maharashtra.
              </p>
            </div>

            {/* ANSWER CARD — frosted, but inner content kept readable */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(75,45,35,0.2)] mb-8">
              {result.image_url && (
                <img
                  src={result.image_url}
                  alt={result.answer}
                  className="w-full h-64 object-cover"
                />
              )}

              <div className="p-7 bg-white/40">
                <div className="flex items-center gap-2 text-sm text-[#a45a24] font-semibold mb-3">
                  <MapPin className="w-4 h-4" />
                  {result.category}
                </div>

                <h2 className="text-3xl font-bold text-[#2d1a14] mb-3">
                  {result.answer}
                </h2>

                <p className="text-[#5a3b31]">{result.reward?.message}</p>

                <div className="mt-6 flex items-center gap-5 flex-wrap">
                  <div className="px-4 py-3 rounded-2xl bg-[#fff4df]/90">
                    <div className="text-xl">
                      {"⭐".repeat(result.reward?.stars || 0)}
                    </div>
                    <p className="text-xs text-[#80644f] mt-1">
                      Mystery Reward
                    </p>
                  </div>

                  <div className="px-4 py-3 rounded-2xl bg-[#edf6e9]/90">
                    <p className="text-lg font-bold text-[#4e7038]">
                      +{result.reward?.xp || 0} XP
                    </p>
                    <p className="text-xs text-[#637056]">Explorer XP</p>
                  </div>
                </div>
              </div>
            </div>

            {/* REWARD OPTIONS — frosted header, action cards glassy */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/40">
              <h2 className="text-2xl font-bold text-[#2d1a14] text-center mb-2">
                What would you like to do?
              </h2>

              <p className="text-center text-[#5a3b31] mb-7">
                Continue exploring your discovery.
              </p>

              <div className="grid md:grid-cols-2 gap-5">
                <button
                  onClick={handleDiscoverMore}
                  className="text-left bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 hover:border-[#c9957d] hover:bg-white/85 hover:shadow-lg transition-all group w-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f8eadf] flex items-center justify-center mb-5">
                    <BookOpen className="w-6 h-6 text-[#965034]" />
                  </div>

                  <h3 className="text-xl font-bold text-[#2d1a14] mb-2">
                    Discover More
                  </h3>

                  <p className="text-sm text-[#5a3b31] mb-5">
                    Learn about the history, culture and significance behind
                    your discovery.
                  </p>

                  <span className="flex items-center gap-2 text-[#965034] font-semibold">
                    View Information
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <button
                  onClick={() => setShowStoryModal(true)}
                  className="text-left bg-[#3e241a]/85 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white hover:bg-[#3e241a]/95 hover:shadow-xl transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                    <Play className="w-6 h-6 text-[#ffd59b]" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">Become the Story</h3>

                  <p className="text-sm text-white/80 mb-5">
                    Turn yourself into an animated Maharashtra story.
                  </p>

                  <span className="flex items-center gap-2 text-[#ffd59b] font-semibold">
                    Create My Story
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>

            {/* NEW MYSTERY */}
            <div className="text-center mt-10">
              <button
                onClick={fetchMystery}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/70 backdrop-blur-xl border border-white/40 text-[#3d2415] hover:bg-white/90 transition shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                Try Another Mystery
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ==========================================================
  // MAIN MYSTERY
  // ==========================================================
  return (
    <div
      className="min-h-screen px-5 py-10 relative"
      style={pageBackground}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* HEADER — frosted glass */}
        <div className="text-center mb-10 bg-white/60 backdrop-blur-xl rounded-3xl px-6 py-8 shadow-2xl border border-white/40">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f8eadf]/90 text-[#965034] text-sm font-semibold mb-5">
            <Sparkles className="w-4 h-4" />
            Maharashtra Mystery
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#2d1a14] mb-4">
            Can You Discover
            <br />
            Maharashtra's Secret?
          </h1>

          <p className="text-[#5a3b31] max-w-xl mx-auto">
            Solve the riddle, unlock the clues and discover something
            fascinating from Maharashtra.
          </p>
        </div>

        {/* MYSTERY CARD — translucent, inner content readable */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_12px_40px_rgba(75,45,35,0.2)] overflow-hidden">
          {/* TOP */}
          <div className="px-6 md:px-9 py-5 border-b border-white/40 flex items-center justify-between bg-white/30">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#5a3b31]">
                Mystery
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f7eee8]/80 text-[#965034] text-xs font-semibold">
                {mystery.category}
              </span>
            </div>

            <span className="text-xs font-medium text-[#5a3b31]">
              {mystery.difficulty}
            </span>
          </div>

          {/* RIDDLE */}
          <div className="p-7 md:p-10">
            <div className="flex gap-4 mb-7">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#f5dfb8]/90 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#9b5a25]" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#a45a24] font-bold mb-2">
                  Your Riddle
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#2d1a14]">
                  {mystery.title}
                </h2>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl p-6 md:p-8">
              <p className="text-lg md:text-xl leading-8 text-[#3d2415] italic">
                "{mystery.riddle}"
              </p>
            </div>

            {/* CLUES */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-[#2d1a14]">Need a clue?</h3>
                  <p className="text-sm text-[#5a3b31]">
                    You have {3 - revealedClues.length} clues remaining.
                  </p>
                </div>

                <div className="flex gap-1">
                  {[1, 2, 3].map((number) => (
                    <div
                      key={number}
                      className={`w-2.5 h-2.5 rounded-full ${
                        number <= revealedClues.length
                          ? "bg-[#a45a24]"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {revealedClues.length > 0 && (
                <div className="space-y-3 mb-4">
                  {revealedClues.map((clue, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-4 rounded-xl bg-[#fff7e8]/85 backdrop-blur-md border border-[#efdfbf]"
                    >
                      <Lightbulb className="w-5 h-5 text-[#ad742b] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-[#9a6928] mb-1">
                          CLUE {index + 1}
                        </p>
                        <p className="text-sm text-[#3d2415]">{clue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {revealedClues.length < 3 && (
                <button
                  onClick={revealClue}
                  className="flex items-center gap-2 text-sm font-semibold text-[#965034] hover:text-[#74351f] transition"
                >
                  <LockKeyhole className="w-4 h-4" />
                  Reveal Clue {revealedClues.length + 1}
                </button>
              )}
            </div>

            {/* ANSWER */}
            <form onSubmit={submitAnswer} className="mt-9">
              <label className="block text-sm font-bold text-[#2d1a14] mb-2">
                Your Answer
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="What do you think it is?"
                  className="flex-1 px-5 py-4 rounded-xl border border-white/60 bg-white/80 backdrop-blur-md text-[#2d1a14] placeholder-[#8b6657] outline-none focus:border-[#a45a24] focus:bg-white/95 focus:ring-2 focus:ring-[#a45a24]/20"
                />

                <button
                  type="submit"
                  disabled={checking || !answer.trim()}
                  className="px-6 py-4 rounded-xl bg-[#7f3f2b] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#693321] transition shadow-lg"
                >
                  {checking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      Solve Mystery
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* WRONG ANSWER */}
            {result && !result.correct && (
              <div className="mt-5 flex items-center gap-3 p-4 rounded-xl bg-[#fff1ef]/90 backdrop-blur-md border border-[#f0cbc5]">
                <XCircle className="w-5 h-5 text-[#c25445]" />
                <p className="text-sm text-[#7c4038]">{result.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


