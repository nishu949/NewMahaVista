import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Sparkles, CheckCircle, XCircle, Zap, Home, RotateCcw } from "lucide-react";

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes confetti {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
  }

  .quiz-card {
    animation: fadeIn 0.6s ease-out;
    background: rgba(255, 248, 240, 0.95);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(215, 179, 132, 0.25);
    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5);
  }

  .option-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid #d7b384;
    background: rgba(255, 248, 240, 0.8);
    backdrop-filter: blur(4px);
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .option-btn:hover:not(.disabled) {
    transform: translateX(8px) scale(1.02);
    box-shadow: 0 8px 30px rgba(107, 63, 29, 0.2);
    border-color: #8b5e34;
    background: rgba(255, 248, 240, 1);
  }

  .option-btn.disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }

  .option-btn .option-letter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #d7b384;
    color: #3a2416;
    font-weight: 700;
    font-size: 15px;
    margin-right: 14px;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .option-btn:hover:not(.disabled) .option-letter {
    background: #8b5e34;
    color: white;
    transform: rotate(-8deg) scale(1.05);
  }

  .option-correct {
    border-color: #15803d !important;
    background: linear-gradient(135deg, #dcfce7, #bbf7d0) !important;
    transform: scale(1.02);
    box-shadow: 0 8px 30px rgba(21, 128, 61, 0.3);
    animation: slideIn 0.3s ease-out;
  }

  .option-correct .option-letter {
    background: #15803d !important;
    color: white !important;
  }

  .option-wrong {
    border-color: #dc2626 !important;
    background: linear-gradient(135deg, #fee2e2, #fecaca) !important;
    box-shadow: 0 8px 30px rgba(220, 38, 38, 0.25);
    animation: slideIn 0.3s ease-out;
  }

  .option-wrong .option-letter {
    background: #dc2626 !important;
    color: white !important;
  }

  .next-btn {
    background: linear-gradient(135deg, #8b5e34, #6b3f1d);
    color: white;
    border: none;
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .next-btn:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 15px 40px rgba(107, 63, 29, 0.4);
  }

  .next-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .next-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -200%;
    width: 200%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.6s ease;
  }

  .next-btn:hover:not(:disabled)::before {
    left: 200%;
  }

  .score-badge {
    background: linear-gradient(135deg, #f5e6cc, #e8d2aa);
    border: 2px solid #d7b384;
    box-shadow: 0 8px 25px rgba(107, 63, 29, 0.15);
  }

  .progress-bar {
    height: 6px;
    background: rgba(215, 179, 132, 0.25);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 24px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #d7b384, #8b5e34);
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 3px;
  }

  .result-emoji {
    font-size: 80px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .category-tag {
    background: rgba(215, 179, 132, 0.2);
    color: #6b3f1d;
    padding: 4px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
  }

  .result-container {
    background: rgba(255, 248, 240, 0.95);
    backdrop-filter: blur(16px);
    border: 2px solid rgba(215, 179, 132, 0.3);
    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.4);
    animation: fadeIn 0.6s ease-out;
  }

  .result-card {
    background: linear-gradient(135deg, rgba(255,248,240,0.95), rgba(245,230,204,0.95));
    border: 2px solid rgba(215, 179, 132, 0.3);
  }
`;

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSubtopic = location.state?.subtopic || "";

  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!selectedSubtopic) {
      setError("No subtopic selected.");
      setLoading(false);
      return;
    }

    fetch(
      `http://127.0.0.1:8000/questions?category=${encodeURIComponent(
        selectedSubtopic
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((result) => {
        setData(result);
        if (result.length > 0) {
          setQuestion(result[0]);
        }
      })
      .catch(() => setError("Failed to load questions"))
      .finally(() => setLoading(false));
  }, [selectedSubtopic]);

  const getOptions = (q) => {
    if (!q) return [];
    if (q.option1) {
      return [q.option1, q.option2, q.option3, q.option4];
    }
    if (q.option_a) {
      return [q.option_a, q.option_b, q.option_c, q.option_d];
    }
    return [];
  };

  const getCorrectAnswer = (q) => {
    if (!q) return 1;
    if (q.ans) return q.ans;
    if (q.correct_answer) return q.correct_answer;
    return 1;
  };

  const options = question ? getOptions(question) : [];
  const correctAnswer = question ? getCorrectAnswer(question) : 1;

  const checkAns = (ans) => {
    if (lock) return;

    setSelectedIndex(ans);
    setLock(true);

    if (correctAnswer === ans) {
      setScore(score + 1);
    }
  };

  const next = () => {
    if (!lock) return;

    if (index === data.length - 1) {
      setShowResults(true);
      return;
    }

    const newIndex = index + 1;
    setIndex(newIndex);
    setQuestion(data[newIndex]);
    setLock(false);
    setSelectedIndex(null);
  };

  const restartQuiz = () => {
    setIndex(0);
    setQuestion(data[0]);
    setLock(false);
    setScore(0);
    setSelectedIndex(null);
    setShowResults(false);
  };

  const goHome = () => {
    navigate("/");
  };

  const getOptionClass = (optionNumber) => {
    if (!lock) return "";
    if (correctAnswer === optionNumber) return "option-correct";
    if (selectedIndex === optionNumber) return "option-wrong";
    return "";
  };

  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index);
  };

  const progress = data.length > 0 ? ((index + 1) / data.length) * 100 : 0;

  const getEmoji = () => {
    if (data.length === 0) return "🤔";
    const percentage = (score / data.length) * 100;
    if (percentage === 100) return "🏆";
    if (percentage >= 80) return "🌟";
    if (percentage >= 60) return "💪";
    if (percentage >= 40) return "📚";
    return "🤔";
  };

  const getResultMessage = () => {
    if (data.length === 0) return "";
    const percentage = (score / data.length) * 100;
    if (percentage === 100) return "Perfect! You're a Maharashtra Expert! 🎉";
    if (percentage >= 80) return "Excellent! You know Maharashtra well! 🌟";
    if (percentage >= 60) return "Good job! Keep learning about Maharashtra! 💪";
    if (percentage >= 40) return "Nice try! Explore more about Maharashtra! 📚";
    return "Keep exploring Maharashtra's rich heritage! 🤔";
  };

  const getScoreColor = () => {
    if (data.length === 0) return "text-[#6b3f1d]";
    const percentage = (score / data.length) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  // Show Results Page
  if (showResults) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(135deg, #6b3f1d 0%, #a47148 50%, #d4a373 100%)",
        }}
      >
        <style>{styles}</style>

        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goHome}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 border border-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-medium">Quiz Complete</span>
            </div>
          </div>

          {/* Results Card */}
          <div className="result-container rounded-3xl p-8 md:p-12 text-center">
            <div className="flex flex-col items-center">
              <span className="result-emoji">{getEmoji()}</span>
              
              <h2 className="text-3xl font-bold text-[#3a2416] mt-4">
                Quiz Complete! 🎉
              </h2>
              
              <p className="text-[#6f5743] mt-2">
                You've completed the {selectedSubtopic} quiz
              </p>

              {/* Score Display */}
              <div className="mt-8 flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-[#6f5743]">Correct</p>
                  <p className={`text-4xl font-bold ${getScoreColor()}`}>
                    {score}
                  </p>
                </div>
                <div className="w-px h-16 bg-[#d7b384]/30" />
                <div className="text-center">
                  <p className="text-sm font-medium text-[#6f5743]">Total</p>
                  <p className="text-4xl font-bold text-[#3a2416]">
                    {data.length}
                  </p>
                </div>
              </div>

              {/* Percentage Circle */}
              <div className="mt-6 relative">
                <div className="w-32 h-32 rounded-full border-8 border-[#d7b384]/20 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#3a2416]">
                      {Math.round((score / data.length) * 100)}%
                    </p>
                    <p className="text-xs text-[#6f5743]">Score</p>
                  </div>
                </div>
              </div>

              {/* Result Message */}
              <p className="mt-6 text-lg font-medium text-[#3a2416]">
                {getResultMessage()}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={restartQuiz}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#8b5e34] text-white font-semibold hover:bg-[#6b3f1d] transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={goHome}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 transition-all duration-300 border border-white/10"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
              </div>

              {/* Stats */}
              <div className="mt-6 flex items-center gap-6 text-sm text-[#6f5743]">
                <span className="flex items-center gap-1">
                  <span>✅</span> {score} correct
                </span>
                <span className="flex items-center gap-1">
                  <span>❌</span> {data.length - score} incorrect
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Quiz Page
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #6b3f1d 0%, #a47148 50%, #d4a373 100%)",
      }}
    >
      <style>{styles}</style>

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-medium">Maharashtra Quiz</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="quiz-card rounded-3xl p-8 md:p-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-[#d7b384] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-6 text-lg font-medium text-[#3a2416]">Loading questions...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">😔</div>
              <h2 className="text-2xl font-bold text-[#7f1d1d]">{error}</h2>
              <button
                onClick={() => navigate(-1)}
                className="mt-6 px-6 py-3 rounded-full bg-[#6b3f1d] text-white font-medium hover:bg-[#8b5e34] transition"
              >
                Go Back
              </button>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-[#3a2416]">No questions found</h2>
              <p className="mt-2 text-[#6f5743]">No questions available for "{selectedSubtopic}"</p>
              <button
                onClick={() => navigate(-1)}
                className="mt-6 px-6 py-3 rounded-full bg-[#6b3f1d] text-white font-medium hover:bg-[#8b5e34] transition"
              >
                Go Back
              </button>
            </div>
          ) : (
            <>
              {/* Quiz Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                  <span className="category-tag">{selectedSubtopic}</span>
                  <h2 className="mt-3 text-xl font-medium text-[#3a2416]">
                    Question <span className="font-bold">{index + 1}</span> of{" "}
                    <span className="font-bold">{data.length}</span>
                  </h2>
                </div>

                <div className="score-badge flex items-center gap-3 px-6 py-3 rounded-full">
                  <Trophy className="w-5 h-5 text-[#6b3f1d]" />
                  <span className="font-bold text-[#3a2416]">
                    Score: <span className="text-[#8b5e34]">{score}</span>
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>

              {/* Question */}
              <div className="mt-8">
                <h3 className="text-2xl md:text-3xl font-bold text-[#3a2416] leading-tight">
                  {question.question}
                </h3>
              </div>

              {/* Options */}
              <div className="mt-8 space-y-4">
                {options.map((opt, idx) => {
                  const optionNumber = idx + 1;
                  const isCorrect = lock && correctAnswer === optionNumber;
                  const isWrong =
                    lock &&
                    selectedIndex === optionNumber &&
                    correctAnswer !== optionNumber;
                  const isDisabled = lock;

                  return (
                    <button
                      key={idx}
                      onClick={() => checkAns(optionNumber)}
                      className={`option-btn ${isDisabled ? 'disabled' : ''} w-full rounded-xl p-4 text-left text-base md:text-lg flex items-center transition-all duration-300 ${getOptionClass(
                        optionNumber
                      )}`}
                      style={{
                        color: isCorrect ? "#14532d" : isWrong ? "#7f1d1d" : "#3a2416",
                      }}
                    >
                      <span className="option-letter">{getOptionLetter(idx)}</span>
                      <span className="flex-1">{opt}</span>
                      {lock && isCorrect && (
                        <CheckCircle className="w-6 h-6 text-green-600 ml-2 flex-shrink-0" />
                      )}
                      {lock && isWrong && (
                        <XCircle className="w-6 h-6 text-red-600 ml-2 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              {lock && (
                <div className="mt-8">
                  <button
                    onClick={next}
                    className="next-btn w-full rounded-xl p-4 text-lg font-bold flex items-center justify-center gap-3"
                  >
                    {index === data.length - 1 ? (
                      <>
                        <span>🏁</span>
                        See Results
                      </>
                    ) : (
                      <>
                        Next Question
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Footer Stats */}
              {!lock && (
                <div className="mt-8 flex items-center justify-between text-sm text-[#6f5743]">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Select an option to continue
                  </span>
                  <span className="flex items-center gap-2">
                    <span>📝</span>
                    {data.length - (index + 1)} questions remaining
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}