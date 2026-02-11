import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ValentinePage from "./pages/ValentinePage";
import MainApp from "./pages/MainApp";
import Editor from "./pages/Editor";
import Feed from "./pages/Feed";
import Gallery from "./pages/Gallery";
import MoodTracker from "./pages/MoodTracker";
import Ideas from "./pages/Ideas";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ValentinePage />} />
        <Route path="/app" element={<MainApp />} />
        <Route path="/app/write" element={<Editor />} />
        <Route path="/app/write/:id" element={<Editor />} />
        <Route path="/app/feed" element={<Feed />} />
        <Route path="/app/gallery" element={<Gallery />} />
        <Route path="/app/moods" element={<MoodTracker />} />
        <Route path="/app/ideas" element={<Ideas />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
