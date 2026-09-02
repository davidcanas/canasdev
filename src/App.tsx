import { motion, AnimatePresence } from "framer-motion";
import { Github, Disc as Discord, Music, Volume2, VolumeX, MapPin, Instagram, Play, Pause } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import cane from "./assets/cana.png"; 

// Gera um ID único para cada cana
let caneIdCounter = 0;

interface CaneItem {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [chuva, setChuva] = useState<CaneItem[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const MUSIC_URL = "SUA_URL_DA_MUSICA_AQUI.mp3";

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Spawn contínuo de canas por todo o ecrã
  const spawnCane = useCallback(() => {
    const screenW = typeof window !== "undefined" ? window.innerWidth : 1000;
    const newCane: CaneItem = {
      id: caneIdCounter++,
      x: Math.random() * screenW,
      size: 20 + Math.random() * 24, // entre 20px e 44px
      duration: 3 + Math.random() * 4, // entre 3s e 7s
      delay: 0,
      rotation: Math.random() * 720 - 360,
    };
    setChuva((prev) => [...prev, newCane]);
  }, []);

  // Remover canas que já caíram (limpeza de memória)
  const removeCane = useCallback((id: number) => {
    setChuva((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Spawn contínuo — 3 canas por segundo
  useEffect(() => {
    // Spawn inicial de várias canas para encher o ecrã
    const initialBurst = Array.from({ length: 12 }, () => {
      const screenW = typeof window !== "undefined" ? window.innerWidth : 1000;
      return {
        id: caneIdCounter++,
        x: Math.random() * screenW,
        size: 20 + Math.random() * 24,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2,
        rotation: Math.random() * 720 - 360,
      } as CaneItem;
    });
    setChuva(initialBurst);

    const interval = setInterval(() => {
      spawnCane();
    }, 350); // ~3 por segundo

    return () => clearInterval(interval);
  }, [spawnCane]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-black text-white font-sans">
      
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://sua-imagem-de-fundo.jpg')] bg-cover bg-center opacity-30" />
      </div>

      {/* --- CHUVA DE CANAS POR TODO O ECRÃ --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <AnimatePresence>
          {chuva.map((item) => (
            <RainElement key={item.id} item={item} src={cane} onComplete={removeCane} />
          ))}
        </AnimatePresence>
      </div>

      <main className="z-10 flex flex-col items-center max-w-lg w-full px-6 text-center">
        
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="w-28 h-28 rounded-full border-2 border-white/30 p-1 mb-4 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
        >
          <img 
            src="https://github.com/davidcanas.png" 
            alt="Avatar" 
            className="w-full h-full rounded-full object-cover"
          />
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tighter drop-shadow-lg mb-2">
          canasdev<span className="text-purple-400">_</span>
        </h1>
        
        <p className="text-gray-300 italic mb-4 px-4 leading-relaxed">
          Universidade de Aveiro | Engenharia de Computadores e Informática
        </p>

        {/* LOCALIZAÇÃO */}
        <div className="flex items-center gap-1 text-sm text-gray-400 mb-8">
          <MapPin size={14} />
          <span>Aveiro, Portugal</span>
        </div>

        {/* SOCIAL BADGES */}
        <div className="flex gap-4 mb-10">
          <SocialIcon href="https://discord.com" icon={<Discord size={28} />} color="hover:text-indigo-400" />
          <SocialIcon href="https://spotify.com" icon={<Music size={28} />} color="hover:text-green-400" />
          <SocialIcon href="https://instagram.com" icon={<Instagram size={28} />} color="hover:text-pink-400" />
          <SocialIcon href="https://github.com/davidcanas" icon={<Github size={28} />} color="hover:text-gray-400" />
        </div>

        {/* PLAYER DE MÚSICA — MODERNO COM PLAY/PAUSE */}
        <div className="w-full bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl p-5 flex items-center gap-4 shadow-2xl">
          {/* Cover art com animação */}
          <motion.div 
            className="w-14 h-14 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0"
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
          >
            <Music size={24} />
          </motion.div>

          {/* Info da música */}
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-bold truncate">Nome da Música</p>
            <p className="text-xs text-gray-400 truncate">Artista - Álbum</p>
            {/* Barra de progresso visual */}
            <div className="w-full h-1 bg-white/10 rounded-full mt-2.5 overflow-hidden">
              {isPlaying ? (
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }} 
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full" 
                />
              ) : (
                <div className="w-1/3 h-full bg-white/20 rounded-full" />
              )}
            </div>
          </div>

          {/* Botão Play / Pause */}
          <motion.button
            onClick={toggleAudio}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-shadow flex-shrink-0"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Pause size={18} fill="white" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Play size={18} fill="white" className="ml-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Botão Volume */}
          <button 
            onClick={toggleAudio}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          >
            {isPlaying ? <Volume2 size={18} className="text-gray-300" /> : <VolumeX size={18} className="text-gray-500" />}
          </button>
        </div>
      </main>

      {/* Cana rotativa decorativa no canto */}
      <motion.img
        src={cane}
        className="fixed bottom-10 right-10 w-12 h-12 z-50 pointer-events-none opacity-60"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      />

      {/* Áudio invisível */}
      <audio ref={audioRef} src={MUSIC_URL} loop />
    </div>
  );
}

// Componentes Auxiliares
function SocialIcon({ href, icon, color }: { href: string, icon: any, color: string }) {
  return (
    <a 
      href={href} target="_blank" rel="noreferrer"
      className={`text-white/70 transition-all duration-300 transform hover:scale-125 ${color} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
    >
      {icon}
    </a>
  );
}

function RainElement({ item, src, onComplete }: { item: CaneItem; src: string; onComplete: (id: number) => void }) {
  const screenH = typeof window !== "undefined" ? window.innerHeight : 900;

  return (
    <motion.img
      src={src}
      className="absolute pointer-events-none"
      style={{ width: item.size, height: item.size }}
      initial={{ x: item.x, y: -60, opacity: 0.8 }}
      animate={{ 
        y: screenH + 80, 
        opacity: 0, 
        rotate: item.rotation,
      }}
      transition={{ 
        duration: item.duration, 
        delay: item.delay,
        ease: "linear",
      }}
      onAnimationComplete={() => onComplete(item.id)}
    />
  );
}