import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

const TimeTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes in seconds
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25);
  const [currentStyle, setCurrentStyle] = useState('classic');
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize audio context
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Play style-specific chime
  const playChime = (style) => {
    const audioContext = initAudioContext();
    
    // Different chime patterns for each style
    const chimePatterns = {
      classic: () => {
        // Simple bell tone
        playTone(audioContext, 800, 0.5, 'sine');
        setTimeout(() => playTone(audioContext, 600, 0.3, 'sine'), 200);
      },
      midcentury: () => {
        // Warm kitchen timer ding
        playTone(audioContext, 1000, 0.4, 'sine');
        setTimeout(() => playTone(audioContext, 800, 0.4, 'sine'), 150);
        setTimeout(() => playTone(audioContext, 600, 0.5, 'sine'), 300);
      },
      atomic: () => {
        // Futuristic beeps
        playTone(audioContext, 1200, 0.2, 'square');
        setTimeout(() => playTone(audioContext, 1400, 0.2, 'square'), 250);
        setTimeout(() => playTone(audioContext, 1600, 0.3, 'square'), 500);
      },
      modern: () => {
        // Subtle notification tone
        playTone(audioContext, 440, 0.3, 'sine');
        setTimeout(() => playTone(audioContext, 554, 0.3, 'sine'), 200);
        setTimeout(() => playTone(audioContext, 659, 0.4, 'sine'), 400);
      },
      minimal: () => {
        // Simple single tone
        playTone(audioContext, 600, 0.6, 'sine');
      },
      neon: () => {
        // Synthwave-style chime
        playTone(audioContext, 880, 0.3, 'sawtooth');
        setTimeout(() => playTone(audioContext, 1100, 0.3, 'sawtooth'), 200);
        setTimeout(() => playTone(audioContext, 1320, 0.4, 'sawtooth'), 400);
        setTimeout(() => playTone(audioContext, 880, 0.5, 'sawtooth'), 800);
      }
    };

    const pattern = chimePatterns[style] || chimePatterns.classic;
    pattern();
  };

  // Generate tone with specific frequency and waveform
  const playTone = (audioContext, frequency, duration, waveform = 'sine') => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = waveform;
    
    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const styles = {
    classic: {
      name: 'Classic',
      background: 'bg-gray-100',
      timerBg: 'bg-white',
      border: 'border-gray-800',
      borderWidth: 'border-8',
      sectorColor: '#FF4444',
      numberColor: '#333',
      handColor: '#333',
      tickColor: '#333',
      labelColor: 'text-gray-400',
      shape: 'rounded-full'
    },
    midcentury: {
      name: 'Mid-Century',
      background: 'bg-orange-50',
      timerBg: 'bg-gradient-to-br from-amber-100 to-orange-100',
      border: 'border-amber-700',
      borderWidth: 'border-12',
      sectorColor: '#DC2626',
      numberColor: '#92400E',
      handColor: '#451A03',
      tickColor: '#92400E',
      labelColor: 'text-amber-600',
      shape: 'rounded-full',
      shadowStyle: 'shadow-amber-200/50'
    },
    atomic: {
      name: 'Atomic Age',
      background: 'bg-cyan-50',
      timerBg: 'bg-gradient-to-r from-cyan-100 to-blue-100',
      border: 'border-cyan-600',
      borderWidth: 'border-4',
      sectorColor: '#059669',
      numberColor: '#0E7490',
      handColor: '#164E63',
      tickColor: '#0891B2',
      labelColor: 'text-cyan-500',
      shape: 'rounded-full',
      shadowStyle: 'shadow-cyan-200/50'
    },
    modern: {
      name: 'Modern',
      background: 'bg-slate-900',
      timerBg: 'bg-gradient-to-br from-slate-700 to-slate-800',
      border: 'border-slate-400',
      borderWidth: 'border-2',
      sectorColor: '#8B5CF6',
      numberColor: '#F1F5F9',
      handColor: '#F1F5F9',
      tickColor: '#94A3B8',
      labelColor: 'text-slate-400',
      shape: 'rounded-full',
      shadowStyle: 'shadow-purple-500/20'
    },
    minimal: {
      name: 'Minimal',
      background: 'bg-neutral-50',
      timerBg: 'bg-white',
      border: 'border-neutral-300',
      borderWidth: 'border-1',
      sectorColor: '#525252',
      numberColor: '#404040',
      handColor: '#404040',
      tickColor: '#A3A3A3',
      labelColor: 'text-neutral-400',
      shape: 'rounded-full',
      shadowStyle: 'shadow-neutral-200/30'
    },
    neon: {
      name: 'Neon',
      background: 'bg-black',
      timerBg: 'bg-gradient-to-br from-purple-900/30 to-pink-900/30',
      border: 'border-pink-400',
      borderWidth: 'border-3',
      sectorColor: '#EC4899',
      numberColor: '#F0ABFC',
      handColor: '#F0ABFC',
      tickColor: '#C084FC',
      labelColor: 'text-purple-400',
      shape: 'rounded-full',
      shadowStyle: 'shadow-pink-500/30',
      glowEffect: true
    }
  };

  const style = styles[currentStyle];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play chime when timer completes
            setTimeout(() => playChime(currentStyle), 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    // Initialize audio context on first user interaction
    initAudioContext();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const updateTime = (minutes) => {
    const newTime = Math.max(1, Math.min(60, minutes)) * 60;
    setInputMinutes(Math.max(1, Math.min(60, minutes)));
    setInitialTime(newTime);
    if (!isRunning) {
      setTimeLeft(newTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate the angle for the red sector based on TIME REMAINING
  // The sector should shrink as time passes, showing time left
  const sectorAngle = (timeLeft / 3600) * 360; // Red sector shows remaining time

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${style.background}`}>
      <div className="mb-6">
        <h1 className={`text-3xl font-bold text-center mb-2 ${currentStyle === 'modern' || currentStyle === 'neon' ? 'text-white' : 'text-gray-800'}`}>
          Time Timer
        </h1>
        <p className={`text-center ${currentStyle === 'modern' || currentStyle === 'neon' ? 'text-gray-300' : 'text-gray-600'}`}>
          Visual time management
        </p>
      </div>

      {/* Style Selector */}
      <div className="mb-6">
        <p className={`text-sm mb-3 text-center font-medium ${currentStyle === 'modern' || currentStyle === 'neon' ? 'text-gray-300' : 'text-gray-600'}`}>
          Choose Style
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(styles).map(([key, styleObj]) => (
            <button
              key={key}
              onClick={() => setCurrentStyle(key)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                currentStyle === key
                  ? 'bg-blue-500 text-white'
                  : currentStyle === 'modern' || currentStyle === 'neon'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {styleObj.name}
            </button>
          ))}
        </div>
      </div>

      {/* Time Timer Container */}
      <div className={`relative mb-8 p-8 ${style.timerBg} ${style.border} ${style.borderWidth} ${style.shape} ${style.shadowStyle || 'shadow-2xl'} ${style.glowEffect ? 'shadow-2xl' : ''}`} 
           style={{ 
             width: '400px', 
             height: '400px',
             boxShadow: style.glowEffect ? '0 0 50px rgba(236, 72, 153, 0.3), 0 0 100px rgba(168, 85, 247, 0.2)' : undefined
           }}>
        
        {/* Timer Face */}
        <div className="relative w-full h-full">
          <svg width="320" height="320" className="absolute inset-0 m-auto">
            {/* Background circle with gradient */}
            <defs>
              {currentStyle === 'midcentury' && (
                <radialGradient id="midcenturyGrad" cx="50%" cy="30%">
                  <stop offset="0%" stopColor="#FEF3C7" />
                  <stop offset="100%" stopColor="#FDE68A" />
                </radialGradient>
              )}
              {currentStyle === 'atomic' && (
                <radialGradient id="atomicGrad" cx="50%" cy="30%">
                  <stop offset="0%" stopColor="#E0F7FA" />
                  <stop offset="100%" stopColor="#B2EBF2" />
                </radialGradient>
              )}
              {currentStyle === 'modern' && (
                <radialGradient id="modernGrad" cx="50%" cy="30%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#334155" />
                </radialGradient>
              )}
              {currentStyle === 'neon' && (
                <radialGradient id="neonGrad" cx="50%" cy="30%">
                  <stop offset="0%" stopColor="#1a1a2e" />
                  <stop offset="100%" stopColor="#16213e" />
                </radialGradient>
              )}
            </defs>

            <circle
              cx="160"
              cy="160"
              r="140"
              fill={
                currentStyle === 'midcentury' ? 'url(#midcenturyGrad)' :
                currentStyle === 'atomic' ? 'url(#atomicGrad)' :
                currentStyle === 'modern' ? 'url(#modernGrad)' :
                currentStyle === 'neon' ? 'url(#neonGrad)' :
                currentStyle === 'minimal' ? '#fafafa' : 'white'
              }
              stroke="none"
            />

            {/* Red sector shows remaining time - shrinks as time passes */}
            <path
              d={`M 160 160 L 160 20 A 140 140 0 ${sectorAngle > 180 ? 1 : 0} 1 ${
                160 + 140 * Math.sin((sectorAngle * Math.PI) / 180)
              } ${
                160 - 140 * Math.cos((sectorAngle * Math.PI) / 180)
              } Z`}
              fill={style.sectorColor}
              style={style.glowEffect ? { 
                filter: 'drop-shadow(0 0 15px currentColor)',
                opacity: 0.9 
              } : {}}
              className="transition-all duration-1000 ease-linear"
            />

            {/* Remove the white overlay - no longer needed since red sector shrinks directly */}

            {/* Enhanced tick marks with style variations */}
            {[...Array(60)].map((_, i) => {
              const angle = i * 6;
              const isHour = i % 5 === 0;
              
              // Different tick styles per theme
              let tickLength, tickWidth, tickOpacity;
              if (currentStyle === 'midcentury') {
                tickLength = isHour ? 20 : 10;
                tickWidth = isHour ? 3 : 1;
                tickOpacity = isHour ? 1 : 0.7;
              } else if (currentStyle === 'atomic') {
                tickLength = isHour ? 18 : 8;
                tickWidth = isHour ? 2 : 1;
                tickOpacity = isHour ? 1 : 0.8;
              } else if (currentStyle === 'minimal') {
                tickLength = isHour ? 12 : 6;
                tickWidth = isHour ? 1 : 0.5;
                tickOpacity = isHour ? 0.8 : 0.4;
              } else {
                tickLength = isHour ? 15 : 8;
                tickWidth = isHour ? 2 : 1;
                tickOpacity = 1;
              }
              
              const x1 = 160 + Math.sin((angle * Math.PI) / 180) * (140 - tickLength);
              const y1 = 160 - Math.cos((angle * Math.PI) / 180) * (140 - tickLength);
              const x2 = 160 + Math.sin((angle * Math.PI) / 180) * 140;
              const y2 = 160 - Math.cos((angle * Math.PI) / 180) * 140;

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={style.tickColor}
                  strokeWidth={tickWidth}
                  opacity={tickOpacity}
                  style={style.glowEffect && isHour ? { filter: 'drop-shadow(0 0 3px currentColor)' } : {}}
                />
              );
            })}

            {/* Enhanced number labels */}
            {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((num) => {
              const angle = (num * 6) - 90;
              const radius = currentStyle === 'midcentury' ? 105 : currentStyle === 'atomic' ? 108 : 110;
              const x = 160 + Math.cos((angle * Math.PI) / 180) * radius;
              const y = 160 + Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={
                    currentStyle === 'midcentury' ? "22" : 
                    currentStyle === 'minimal' ? "20" : 
                    currentStyle === 'atomic' ? "18" : "24"
                  }
                  fontWeight={
                    currentStyle === 'minimal' ? "500" : 
                    currentStyle === 'midcentury' ? "800" : "bold"
                  }
                  fill={style.numberColor}
                  fontFamily={
                    currentStyle === 'atomic' ? 'ui-monospace, monospace' :
                    currentStyle === 'modern' ? 'ui-sans-serif, system-ui' :
                    currentStyle === 'midcentury' ? 'serif' :
                    'inherit'
                  }
                  style={style.glowEffect ? { 
                    filter: 'drop-shadow(0 0 5px currentColor)',
                    textShadow: '0 0 10px currentColor'
                  } : {}}
                >
                  {num}
                </text>
              );
            })}

            {/* Enhanced center - no hand */}
            <circle 
              cx="160" 
              cy="160" 
              r={currentStyle === 'minimal' ? "4" : currentStyle === 'midcentury' ? "8" : "6"} 
              fill={style.handColor}
              style={style.glowEffect ? { filter: 'drop-shadow(0 0 8px currentColor)' } : {}}
            />
          </svg>
        </div>
      </div>

      {/* Digital Display */}
      <div className={`px-6 py-3 rounded-lg mb-6 ${currentStyle === 'modern' || currentStyle === 'neon' ? 'bg-gray-800' : 'bg-gray-800'}`}>
        <div className={`text-3xl font-mono font-bold ${currentStyle === 'neon' ? 'text-purple-300' : 'text-white'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Time Setting Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => updateTime(inputMinutes - 1)}
          className={`p-3 rounded-full transition-colors shadow-md ${
            currentStyle === 'modern' || currentStyle === 'neon'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          disabled={inputMinutes <= 1}
        >
          <Minus size={20} className={currentStyle === 'modern' || currentStyle === 'neon' ? 'text-gray-200' : 'text-gray-700'} />
        </button>
        
        <div className="flex flex-col items-center">
          <span className={`text-sm mb-1 font-medium ${currentStyle === 'modern' || currentStyle === 'neon' ? 'text-gray-300' : 'text-gray-600'}`}>
            Minutes
          </span>
          <input
            type="number"
            min="1"
            max="60"
            value={inputMinutes}
            onChange={(e) => updateTime(parseInt(e.target.value) || 1)}
            className={`w-20 px-3 py-2 rounded-lg text-center font-bold text-lg focus:outline-none ${
              currentStyle === 'modern' || currentStyle === 'neon'
                ? 'bg-gray-700 border-2 border-gray-600 text-white focus:border-purple-400'
                : 'bg-white border-2 border-gray-300 focus:border-red-400'
            }`}
            disabled={isRunning}
          />
        </div>

        <button
          onClick={() => updateTime(inputMinutes + 1)}
          className={`p-3 rounded-full transition-colors shadow-md ${
            currentStyle === 'modern' || currentStyle === 'neon'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          disabled={inputMinutes >= 60}
        >
          <Plus size={20} className={currentStyle === 'modern' || currentStyle === 'neon' ? 'text-gray-200' : 'text-gray-700'} />
        </button>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center gap-3 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg"
        >
          <RotateCcw size={24} />
          Reset
        </button>
      </div>

      {/* Status */}
      {timeLeft === 0 && (
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-red-500 animate-pulse mb-2">
            Time's Up! ⏰
          </div>
          <button
            onClick={() => playChime(currentStyle)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentStyle === 'modern' || currentStyle === 'neon'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            🔊 Play Chime Again
          </button>
        </div>
      )}

      {/* Quick Presets */}
      <div className={`rounded-xl p-4 shadow-md ${currentStyle === 'modern' || currentStyle === 'neon' ? 'bg-gray-800' : 'bg-white'}`}>
        <p className={`text-sm mb-3 text-center font-medium ${currentStyle === 'modern' || currentStyle === 'neon' ? 'text-gray-300' : 'text-gray-600'}`}>
          Quick Presets
        </p>
        <div className="flex gap-2">
          {[5, 15, 25, 45, 60].map(minutes => (
            <button
              key={minutes}
              onClick={() => updateTime(minutes)}
              disabled={isRunning}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                currentStyle === 'midcentury'
                  ? 'bg-orange-400 hover:bg-orange-500 text-white'
                  : currentStyle === 'atomic'
                  ? 'bg-teal-500 hover:bg-teal-600 text-white'
                  : currentStyle === 'modern'
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  : currentStyle === 'minimal'
                  ? 'bg-gray-800 hover:bg-gray-900 text-white'
                  : currentStyle === 'neon'
                  ? 'bg-pink-500 hover:bg-pink-600 text-white'
                  : 'bg-red-400 hover:bg-red-500 text-white'
              }`}
            >
              {minutes}m
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeTimer;