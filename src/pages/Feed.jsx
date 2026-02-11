import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PenTool, Heart, Trash2, Edit, Eye } from "lucide-react";
import Navigation from "../components/Navigation";
import "../styles/app.css";
import { getPosts, deletePost, toggleFavorite } from "../lib/supabase";
import { format } from "date-fns";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, published, draft, favorite

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const handleToggleFavorite = async (id, currentValue) => {
    try {
      await toggleFavorite(id, currentValue);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_favorite: !currentValue } : p,
        ),
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    if (filter === "published") return post.status === "published";
    if (filter === "draft") return post.status === "draft";
    if (filter === "favorite") return post.is_favorite;
    return true;
  });

  return (
    <div className="main-app">
      <Navigation />

      <main className="app-content">
        <header className="app-header">
          <h1 className="app-title">Your Feed</h1>
          <p className="app-subtitle">All your writings in one place</p>
        </header>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          {["all", "published", "draft", "favorite"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "app-button" : "app-button-secondary"}
              style={{ padding: "0.7rem 1.5rem" }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="app-spinner-container">
            <div className="app-spinner"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="app-empty-state">
            <PenTool className="app-empty-state-icon" />
            <h3 className="app-empty-state-title">No posts yet</h3>
            <p className="app-empty-state-text">
              Start writing to see your creations here
            </p>
            <Link to="/app/write" className="app-button">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  background:
                    "linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%)",
                  borderRadius: "20px",
                  border: "1px solid rgba(183, 110, 121, 0.2)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(183, 110, 121, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div style={{ padding: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        background:
                          post.status === "published"
                            ? "rgba(183, 110, 121, 0.2)"
                            : "rgba(128, 128, 128, 0.2)",
                        color:
                          post.status === "published" ? "#e8b4b8" : "#909090",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "12px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                      }}
                    >
                      {post.status}
                    </span>
                    <span
                      style={{
                        color: "#b76e79",
                        fontSize: "0.85rem",
                      }}
                    >
                      {post.type}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.4rem",
                      color: "#fff",
                      margin: "0 0 0.5rem",
                      fontWeight: "700",
                    }}
                  >
                    {post.title}
                  </h3>

                  <p
                    style={{
                      color: "#e8b4b8",
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      marginBottom: "1rem",
                    }}
                  >
                    {post.content.substring(0, 150)}
                    {post.content.length > 150 ? "..." : ""}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: "rgba(183, 110, 121, 0.15)",
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
                    style={{
                      color: "#909090",
                      fontSize: "0.85rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {format(new Date(post.created_at), "MMM d, yyyy")}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <Link
                      to={`/app/write/${post.id}`}
                      style={{
                        background: "rgba(183, 110, 121, 0.2)",
                        color: "#e8b4b8",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        textDecoration: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Edit size={16} />
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleToggleFavorite(post.id, post.is_favorite)
                      }
                      style={{
                        background: post.is_favorite
                          ? "rgba(183, 110, 121, 0.3)"
                          : "transparent",
                        color: post.is_favorite ? "#ff6090" : "#e8b4b8",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        border: "1px solid rgba(183, 110, 121, 0.3)",
                        cursor: "pointer",
                      }}
                    >
                      <Heart
                        size={16}
                        fill={post.is_favorite ? "currentColor" : "none"}
                      />
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        background: "transparent",
                        color: "#ff6090",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        border: "1px solid rgba(255, 96, 144, 0.3)",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Feed;
