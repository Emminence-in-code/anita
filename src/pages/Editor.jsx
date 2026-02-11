import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Send, Image as ImageIcon, Video, X } from "lucide-react";
import Navigation from "../components/Navigation";
import "../styles/app.css";
import {
  createPost,
  updatePost,
  getPostById,
  uploadFile,
  deleteFile,
} from "../lib/supabase";

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "poem",
    status: "draft",
    tags: [],
    featured_image: "",
    media_urls: [],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const post = await getPostById(id);
      setFormData(post);
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setUploading(true);
      const bucket = "post-media";

      const uploadedFiles = await Promise.all(
        files.map((file) => uploadFile(bucket, file)),
      );

      const newUrls = uploadedFiles.map((f) => f.publicUrl);

      setFormData((prev) => ({
        ...prev,
        media_urls: [...prev.media_urls, ...newUrls],
      }));
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveMedia = (urlToRemove) => {
    setFormData((prev) => ({
      ...prev,
      media_urls: prev.media_urls.filter((url) => url !== urlToRemove),
    }));
  };

  const handleSave = async (publishStatus) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    try {
      setLoading(true);
      const postData = {
        ...formData,
        status: publishStatus,
      };

      if (id) {
        await updatePost(id, postData);
      } else {
        await createPost(postData);
      }

      navigate("/app/feed");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="main-app">
        <Navigation />
        <main className="app-content">
          <div className="app-spinner-container">
            <div className="app-spinner"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="main-app">
      <Navigation />

      <main className="app-content">
        <header className="app-header">
          <h1 className="app-title">
            {id ? "Edit Your Writing" : "New Creation"}
          </h1>
          <p className="app-subtitle">
            Express yourself freely. Your words matter.
          </p>
        </header>

        <div style={{ maxWidth: "900px" }}>
          {/* Title Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label className="app-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your creation a title..."
              className="app-input"
              style={{ fontSize: "1.3rem", fontWeight: "600" }}
            />
          </div>

          {/* Type Selection */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label className="app-label">Type</label>
            <div style={{ display: "flex", gap: "1rem" }}>
              {["poem", "journal", "idea"].map((type) => (
                <label
                  key={type}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={handleChange}
                    style={{ accentColor: "#b76e79" }}
                  />
                  <span
                    style={{
                      color: formData.type === type ? "#e8b4b8" : "#909090",
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Content Textarea */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label className="app-label">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Let your thoughts flow..."
              className="app-textarea"
              style={{
                minHeight: "400px",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            />
          </div>

          {/* Tags */}
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

          {/* Media Upload */}
          <div style={{ marginBottom: "2rem" }}>
            <label className="app-label">Media</label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <label
                className="app-button-secondary"
                style={{ cursor: "pointer" }}
              >
                <ImageIcon size={18} />
                <span>Add Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </label>
              <label
                className="app-button-secondary"
                style={{ cursor: "pointer" }}
              >
                <Video size={18} />
                <span>Add Videos</span>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {uploading && (
              <p style={{ color: "#e8b4b8", marginTop: "1rem" }}>
                Uploading...
              </p>
            )}

            {formData.media_urls.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                {formData.media_urls.map((url, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={url}
                      alt={`Media ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                    <button
                      onClick={() => handleRemoveMedia(url)}
                      style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        background: "rgba(0,0,0,0.7)",
                        border: "none",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "white",
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => handleSave("draft")}
              disabled={loading}
              className="app-button-secondary"
            >
              <Save size={20} />
              <span>Save Draft</span>
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={loading}
              className="app-button"
            >
              <Send size={20} />
              <span>Publish</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Editor;
