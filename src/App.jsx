import { useState, useEffect, useRef } from "react";
import "./index.css";
import "./celebration.css";

function App() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStage, setCelebrationStage] = useState(0);
  const [hearts, setHearts] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [likedPhotos, setLikedPhotos] = useState(new Set());
  const [typedText, setTypedText] = useState("");
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [rosePetals, setRosePetals] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    const text = "Hey Anita! 🖤";
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        setTypedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
        setTimeout(() => setShowSubtitle(true), 300);
        setTimeout(() => setShowButton(true), 800);
      }
    }, 100);

    return () => clearInterval(typing);
  }, []);

  // Generate rose petals
  useEffect(() => {
    const petals = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 5,
      animationDuration: 8 + Math.random() * 7,
      size: 15 + Math.random() * 20,
      rotation: Math.random() * 360,
    }));
    setRosePetals(petals);

    // Background hearts
    const heartPositions = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 8,
      animationDuration: 8 + Math.random() * 4,
    }));
    setHearts(heartPositions);
  }, []);

  // Mouse tracking for glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      return () => hero.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const handleYesClick = () => {
    setShowCelebration(true);
    setCelebrationStage(1);
    createMassiveConfetti();
    createFireworks();
    createHeartExplosion();
    createSparkleShower();

    // Stage progression
    setTimeout(() => setCelebrationStage(2), 2000);
    setTimeout(() => setCelebrationStage(3), 4500);
    setTimeout(() => setCelebrationStage(4), 7000);
  };

  const createMassiveConfetti = () => {
    const colors = [
      "#ff1744",
      "#ff6090",
      "#ffd700",
      "#ffffff",
      "#ff4081",
      "#b76e79",
    ];
    for (let i = 0; i < 300; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.className = "confetti-epic";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + "s";
        confetti.style.width = 8 + Math.random() * 8 + "px";
        confetti.style.height = 8 + Math.random() * 8 + "px";
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 6000);
      }, i * 15);
    }
  };

  const createFireworks = () => {
    const positions = [
      { x: 20, y: 30 },
      { x: 80, y: 25 },
      { x: 50, y: 40 },
      { x: 35, y: 60 },
      { x: 70, y: 55 },
    ];

    positions.forEach((pos, index) => {
      setTimeout(() => {
        const firework = document.createElement("div");
        firework.className = "firework";
        firework.style.left = pos.x + "%";
        firework.style.top = pos.y + "%";
        document.body.appendChild(firework);

        // Create particles
        for (let i = 0; i < 30; i++) {
          const particle = document.createElement("div");
          particle.className = "firework-particle";
          const angle = (Math.PI * 2 * i) / 30;
          const velocity = 100 + Math.random() * 100;
          particle.style.setProperty("--tx", Math.cos(angle) * velocity + "px");
          particle.style.setProperty("--ty", Math.sin(angle) * velocity + "px");
          firework.appendChild(particle);
        }

        setTimeout(() => firework.remove(), 2000);
      }, index * 600);
    });
  };

  const createHeartExplosion = () => {
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const heart = document.createElement("div");
        heart.className = "explosion-heart";
        heart.innerHTML = "❤️";
        const angle = (Math.PI * 2 * i) / 50;
        const distance = 200 + Math.random() * 300;
        heart.style.setProperty("--angle", angle);
        heart.style.setProperty("--distance", distance + "px");
        heart.style.left = "50%";
        heart.style.top = "50%";
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 3000);
      }, i * 30);
    }
  };

  const createSparkleShower = () => {
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";
        sparkle.innerHTML = "✨";
        sparkle.style.left = Math.random() * 100 + "vw";
        sparkle.style.fontSize = 1 + Math.random() * 2 + "rem";
        sparkle.style.animationDelay = Math.random() * 2 + "s";
        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 4000);
      }, i * 40);
    }
  };

  const handlePhotoClick = (item) => {
    setSelectedPhoto(item);
  };

  const handleLike = (index, e) => {
    e.stopPropagation();
    const newLiked = new Set(likedPhotos);
    if (newLiked.has(index)) {
      newLiked.delete(index);
    } else {
      newLiked.add(index);
      createLikeHeart(e.clientX, e.clientY);
    }
    setLikedPhotos(newLiked);
  };

  const createLikeHeart = (x, y) => {
    const heart = document.createElement("div");
    heart.className = "like-heart";
    heart.innerHTML = "❤️";
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  };

  const galleryItems = [
    {
      title: "My Love",
      caption:
        "Onye m hụrụ n'anya, if Valentine were a person, it would be you.",
      subtitle: "(My love, if Valentine was human, it would be you.)",
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop",
    },
    {
      title: "Racing Hearts",
      caption:
        "Do you know my heart starts racing every time you come online? A hụrụ m gị n'anya.",
      subtitle: "(I love you.)",
      image:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop",
    },
    {
      title: "Cupid's Job",
      caption:
        "Can I be honest? Your smile has taken over Cupid's job in my life.",
      subtitle: "",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop",
    },
    {
      title: "Sweeter Than Chocolate",
      caption:
        "Are you chocolate? Because even Valentine gifts are not as sweet as you.",
      subtitle: "",
      image:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop",
    },
    {
      title: "Making It Official",
      caption:
        "I love you deeply – I'm just using this Valentine to make it official.",
      subtitle: "",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop",
    },
    {
      title: "My Whole Bouquet",
      caption:
        "If Valentine is about red and roses, then you're my whole bouquet.",
      subtitle: "",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
    },
    {
      title: "Space In Your Heart",
      caption:
        "There are many gifts in this world, but the only one I want is a small space in your heart.",
      subtitle: "",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
    },
    {
      title: "Real Hugs",
      caption:
        "Forget teddy bears; I'd rather be the one giving you real hugs after Valentine's Day.",
      subtitle: "",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop",
    },
    {
      title: "Heart Has Moved",
      caption:
        "If I send you flowers, it's not for show. It's my way of saying my heart has moved to your side.",
      subtitle: "",
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=1000&fit=crop",
    },
    {
      title: "Lifetime Package",
      caption:
        "Valentine's Day is 24 hours, but with you, I'm thinking of a lifetime package.",
      subtitle: "",
      image:
        "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&h=1000&fit=crop",
    },
  ];

  return (
    <>
      {/* Floating Hearts Background */}
      <div className="hearts-container">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="heart"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.animationDelay}s`,
              animationDuration: `${heart.animationDuration}s`,
            }}
          />
        ))}
      </div>

      {/* Enhanced Hero Section */}
      <section className="hero-enhanced" ref={heroRef}>
        {/* Animated gradient background */}
        <div className="hero-gradient-bg"></div>

        {/* Cursor glow effect */}
        <div
          className="cursor-glow"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        ></div>

        {/* Rose petals falling */}
        <div className="rose-petals-container">
          {rosePetals.map((petal) => (
            <div
              key={petal.id}
              className="rose-petal"
              style={{
                left: `${petal.left}%`,
                animationDelay: `${petal.animationDelay}s`,
                animationDuration: `${petal.animationDuration}s`,
                width: `${petal.size}px`,
                height: `${petal.size}px`,
                transform: `rotate(${petal.rotation}deg)`,
              }}
            />
          ))}
        </div>

        {/* Particle effects layer */}
        <div className="particles-layer"></div>

        {/* Main content */}
        <div className="hero-content-enhanced">
          <div className="text-container">
            <h1 className="typewriter-text">
              {typedText}
              <span className="cursor-blink">|</span>
            </h1>

            {showSubtitle && (
              <p className="subtitle-enhanced fade-in">
                This is for you, because you deserve something as special as you
                are
              </p>
            )}

            {showButton && (
              <a href="#wordplay" className="cta-button-enhanced fade-in-up">
                <span className="button-text">See What I Mean</span>
                <span className="button-glow"></span>
              </a>
            )}
          </div>

          {/* Decorative elements */}
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* Wordplay Section - Creative use of ANITA */}
      <section id="wordplay" className="wordplay-section">
        <h2 className="section-title">What A.N.I.T.A Means To Me</h2>
        <div className="wordplay-grid">
          <div className="wordplay-card animate-in stagger-1">
            <div className="big-letter">A</div>
            <h3>Absolutely Amazing</h3>
            <p>
              Everything about you is absolutely amazing. Your smile, your
              laugh, the way you make every moment special.
            </p>
          </div>

          <div className="wordplay-card animate-in stagger-2">
            <div className="big-letter">N</div>
            <h3>Need You</h3>
            <p>
              I need you in my life like I need air to breathe. You make
              everything better just by being you.
            </p>
          </div>

          <div className="wordplay-card animate-in stagger-3">
            <div className="big-letter">I</div>
            <h3>I'm Yours</h3>
            <p>
              My heart has made its choice, and it chose you. I'm completely,
              totally, and hopelessly yours.
            </p>
          </div>

          <div className="wordplay-card animate-in stagger-4">
            <div className="big-letter">T</div>
            <h3>Thinking of You</h3>
            <p>
              Every second, every minute, every hour. You're always on my mind,
              and I wouldn't have it any other way.
            </p>
          </div>

          <div className="wordplay-card animate-in stagger-5">
            <div className="big-letter">A</div>
            <h3>Always & Forever</h3>
            <p>
              This isn't just for today or tomorrow. This is for always. You and
              me, forever sounds pretty perfect.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-intro">
          <h2 className="section-title">Every Moment, Every Feeling</h2>
          <p className="gallery-subtitle">
            Click any photo to see the full message 🖤
          </p>
        </div>

        <div className="gallery-grid-masonry">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className={`gallery-item-new animate-in stagger-${(index % 6) + 1}`}
              onClick={() => handlePhotoClick(item)}
            >
              <div className="gallery-image-wrapper">
                <img src={item.image} alt={item.title} />
                <div className="gallery-overlay-quick">
                  <div className="overlay-content-quick">
                    <h4>{item.title}</h4>
                    <p className="preview-text">
                      {item.caption.substring(0, 50)}...
                    </p>
                    <span className="read-more">Click to read more →</span>
                  </div>
                </div>
              </div>

              <div className="gallery-actions">
                <button
                  className={`like-btn ${likedPhotos.has(index) ? "liked" : ""}`}
                  onClick={(e) => handleLike(index, e)}
                >
                  {likedPhotos.has(index) ? "❤️" : "🖤"}
                </button>
                <span className="photo-number">#{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="photo-modal active"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="modal-content-photo"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedPhoto(null)}
            >
              ×
            </button>
            <div className="modal-grid">
              <div className="modal-image">
                <img src={selectedPhoto.image} alt={selectedPhoto.title} />
              </div>
              <div className="modal-text">
                <h3>{selectedPhoto.title}</h3>
                <div className="modal-caption">
                  <p className="main-caption">{selectedPhoto.caption}</p>
                  {selectedPhoto.subtitle && (
                    <p className="subtitle-caption">{selectedPhoto.subtitle}</p>
                  )}
                </div>
                <div className="modal-hearts">{"❤️".repeat(5)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The Question Section */}
      <section className="question-section">
        <div className="question-content">
          <h2>So Anita...</h2>
          <div className="heart-big">❤️</div>
          <h2>Will You Be My Valentine?</h2>

          <div className="answer-buttons">
            <button className="answer-button yes" onClick={handleYesClick}>
              YES! 🖤
            </button>
            <button className="answer-button no">
              No (this button doesn't work 😏)
            </button>
          </div>
        </div>
      </section>

      {/* Epic Multi-Stage Celebration */}
      <div
        className={`celebration-modal-epic ${showCelebration ? "active" : ""}`}
      >
        {/* Stage 1: Initial Explosion */}
        {celebrationStage >= 1 && (
          <div
            className={`celebration-stage stage-1 ${celebrationStage === 1 ? "active" : "exit"}`}
          >
            <div className="explosion-center"></div>
            <div className="celebration-text-big">
              <div className="yes-text">YES!</div>
            </div>
          </div>
        )}

        {/* Stage 2: Romantic Message 1 */}
        {celebrationStage >= 2 && (
          <div
            className={`celebration-stage stage-2 ${celebrationStage === 2 ? "active" : celebrationStage > 2 ? "exit" : ""}`}
          >
            <div className="message-card">
              <div className="heart-icon-big">💕</div>
              <h2 className="romantic-message">
                You Just Made Me The Happiest Person Alive!
              </h2>
              <p className="sub-message">
                Every dream I've ever had just came true 🖤
              </p>
            </div>
          </div>
        )}

        {/* Stage 3: Romantic Message 2 */}
        {celebrationStage >= 3 && (
          <div
            className={`celebration-stage stage-3 ${celebrationStage === 3 ? "active" : celebrationStage > 3 ? "exit" : ""}`}
          >
            <div className="message-card">
              <div className="quote-mark">"</div>
              <h2 className="romantic-quote">
                I Promise To Make Every Single Day As Special As You Make Me
                Feel
              </h2>
              <div className="hearts-row">
                {["❤️", "🖤", "💕", "💖", "❤️"].map((heart, i) => (
                  <span
                    key={i}
                    className="heart-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {heart}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage 4: Final Victory */}
        {celebrationStage >= 4 && (
          <div
            className={`celebration-stage stage-4 ${celebrationStage === 4 ? "active" : ""}`}
          >
            <div className="victory-card">
              <div className="confetti-burst"></div>
              <div className="trophy-icon">🏆</div>
              <h1 className="victory-title">Happy Valentine's Day!</h1>
              <h2 className="victory-name">Anita 🖤</h2>
              <p className="victory-message">
                This is just the beginning of our beautiful story together
              </p>
              <div className="final-hearts">
                <span className="pulse-heart">❤️</span>
                <span
                  className="pulse-heart"
                  style={{ animationDelay: "0.2s" }}
                >
                  💕
                </span>
                <span
                  className="pulse-heart"
                  style={{ animationDelay: "0.4s" }}
                >
                  ❤️
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  marginTop: "2rem",
                }}
              >
                <a
                  href="/app"
                  className="cta-button-enhanced"
                  style={{
                    textDecoration: "none",
                    fontSize: "1.1rem",
                    padding: "1.2rem 2.5rem",
                  }}
                >
                  ✨ Enter Your Space
                </a>
                <button
                  className="close-celebration"
                  onClick={() => {
                    setShowCelebration(false);
                    setCelebrationStage(0);
                  }}
                  style={{
                    background: "transparent",
                    border: "2px solid rgba(183, 110, 121, 0.5)",
                  }}
                >
                  Close ×
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Old Celebration Modal - Fallback */}
      <div
        className={`celebration-modal ${showCelebration && celebrationStage === 0 ? "active" : ""}`}
      >
        <div className="celebration-content">
          <h2>🎉 YES! 🎉</h2>
          <p>
            You just made me the happiest person alive! 🖤
            <br />
            <br />
            I promise to make every day as special as you make me feel.
            <br />
            <br />
            <strong>Happy Valentine's Day, Anita! ❤️</strong>
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
