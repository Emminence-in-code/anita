import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PenTool, BookOpen, Image, Smile, Lightbulb, Plus } from "lucide-react";
import Navigation from "../components/Navigation";
import "../styles/app.css";
import { getPosts, getPhotos, getMoods, getIdeas } from "../lib/supabase";

function MainApp() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    photos: 0,
    moods: 0,
    ideas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [posts, photos, moods, ideas] = await Promise.all([
        getPosts(),
        getPhotos(),
        getMoods(),
        getIdeas(),
      ]);

      setStats({
        totalPosts: posts.length,
        publishedPosts: posts.filter((p) => p.status === "published").length,
        photos: photos.length,
        moods: moods.length,
        ideas: ideas.filter((i) => !i.is_archived).length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      icon: PenTool,
      title: "Total Writings",
      value: stats.totalPosts,
      label: "poems & journals",
      link: "/app/feed",
      color: "#b76e79",
    },
    {
      icon: BookOpen,
      title: "Published",
      value: stats.publishedPosts,
      label: "shared pieces",
      link: "/app/feed",
      color: "#ff6090",
    },
    {
      icon: Image,
      title: "Photos",
      value: stats.photos,
      label: "captured moments",
      link: "/app/gallery",
      color: "#b76e79",
    },
    {
      icon: Smile,
      title: "Mood Entries",
      value: stats.moods,
      label: "tracked days",
      link: "/app/moods",
      color: "#ff6090",
    },
    {
      icon: Lightbulb,
      title: "Ideas",
      value: stats.ideas,
      label: "brilliant thoughts",
      link: "/app/ideas",
      color: "#b76e79",
    },
  ];

  return (
    <div className="main-app">
      <Navigation />

      <main className="app-content">
        <header className="app-header">
          <h1 className="app-title">Welcome Back, Anita 💙</h1>
          <p className="app-subtitle">
            Your creative sanctuary awaits. What will you create today?
          </p>
        </header>

        {loading ? (
          <div className="app-spinner-container">
            <div className="app-spinner"></div>
          </div>
        ) : (
          <>
            <div className="dashboard-grid">
              {dashboardCards.map((card) => (
                <Link
                  key={card.title}
                  to={card.link}
                  className="dashboard-card"
                  style={{ textDecoration: "none" }}
                >
                  <card.icon className="dashboard-card-icon" />
                  <h3 className="dashboard-card-title">{card.title}</h3>
                  <p className="dashboard-card-value">{card.value}</p>
                  <p className="dashboard-card-label">{card.label}</p>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: "3rem" }}>
              <Link to="/app/write" className="app-button">
                <Plus size={20} />
                <span>Start Writing</span>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default MainApp;
