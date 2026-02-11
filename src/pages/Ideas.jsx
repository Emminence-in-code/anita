import { useState, useEffect } from "react";
import { Plus, Pin, Archive, Trash2, Edit2, X } from "lucide-react";
import Navigation from "../components/Navigation";
import "../styles/app.css";
import {
  getIdeas,
  createIdea,
  updateIdea,
  deleteIdea,
  toggleIdeaPin,
  toggleIdeaArchive,
} from "../lib/supabase";

const IDEA_COLORS = [
  "#b76e79",
  "#ff6090",
  "#ffd700",
  "#6b8cae",
  "#8b7aa8",
  "#90a955",
];

function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    color: IDEA_COLORS[0],
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    loadIdeas();
  }, [showArchived]);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      const data = await getIdeas({ showArchived });
      setIdeas(data);
    } catch (error) {
      console.error("Error loading ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert("Please add a title");
      return;
    }

    try {
      if (editingId) {
        await updateIdea(editingId, formData);
      } else {
        await createIdea(formData);
      }

      await loadIdeas();
      handleCancel();
    } catch (error) {
      console.error("Error saving idea:", error);
      alert("Failed to save idea");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this idea?")) return;

    try {
      await deleteIdea(id);
      setIdeas((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Error deleting idea:", error);
    }
  };

  const handleEdit = (idea) => {
    setEditingId(idea.id);
    setFormData({
      title: idea.title,
      content: idea.content || "",
      color: idea.color,
      tags: idea.tags || [],
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      title: "",
      content: "",
      color: IDEA_COLORS[0],
      tags: [],
    });
    setTagInput("");
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTogglePin = async (idea) => {
    try {
      await toggleIdeaPin(idea.id, idea.is_pinned);
      setIdeas((prev) =>
        prev.map((i) =>
          i.id === idea.id ? { ...i, is_pinned: !i.is_pinned } : i,
        ),
      );
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const handleToggleArchive = async (idea) => {
    try {
      await toggleIdeaArchive(idea.id, idea.is_archived);
      await loadIdeas();
    } catch (error) {
      console.error("Error toggling archive:", error);
    }
  };

  return (
    <div className="main-app">
      <Navigation />

      <main className="app-content">
        <header className="app-header">
          <h1 className="app-title">Ideas Notebook</h1>
          <p className="app-subtitle">Capture your brilliant thoughts</p>
        </header>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <button onClick={() => setIsCreating(true)} className="app-button">
            <Plus size={20} />
            <span>New Idea</span>
          </button>

          <button
            onClick={() => setShowArchived(!showArchived)}
            className="app-button-secondary"
          >
            <Archive size={20} />
            <span>{showArchived ? "Hide Archived" : "Show Archived"}</span>
          </button>
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <div
            style={{
              background: "linear-gradient(135deg, #0a0a0a, #2a2a2a)",
              padding: "2rem",
              borderRadius: "20px",
              border: "2px solid rgba(183, 110, 121, 0.3)",
              marginBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#e8b4b8", marginBottom: "1.5rem" }}>
              {editingId ? "Edit Idea" : "New Idea"}
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Title..."
                className="app-input"
                style={{ fontSize: "1.2rem", fontWeight: "600" }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Describe your idea..."
                className="app-textarea"
                style={{ minHeight: "120px" }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="app-label">Color</label>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                {IDEA_COLORS.map((color) => (
                  <div
                    key={color}
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                    style={{
                      background: color,
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      border:
                        formData.color === color
                          ? "3px solid white"
                          : "3px solid transparent",
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label className="app-label">Tags</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags (press Enter)"
                className="app-input"
              />
              {formData.tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "rgba(183, 110, 121, 0.2)",
                        color: "#e8b4b8",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {tag}
                      <X
                        size={16}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={handleSave} className="app-button">
                {editingId ? "Update" : "Create"}
              </button>
              <button onClick={handleCancel} className="app-button-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Ideas Grid */}
        {loading ? (
          <div className="app-spinner-container">
            <div className="app-spinner"></div>
          </div>
        ) : ideas.length === 0 ? (
          <div className="app-empty-state">
            <Plus className="app-empty-state-icon" />
            <h3 className="app-empty-state-title">No ideas yet</h3>
            <p className="app-empty-state-text">
              Start capturing your brilliant thoughts
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {ideas.map((idea) => (
              <div
                key={idea.id}
                style={{
                  background: "linear-gradient(135deg, #0a0a0a, #2a2a2a)",
                  borderRadius: "16px",
                  border: `2px solid ${idea.color}40`,
                  borderLeft: `4px solid ${idea.color}`,
                  padding: "1.5rem",
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = `0 15px 40px ${idea.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {idea.is_pinned && (
                  <Pin
                    size={18}
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      color: idea.color,
                    }}
                  />
                )}

                <h3
                  style={{
                    color: "#fff",
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    marginBottom: "0.8rem",
                  }}
                >
                  {idea.title}
                </h3>

                {idea.content && (
                  <p
                    style={{
                      color: "#e8b4b8",
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      marginBottom: "1rem",
                    }}
                  >
                    {idea.content}
                  </p>
                )}

                {idea.tags && idea.tags.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {idea.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: `${idea.color}30`,
                          color: "#e8b4b8",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
                >
                  <button
                    onClick={() => handleEdit(idea)}
                    style={{
                      background: "rgba(183, 110, 121, 0.2)",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.5rem",
                      cursor: "pointer",
                      color: "#e8b4b8",
                    }}
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleTogglePin(idea)}
                    style={{
                      background: idea.is_pinned
                        ? `${idea.color}40`
                        : "transparent",
                      border: `1px solid ${idea.color}60`,
                      borderRadius: "8px",
                      padding: "0.5rem",
                      cursor: "pointer",
                      color: idea.color,
                    }}
                  >
                    <Pin size={16} />
                  </button>

                  <button
                    onClick={() => handleToggleArchive(idea)}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(183, 110, 121, 0.3)",
                      borderRadius: "8px",
                      padding: "0.5rem",
                      cursor: "pointer",
                      color: "#e8b4b8",
                    }}
                  >
                    <Archive size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(idea.id)}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255, 96, 144, 0.3)",
                      borderRadius: "8px",
                      padding: "0.5rem",
                      cursor: "pointer",
                      color: "#ff6090",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Ideas;
