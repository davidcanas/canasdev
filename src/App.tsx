import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Music, Volume2, VolumeX, MapPin, Instagram, Play, Pause } from "lucide-react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import lyrics from "./lyrics";
import cane from "./assets/cana.png"; 
import musicFile from "./assets/music.mp3";

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [chuva, setChuva] = useState<CaneItem[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const MUSIC_URL = musicFile;

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);


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


  const removeCane = useCallback((id: number) => {
    setChuva((prev) => prev.filter((c) => c.id !== id));
  }, []);


  useEffect(() => {

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
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white font-sans">
      
      <div className="absolute inset-0 -z-10">
        
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-transparent to-black" />
        
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px]" />
        
        <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-fuchsia-600/10 rounded-full blur-[120px]" />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />
      </div>

      <button
        onClick={toggleAudio}
        className="fixed top-5 left-5 z-50 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all"
      >
        {isPlaying ? <Volume2 size={22} /> : <VolumeX size={22} className="text-gray-400" />}
      </button>

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

        <h1 className="text-4xl font-bold tracking-tighter drop-shadow-lg mb-1">
          David Guerreiro
        </h1>
        <p className="text-sm text-gray-500 tracking-wide mb-3">@canasdev</p>
        
        <p className="text-xs tracking-wide text-gray-400 mb-2 px-4">
          Universidade de Aveiro <span className="text-purple-400/50 mx-1">|</span> Engenharia de Computadores e Informática
        </p>

        <div className="flex items-center gap-1 text-xs text-gray-600 mb-8">
          <MapPin size={11} />
          <span>Portugal</span>
        </div>

        <div className="flex gap-4 mb-10">
          <SocialIcon href="https://www.linkedin.com/in/canasdev/" icon={<Linkedin size={28} />} color="hover:text-blue-400" />
          <SocialIcon href="https://github.com/davidcanas" icon={<Github size={28} />} color="hover:text-gray-400" />
          <SocialIcon href="https://instagram.com/davidguerrreiro" icon={<Instagram size={28} />} color="hover:text-pink-400" />
        </div>

        {/* LYRICS SINCRONIZADAS */}
        <SyncedLyrics currentTime={currentTime} isPlaying={isPlaying} />

        <div className="w-full bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl p-5 flex items-center gap-4 shadow-2xl">
    
          <motion.div 
            className="w-14 h-14 rounded-xl overflow-hidden shadow-lg shadow-purple-500/30 flex-shrink-0"
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
          >
            <img src="https://images.genius.com/6c9ec324f88156c98b571bcc46549fef.378x378x1.jpg" alt="Cover" className="w-full h-full object-cover" />
          </motion.div>

          {/* Info da música */}
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-bold truncate">Consume</p>
            <p className="text-xs text-gray-400 truncate">Chase Atlantic</p>
            {/* Barra de progresso clicável */}
            <div 
              ref={progressRef}
              onClick={handleSeek}
              className="w-full h-1.5 bg-white/10 rounded-full mt-2.5 cursor-pointer group relative"
            >
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full transition-all duration-150 relative"
                style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            {/* Timestamps */}
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-500">{formatTime(currentTime)}</span>
              <span className="text-[10px] text-gray-500">{formatTime(duration)}</span>
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

      
      <motion.img
        src={cane}
        className="fixed bottom-10 right-10 w-12 h-12 z-50 pointer-events-none opacity-60"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      />

    
      <audio ref={audioRef} src={MUSIC_URL} loop />
    </div>
  );
}

function SyncedLyrics({ currentTime, isPlaying }: { currentTime: number; isPlaying: boolean }) {
  const currentIndex = useMemo(() => {
    let idx = -1;
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        idx = i;
        break;
      }
    }
    return idx;
  }, [currentTime]);

  const currentLine = currentIndex >= 0 ? lyrics[currentIndex]?.text : "";

  if ((!isPlaying && currentTime === 0) || !currentLine) {
    return <div className="h-14 mb-4" />;
  }

  return (
    <div className="w-full mb-4 flex flex-col items-center justify-center h-14 relative">
      {/* Glow subtil atrás do texto */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-8 bg-purple-500/8 rounded-full blur-2xl" />
      </div>

      {/* Linha decorativa esquerda + direita */}
      <div className="flex items-center gap-3 w-full max-w-sm">
        <motion.div
          key={`line-l-${currentIndex}`}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-400 origin-left"
        />

        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[13px] font-light tracking-wider text-center shrink-0 max-w-[75%] bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent"
          >
            {currentLine}
          </motion.p>
        </AnimatePresence>

        <motion.div
          key={`line-r-${currentIndex}`}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-400 origin-right"
        />
      </div>
    </div>
  );
}

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
