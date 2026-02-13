import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Smile,
  Frown,
  Meh,
  Heart,
  TrendingUp,
} from "lucide-react";
import Navigation from "../components/Navigation";
import "../styles/app.css";
import { getMoods, upsertMood, getMoodByDate } from "../lib/supabase";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

const MOOD_OPTIONS = [
  { type: "amazing", label: "Amazing", emoji: "😄", color: "#ff6090" },
  { type: "happy", label: "Happy", emoji: "😊", color: "#ffb3c1" },
  { type: "calm", label: "Calm", emoji: "😌", color: "#b76e79" },
  { type: "meh", label: "Meh", emoji: "😐", color: "#909090" },
  { type: "sad", label: "Sad", emoji: "😢", color: "#6b8cae" },
  { type: "anxious", label: "Anxious", emoji: "😰", color: "#8b7aa8" },
];

function MoodTracker() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadMoods();
  }, [currentMonth]);

  useEffect(() => {
    if (selectedDate) {
      loadMoodForDate(selectedDate);
    }
  }, [selectedDate]);

  const loadMoods = async () => {
    try {
      setLoading(true);
      const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
      const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");
      const data = await getMoods(start, end);
      setMoods(data);
    } catch (error) {
      console.error("Error loading moods:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoodForDate = async (date) => {
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const mood = await getMoodByDate(dateStr);

      if (mood) {
        const moodOption = MOOD_OPTIONS.find((m) => m.type === mood.mood_type);
        setSelectedMood(moodOption);
        setIntensity(mood.mood_intensity);
        setNote(mood.note || "");
      } else {
        setSelectedMood(null);
        setIntensity(3);
        setNote("");
      }
    } catch (error) {
      console.error("Error loading mood for date:", error);
    }
  };

  const handleSaveMood = async () => {
    if (!selectedMood) {
      alert("Please select a mood");
      return;
    }

    try {
      const moodData = {
        mood_date: format(selectedDate, "yyyy-MM-dd"),
        mood_type: selectedMood.type,
        mood_intensity: intensity,
        note: note.trim(),
        color: selectedMood.color,
      };

      await upsertMood(moodData);
      await loadMoods();
      alert("Mood saved!");
    } catch (error) {
      console.error("Error saving mood:", error);
      alert("Failed to save mood");
    }
  };

  const getMoodForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return moods.find((m) => m.mood_date === dateStr);
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  return (
    <div className="main-app">
      <Navigation />

      <main className="app-content">
        <header className="app-header">
          <h1 className="app-title">Mood Tracker</h1>
          <p className="app-subtitle">How are you feeling today?</p>
        </header>

        <div className="mood-tracker-grid">
          {/* Calendar */}
          <div>
            <div
              style={{
                marginBottom: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                    ),
                  )
                }
                className="app-button-secondary"
                style={{ padding: "0.7rem 1.5rem" }}
              >
                ← Prev
              </button>
              <h2
                style={{
                  color: "#e8b4b8",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                    ),
                  )
                }
                className="app-button-secondary"
                style={{ padding: "0.7rem 1.5rem" }}
              >
                Next →
              </button>
            </div>

            <div className="calendar-grid">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  style={{
                    textAlign: "center",
                    color: "#b76e79",
                    fontWeight: "600",
                    padding: "0.5rem",
                  }}
                >
                  {day}
                </div>
              ))}

              {daysInMonth.map((date) => {
                const mood = getMoodForDate(date);
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());

                return (
                  <div
                    key={date.toString()}
                    onClick={() => setSelectedDate(date)}
                    style={{
                      background: mood ? mood.color : "rgba(255,255,255,0.05)",
                      borderRadius: "12px",
                      padding: "1rem",
                      cursor: "pointer",
                      textAlign: "center",
                      border: isSelected
                        ? "2px solid #b76e79"
                        : isToday
                          ? "2px solid rgba(183, 110, 121, 0.5)"
                          : "2px solid transparent",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: mood ? "white" : "#e8b4b8",
                        fontWeight: "600",
                      }}
                    >
                      {format(date, "d")}
                    </div>
                    {mood && (
                      <div style={{ fontSize: "1.5rem", marginTop: "0.3rem" }}>
                        {
                          MOOD_OPTIONS.find((m) => m.type === mood.mood_type)
                            ?.emoji
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mood Entry Form */}
          <div
            style={{
              background: "linear-gradient(135deg, #0a0a0a, #2a2a2a)",
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid rgba(183, 110, 121, 0.2)",
              height: "fit-content",
            }}
          >
            <h3
              style={{
                color: "#e8b4b8",
                marginBottom: "1.5rem",
                fontSize: "1.3rem",
              }}
            >
              {format(selectedDate, "MMMM d, yyyy")}
            </h3>

            <div style={{ marginBottom: "2rem" }}>
              <label className="app-label">How are you feeling?</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.8rem",
                }}
              >
                {MOOD_OPTIONS.map((mood) => (
                  <div
                    key={mood.type}
                    onClick={() => setSelectedMood(mood)}
                    style={{
                      background:
                        selectedMood?.type === mood.type
                          ? `${mood.color}40`
                          : "rgba(255,255,255,0.05)",
                      border: `2px solid ${selectedMood?.type === mood.type ? mood.color : "transparent"}`,
                      borderRadius: "12px",
                      padding: "1rem",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                      {mood.emoji}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#e8b4b8" }}>
                      {mood.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label className="app-label">Intensity ({intensity}/5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: selectedMood?.color || "#b76e79",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0.5rem",
                  color: "#909090",
                  fontSize: "0.8rem",
                }}
              >
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label className="app-label">Note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="How was your day?"
                className="app-textarea"
                style={{ minHeight: "100px" }}
              />
            </div>

            <button
              onClick={handleSaveMood}
              className="app-button"
              style={{ width: "100%" }}
            >
              Save Mood
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MoodTracker;
