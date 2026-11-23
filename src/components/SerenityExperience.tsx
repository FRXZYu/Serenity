import {useEffect, useMemo, useRef, useState} from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {X} from 'lucide-react';
import {
  EMBLEM_ELEMENTS,
  SERENITY_NAME_MEANING,
  SERENITY_WORDMARK,
  type EmblemElement,
  type SerenitySymbolId,
} from '../data/serenityContent';
import {ResilientEmblemImage} from './ResilientEmblemImage';

interface SelectedOverlay {
  id: SerenitySymbolId;
  title: string;
  shortMeaning: string;
  image: string;
  glowColor: string;
  isWordmark?: boolean;
}

export function SerenityExperience() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [viewport, setViewport] = useState({w: 390, h: 844});
  const [isSeparated, setIsSeparated] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<SelectedOverlay | null>(null);

  useEffect(() => {
    const update = () => {
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Close overlay on Escape
  useEffect(() => {
    if (!activeOverlay) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveOverlay(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeOverlay]);

  const {scrollYProgress} = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.35,
  });

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const separated = latest >= 0.45;
    if (separated !== isSeparated) {
      setIsSeparated(separated);
    }
  });

  // Responsive geometry for ALL mobile screens (320px - 430px+) and desktop preview
  const geometry = useMemo(() => {
    const effectiveW = Math.min(viewport.w, 430);
    const emblemW = Math.min(effectiveW * 0.52, viewport.h * 0.28, 210);
    const emblemH = emblemW * (1419 / 1097);

    const spreadX = Math.min(effectiveW * 0.23, 98);
    const spreadYTop = Math.min(viewport.h * 0.145, 112);
    const spreadYBottom = Math.min(viewport.h * 0.13, 102);

    // Initial center offsets of each piece relative to the emblem container center
    const initCenters: Record<EmblemElement['id'], {cx: number; cy: number}> = {
      cometa: {cx: -0.24 * emblemW, cy: -0.33 * emblemH},
      galaxia: {cx: -0.004 * emblemW, cy: -0.01 * emblemH},
      silueta: {cx: -0.065 * emblemW, cy: -0.03 * emblemH},
      estrella: {cx: -0.04 * emblemW, cy: 0.245 * emblemH},
    };

    const targetCenters: Record<EmblemElement['id'], {tx: number; ty: number}> = {
      cometa: {tx: -spreadX, ty: -spreadYTop},
      galaxia: {tx: spreadX, ty: -spreadYTop},
      silueta: {tx: -spreadX, ty: spreadYBottom},
      estrella: {tx: spreadX, ty: spreadYBottom},
    };

    const deltas = {
      cometa: {
        dx: targetCenters.cometa.tx - initCenters.cometa.cx,
        dy: targetCenters.cometa.ty - initCenters.cometa.cy,
      },
      galaxia: {
        dx: targetCenters.galaxia.tx - initCenters.galaxia.cx,
        dy: targetCenters.galaxia.ty - initCenters.galaxia.cy,
      },
      silueta: {
        dx: targetCenters.silueta.tx - initCenters.silueta.cx,
        dy: targetCenters.silueta.ty - initCenters.silueta.cy,
      },
      estrella: {
        dx: targetCenters.estrella.tx - initCenters.estrella.cx,
        dy: targetCenters.estrella.ty - initCenters.estrella.cy,
      },
    };

    return {emblemW, emblemH, deltas};
  }, [viewport]);

  // Wordmark glides smoothly upward slightly as icons spread out
  const wordmarkY = useTransform(smoothProgress, [0, 0.72], [0, -18]);
  const wordmarkScale = useTransform(smoothProgress, [0, 0.72], [1, 0.86]);
  const wordmarkOpacity = useTransform(smoothProgress, [0, 0.72], [1, 0.88]);

  // Subtle closing whisper fades in only after deconstruction settles
  const whisperOpacity = useTransform(smoothProgress, [0.58, 0.82], [0, 1]);
  const whisperY = useTransform(smoothProgress, [0.58, 0.82], [12, 0]);

  // Per-element scroll trajectories: unified (0) -> separated icons (0.72 -> 1)
  const cometaX = useTransform(smoothProgress, [0, 0.72], [0, geometry.deltas.cometa.dx]);
  const cometaY = useTransform(smoothProgress, [0, 0.72], [0, geometry.deltas.cometa.dy]);
  const cometaScale = useTransform(smoothProgress, [0, 0.72], [1, 1.16]);
  const cometaRotate = useTransform(smoothProgress, [0, 0.35, 0.72], [0, -8, 0]);

  const galaxiaX = useTransform(smoothProgress, [0, 0.72], [0, geometry.deltas.galaxia.dx]);
  const galaxiaY = useTransform(smoothProgress, [0, 0.72], [0, geometry.deltas.galaxia.dy]);
  const galaxiaScale = useTransform(smoothProgress, [0, 0.72], [1, 0.66]);
  const galaxiaRotate = useTransform(smoothProgress, [0, 0.35, 0.72], [0, 10, 0]);

  const siluetaX = useTransform(smoothProgress, [0, 0.72], [0, geometry.deltas.silueta.dx]);
  const siluetaY = useTransform(smoothProgress, [0, 0.72], [0, geometry.deltas.silueta.dy]);
  const siluetaScale = useTransform(smoothProgress, [0, 0.72], [1, 0.8]);
  const siluetaRotate = useTransform(smoothProgress, [0, 0.35, 0.72], [0, -4, 0]);

  const estrellaX = useTransform(smoothProgress, [0, 0.72], [0, geometry.deltas.estrella.dx]);
  const estrellaY = useTransform(smoothProgress, [0, 0.72], [0, geometry.deltas.estrella.dy]);
  const estrellaScale = useTransform(smoothProgress, [0, 0.72], [1, 1.16]);
  const estrellaRotate = useTransform(smoothProgress, [0, 0.35, 0.72], [0, 14, 0]);

  const motionMap = {
    cometa: {x: cometaX, y: cometaY, scale: cometaScale, rotate: cometaRotate},
    galaxia: {x: galaxiaX, y: galaxiaY, scale: galaxiaScale, rotate: galaxiaRotate},
    silueta: {x: siluetaX, y: siluetaY, scale: siluetaScale, rotate: siluetaRotate},
    estrella: {x: estrellaX, y: estrellaY, scale: estrellaScale, rotate: estrellaRotate},
  };

  const openElementOverlay = (el: EmblemElement) => {
    if (!isSeparated && !prefersReducedMotion) {
      // Smoothly scroll down to reveal the separated icons if tapped while unified
      const stage = stageRef.current;
      if (stage) {
        const span = Math.max(0, stage.offsetHeight - window.innerHeight);
        window.scrollTo({top: stage.offsetTop + span * 0.85, behavior: 'smooth'});
      }
      return;
    }

    setActiveOverlay({
      id: el.id,
      title: el.title,
      shortMeaning: el.shortMeaning,
      image: el.image,
      glowColor: el.glowColor,
    });
  };

  const openWordmarkOverlay = () => {
    setActiveOverlay({
      id: SERENITY_NAME_MEANING.id,
      title: SERENITY_NAME_MEANING.title,
      shortMeaning: SERENITY_NAME_MEANING.shortMeaning,
      image: SERENITY_NAME_MEANING.image,
      glowColor: SERENITY_NAME_MEANING.glowColor,
      isWordmark: true,
    });
  };

  // Render order: Galaxia -> Silueta -> Cometa -> Estrella
  const orderedIds: EmblemElement['id'][] = ['galaxia', 'silueta', 'cometa', 'estrella'];

  if (prefersReducedMotion) {
    return (
      <main className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[430px] flex-col items-center justify-between px-6 py-12 pt-safe pb-safe">
        <button
          type="button"
          onClick={openWordmarkOverlay}
          aria-label="Significado de Serenity"
          className="focus-visible:outline-2 focus-visible:outline-[#d900ff]"
        >
          <ResilientEmblemImage
            src={SERENITY_WORDMARK}
            alt="Serenity"
            className="h-auto w-[210px] object-contain"
          />
        </button>

        <div className="grid grid-cols-2 items-center justify-items-center gap-8 py-8">
          {EMBLEM_ELEMENTS.map((el) => (
            <button
              key={el.id}
              type="button"
              onClick={() => openElementOverlay(el)}
              aria-label={el.title}
              className="flex min-h-[88px] min-w-[88px] items-center justify-center p-2 transition-transform active:scale-95"
            >
              <ResilientEmblemImage
                src={el.image}
                alt={el.title}
                className="h-24 w-24 object-contain"
              />
            </button>
          ))}
        </div>

        <p className="text-center font-serif text-base italic text-[#b4a6cc]">
          Tienes un brillo único e irrepetible en esta galaxia.
        </p>

        <SymbolBlurOverlay overlay={activeOverlay} onClose={() => setActiveOverlay(null)} />
      </main>
    );
  }

  return (
    <>
      <main
        ref={stageRef}
        className="relative z-10 mx-auto h-[175dvh] w-full max-w-[440px]"
      >
        <div className="sticky top-0 flex h-[100dvh] w-full flex-col items-center justify-between overflow-hidden px-5 pb-8 pt-10 pt-safe pb-safe sm:pb-10 sm:pt-12">
          {/* Top: Official Serenity Wordmark Logo */}
          <motion.button
            type="button"
            onClick={openWordmarkOverlay}
            aria-label="Significado de Serenity"
            style={{y: wordmarkY, scale: wordmarkScale, opacity: wordmarkOpacity}}
            className="relative z-20 flex min-h-[44px] items-center justify-center focus-visible:outline-2 focus-visible:outline-[#d900ff]"
          >
            <ResilientEmblemImage
              src={SERENITY_WORDMARK}
              alt="Serenity"
              className="h-auto w-[205px] object-contain drop-shadow-[0_0_24px_rgba(245,240,252,0.14)] sm:w-[235px]"
            />
          </motion.button>

          {/* Center: Unified Emblem composed strictly of the 4 assets -> Deconstructs into ONLY the 4 icons */}
          <div className="relative flex flex-1 w-full items-center justify-center">
            <div
              style={{
                width: `${geometry.emblemW}px`,
                height: `${geometry.emblemH}px`,
              }}
              className="relative"
            >
              {orderedIds.map((id) => {
                const el = EMBLEM_ELEMENTS.find((item) => item.id === id)!;
                const m = motionMap[id];
                const idleFloat =
                  id === 'estrella'
                    ? {scale: [1, 1.045, 1]}
                    : id === 'cometa'
                      ? {x: [0, -2, 0], y: [0, 2, 0]}
                      : id === 'silueta'
                        ? {y: [0, -2.5, 0]}
                        : {rotate: [-1, 1, -1]};

                const dropShadowClass =
                  id === 'estrella'
                    ? 'drop-shadow-[0_0_22px_rgba(217,0,255,0.85)]'
                    : id === 'galaxia'
                      ? 'brightness-125 drop-shadow-[0_0_16px_rgba(142,68,236,0.8)]'
                      : id === 'cometa'
                        ? 'drop-shadow-[0_0_14px_rgba(220,238,255,0.4)]'
                        : 'drop-shadow-[0_0_12px_rgba(233,226,245,0.22)]';

                return (
                  <motion.div
                    key={el.id}
                    style={{
                      left: el.layout.left,
                      top: el.layout.top,
                      width: el.layout.width,
                      x: m.x,
                      y: m.y,
                      scale: m.scale,
                      rotate: m.rotate,
                    }}
                    className="absolute origin-center"
                  >
                    <motion.button
                      type="button"
                      onClick={() => openElementOverlay(el)}
                      aria-label={el.title}
                      animate={idleFloat}
                      transition={{
                        duration: id === 'estrella' ? 4 : 7,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      whileTap={{scale: 0.94}}
                      className="group relative block w-full cursor-pointer p-2 -m-2 focus-visible:outline-2 focus-visible:outline-[#d900ff]"
                    >
                      <ResilientEmblemImage
                        src={el.image}
                        alt={el.title}
                        className={`h-auto w-full object-contain transition-transform duration-200 ${
                          isSeparated ? 'group-hover:scale-105' : ''
                        } ${dropShadowClass}`}
                      />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom: Single quiet line once icons separate */}
          <motion.p
            style={{opacity: whisperOpacity, y: whisperY}}
            className="relative z-10 max-w-[280px] text-center font-serif text-[15px] italic leading-relaxed text-[#b4a6cc] sm:text-base"
          >
            Tienes un brillo único e irrepetible en esta galaxia.
          </motion.p>
        </div>
      </main>

      <SymbolBlurOverlay overlay={activeOverlay} onClose={() => setActiveOverlay(null)} />
    </>
  );
}

interface SymbolBlurOverlayProps {
  overlay: SelectedOverlay | null;
  onClose: () => void;
}

function SymbolBlurOverlay({overlay, onClose}: SymbolBlurOverlayProps) {
  return (
    <AnimatePresence>
      {overlay ? (
        <motion.div
          key={overlay.id}
          role="dialog"
          aria-modal="true"
          aria-labelledby="overlay-symbol-title"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.24, ease: [0.16, 1, 0.3, 1]}}
          onClick={onClose}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#040208]/72 px-7 backdrop-blur-2xl"
        >
          {/* Minimal Close Affordance */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#b4a6cc] transition-colors hover:text-[#f5f0fc] focus-visible:outline-2 focus-visible:outline-[#d900ff] pt-safe"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Overlaid Element + Short Poetic Meaning */}
          <motion.div
            initial={{opacity: 0, scale: 0.86, y: 14}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.9, y: 10}}
            transition={{duration: 0.28, ease: [0.16, 1, 0.3, 1]}}
            className="relative flex max-w-[320px] flex-col items-center text-center"
          >
            <div className="relative flex items-center justify-center">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute h-44 w-44 rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${overlay.glowColor} 0%, rgba(4,2,8,0) 72%)`,
                }}
              />
              <ResilientEmblemImage
                src={overlay.image}
                alt={overlay.title}
                className={
                  overlay.isWordmark
                    ? 'relative h-auto w-[220px] object-contain'
                    : 'relative h-[155px] w-[155px] object-contain sm:h-[175px] sm:w-[175px]'
                }
              />
            </div>

            <h2
              id="overlay-symbol-title"
              className="mt-7 font-serif text-3xl font-semibold tracking-tight text-[#f5f0fc]"
            >
              {overlay.title}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#cfc4e3] [text-wrap:balance]">
              {overlay.shortMeaning}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
