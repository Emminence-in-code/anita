import { useState, useEffect } from "react";
import { Upload, Heart, Trash2, X } from "lucide-react";
import Navigation from "../components/Navigation";
import "../styles/app.css";
import {
  getPhotos,
  createPhoto,
  updatePhoto,
  deletePhoto,
  uploadFile,
} from "../lib/supabase";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const data = await getPhotos();
      setPhotos(data);
    } catch (error) {
      console.error("Error loading photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setUploading(true);

      for (const file of files) {
        const { publicUrl } = await uploadFile("photos", file);
        await createPhoto({
          image_url: publicUrl,
          caption: "",
          album: "default",
        });
      }

      await loadPhotos();
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Failed to upload photos");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this photo?")) return;

    try {
      await deletePhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const handleToggleFavorite = async (photo) => {
    try {
      await updatePhoto(photo.id, { is_favorite: !photo.is_favorite });
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id ? { ...p, is_favorite: !p.is_favorite } : p,
        ),
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleUpdateCaption = async (photo) => {
    try {
      await updatePhoto(photo.id, { caption });
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, caption } : p)),
      );
      setEditMode(null);
      setCaption("");
    } catch (error) {
      console.error("Error updating caption:", error);
    }
  };

  return (
    <div className="main-app">
      <Navigation />

      <main className="app-content">
        <header className="app-header">
          <h1 className="app-title">Your Gallery</h1>
          <p className="app-subtitle">Captured moments, preserved forever</p>
        </header>

        <div style={{ marginBottom: "2rem" }}>
          <label className="app-button" style={{ cursor: "pointer" }}>
            <Upload size={20} />
            <span>Upload Photos</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>
          {uploading && (
            <span style={{ marginLeft: "1rem", color: "#e8b4b8" }}>
              Uploading...
            </span>
          )}
        </div>

        {loading ? (
          <div className="app-spinner-container">
            <div className="app-spinner"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="app-empty-state">
            <Upload className="app-empty-state-icon" />
            <h3 className="app-empty-state-title">No photos yet</h3>
            <p className="app-empty-state-text">
              Start uploading to build your gallery
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {photos.map((photo) => (
              <div
                key={photo.id}
                style={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 5px 20px rgba(183, 110, 121, 0.15)",
                  transition: "all 0.3s ease",
                }}
                onClick={() => setSelectedPhoto(photo)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(183, 110, 121, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 20px rgba(183, 110, 121, 0.15)";
                }}
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption || "Photo"}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    display: "flex",
                    gap: "0.5rem",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleToggleFavorite(photo)}
                    style={{
                      background: "rgba(0,0,0,0.7)",
                      border: "none",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: photo.is_favorite ? "#ff6090" : "white",
                    }}
                  >
                    <Heart
                      size={18}
                      fill={photo.is_favorite ? "currentColor" : "none"}
                    />
                  </button>

                  <button
                    onClick={() => handleDelete(photo.id)}
                    style={{
                      background: "rgba(0,0,0,0.7)",
                      border: "none",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#ff6090",
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {photo.caption && (
                  <div
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "2rem 1rem 1rem",
                      color: "white",
                    }}
                  >
                    {photo.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.95)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: "absolute",
                top: "2rem",
                right: "2rem",
                background: "rgba(183, 110, 121, 0.8)",
                border: "none",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                fontSize: "2rem",
              }}
            >
              <X size={24} />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "1200px",
                maxHeight: "90vh",
                background: "linear-gradient(135deg, #0a0a0a, #2a2a2a)",
                borderRadius: "20px",
                overflow: "hidden",
                border: "2px solid rgba(183, 110, 121, 0.3)",
              }}
            >
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.caption || "Photo"}
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  margin: "0 auto",
                }}
              />

              <div style={{ padding: "2rem" }}>
                {editMode === selectedPhoto.id ? (
                  <div>
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Add a caption..."
                      className="app-input"
                      style={{ marginBottom: "1rem" }}
                    />
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button
                        onClick={() => handleUpdateCaption(selectedPhoto)}
                        className="app-button"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(null);
                          setCaption("");
                        }}
                        className="app-button-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: "#e8b4b8", marginBottom: "1rem" }}>
                      {selectedPhoto.caption || "No caption"}
                    </p>
                    <button
                      onClick={() => {
                        setEditMode(selectedPhoto.id);
                        setCaption(selectedPhoto.caption || "");
                      }}
                      className="app-button-secondary"
                      style={{ padding: "0.7rem 1.5rem" }}
                    >
                      Edit Caption
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Gallery;
