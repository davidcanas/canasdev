import { motion } from "framer-motion";
import { Github } from "lucide-react";
import cane from "./assets/cana.png";
import { useState } from "react";

export default function App() {
  const [chuva, setChuva] = useState<number[]>([]);

  const spawnChuva = () => {
    const novas = Array.from({ length: 5 }, (_, i) => Date.now() + i);
    setChuva((prev) => [...prev, ...novas]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-tr from-gray-950 via-gray-900 to-black text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="p-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.6)] z-10">
        <h1 className="text-6xl font-extrabold tracking-wide text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          I am CanasDev
        </h1>
      </div>

      <motion.img
        src={cane}
        alt="Cana de Açúcar"
        className="absolute w-16 h-16 drop-shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        style={{
          top: "50%",
          left: "50%",
          marginLeft: "-9rem",
          marginTop: "-9rem",
          transformOrigin: "9rem 9rem",
        }}
        onClick={spawnChuva}
      />

      {chuva.map((id) => {
        const randomX = Math.random() * window.innerWidth; 
        const delay = Math.random() * 0.5;
        return (
          <motion.img
            key={id}
            src={cane}
            alt="Cana chuva"
            className="absolute w-10 h-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]"
            initial={{ x: randomX, y: -100, opacity: 1 }}
            animate={{
              y: window.innerHeight + 100,
              opacity: 0,
              x: randomX + (Math.random() * 100 - 50), 
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              ease: "linear",
              delay,
            }}
          />
        );
      })}

      <footer className="absolute bottom-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
        <a
          href="https://github.com/davidcanas"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition"
        >
          <Github size={20} />
          <span className="font-medium">@davidcanas</span>
        </a>
      </footer>
    </div>
  );
}
