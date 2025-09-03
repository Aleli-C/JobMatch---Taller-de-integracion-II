import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Publicaciones from "./components/publicaciones";

function App() {
  return (
    <Router>
      <Header />
      <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Publicaciones />} />
          </Routes>
      </main>

    </Router>
  );
}

export default App;
