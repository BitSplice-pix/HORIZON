import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Landing } from "./components/Landing";
import { Welcome } from "./components/Welcome";
import { Home } from "./components/Home";
import { Breathing } from "./components/Breathing";
import { Mood } from "./components/Mood";
import { Journal } from "./components/Journal";

type Screen = "landing" | "welcome" | "home" | "breath" | "mood" | "journal";

const variants = {
  initial: { opacity: 0, scale: 1.02, filter: "blur(8px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.98, filter: "blur(8px)" },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [user, setUser] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("aarogya_user");
    if (u) {
      setUser(u);
      setScreen("home");
    }
  }, []);

  function login(name: string) {
    setUser(name);
    localStorage.setItem("aarogya_user", name);
    setScreen("welcome");
  }

  function logout() {
    localStorage.removeItem("aarogya_user");
    setUser("");
    setScreen("landing");
  }

  const screens: Record<Screen, React.ReactNode> = {
    landing: <Landing onLogin={login} />,
    welcome: <Welcome user={user} onContinue={() => setScreen("home")} />,
    home: <Home user={user} onPick={(k) => setScreen(k)} onLogout={logout} />,
    breath: <Breathing onBack={() => setScreen("home")} />,
    mood: <Mood onBack={() => setScreen("home")} />,
    journal: <Journal user={user} onBack={() => setScreen("home")} />,
  };

  return (
    <div className="size-full bg-black relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          {screens[screen]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
