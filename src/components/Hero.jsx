import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import clsx from 'clsx';

const slides = [
    {
        id: 1,
        img: '/img2.webp',
        bgStart: '#7ABF9A',
        bgEnd: '#5E9F7D',
        title: 'NATURE',
        desc: 'organic flow.', // Shortened for tight layout
    },
    {
        id: 2,
        img: '/img1.webp',
        bgStart: '#D1B17E',
        bgEnd: '#B99764',
        title: 'EARTH',
        desc: 'solid ground.',
    },
    {
        id: 3,
        img: '/img3.webp',
        bgStart: '#A77BC8',
        bgEnd: '#8E63AF',
        title: 'MAGIC',
        desc: 'unknown power.',
    },
    {
        id: 4,
        img: '/img4.webp',
        bgStart: '#b9dcf3ff',
        bgEnd: '#AEBBB2',
        title: 'HAPPINESS',
        desc: 'joyful times.',
    },
    {
        id: 5,
        img: '/img5.webp',
        bgStart: '#f1e6bbff',
        bgEnd: '#c3eeabff',
        title: 'STRONG',
        desc: 'powerful times.',
    },
    {
        id: 6,
        img: '/img6.webp',
        bgStart: '#E1CBB2',
        bgEnd: '#9E7E5A',
        title: 'BEAUTY',
        desc: 'lovely times.',
    },
    {
        id: 7,
        img: '/img7.webp',
        bgStart: '#F7F6F2',
        bgEnd: '#B5C0B3',
        title: 'HEALTH',
        desc: 'strong body.',
    },

];

export default function Hero() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start start', 'end end'],
    });

    // Map scroll to many loops (e.g. 10 loops) to simulate infinity
    const scrollIndex = useTransform(scrollYProgress, [0, 1], [0, slides.length * 10]);
    const smoothIndex = useSpring(scrollIndex, {
        stiffness: 120,
        damping: 25,
        restDelta: 0.001
    });

    return (
        <section ref={targetRef} className="relative h-[2000vh] bg-neutral-900 font-sans">
            {/* Sticky Container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end">

                {/* Dynamic Backgrounds */}
                <div className="absolute inset-0 w-full h-full -z-20">
                    {slides.map((slide, i) => (
                        <BackgroundLayer
                            key={slide.id}
                            slide={slide}
                            index={i}
                            current={smoothIndex}
                            total={slides.length}
                        />
                    ))}
                </div>

                {/* Global Background Text - CARTOON */}
                <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center pointer-events-none -z-10">
                    <h1 className="text-[20vw] font-black text-white/50 tracking-tighter leading-none select-none uppercase scale-y-110">
                        Cartoon
                    </h1>
                </div>

                {/* Carousel Container */}
                <div className="relative w-full h-full flex items-end justify-center z-10 perspective-1000">
                    {slides.map((slide, i) => (
                        <CarouselSlide
                            key={slide.id}
                            slide={slide}
                            index={i}
                            current={smoothIndex}
                            total={slides.length}
                        />
                    ))}
                </div>

                {/* Sticky Bottom-Left Content */}
                <div className="absolute bottom-[10%] left-[10%] z-20 pointer-events-none">
                    {slides.map((slide, i) => (
                        <StickyInfo
                            key={slide.id}
                            slide={slide}
                            index={i}
                            current={smoothIndex}
                            total={slides.length}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}

function Indicator({ index, current }) {
    const opacity = useTransform(current, (val) => Math.abs(val - index) < 0.5 ? 1 : 0.4);
    return <motion.div style={{ opacity }} className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white/60 text-xs">←</motion.div>
}

// Distance Helper for modular arithmetic (shortest path on a circle)
const useModularDistance = (current, index, total) => {
    return useTransform(current, (val) => {
        const diff = index - val;
        // Calculates the shortest distance considering wrap-around
        // e.g. if total=3, index=0, val=2.9 (close to 3 which is 0) -> diff=-2.9 -> wrapped=+0.1
        const wrappedDiff = diff - total * Math.round(diff / total);
        return wrappedDiff;
    });
};

function StickyInfo({ slide, index, current, total }) {
    const dist = useModularDistance(current, index, total);
    // Absolute distance for opacity
    const absDist = useTransform(dist, (d) => Math.abs(d));
    const opacity = useTransform(absDist, [0, 0.3], [1, 0]);
    const y = useTransform(absDist, [0, 0.5], [0, 20]); // Slight slide up effect

    return (
        <motion.div
            style={{ opacity, y }}
            className="absolute bottom-0 left-0 min-w-[300px] text-left"
        >
            <h3 className="text-white/60 text-lg uppercase tracking-widest mb-1">Cartoon Character</h3>
            <h2 className="text-4xl font-bold text-white mb-2">{slide.title}</h2>
            <p className="text-white/80 text-sm max-w-[250px] leading-relaxed">
                {slide.desc}
            </p>
        </motion.div>
    );
}

function BackgroundLayer({ slide, index, current, total }) {
    const dist = useModularDistance(current, index, total);
    const opacity = useTransform(dist, [-0.5, 0, 0.5], [0, 1, 0]);

    return (
        <motion.div
            style={{ opacity }}
            className="absolute inset-0 w-full h-full"
        >
            <div
                className="w-full h-full bg-gradient-to-br"
                style={{
                    backgroundImage: `linear-gradient(to bottom right, ${slide.bgStart}, ${slide.bgEnd})`
                }}
            />
        </motion.div>
    );
}

function CarouselSlide({ slide, index, current, total }) {
    const distance = useModularDistance(current, index, total);

    // X Offset - using VW for responsiveness
    // 30vw spacing to keep mini side chars closer
    const x = useTransform(distance, (diff) => {
        return `${diff * 30}vw`;
    });

    // Scale
    const scale = useTransform(distance, (diff) => {
        const absDiff = Math.abs(diff);
        // Center: 1.85 (Huge), Sides: 0.5 (Mini)
        return 1.75 - (absDiff * 1.25);
    });

    // Clamp scale
    const clampedScale = useTransform(scale, (s) => Math.max(s, 0.4));

    // Y Position
    const y = useTransform(distance, (diff) => {
        const absDiff = Math.abs(diff);
        // Center: 0 (Anchored bottom)
        // Sides: Float up (-120px)
        return -Math.min(absDiff, 1) * 120;
    });

    // Blur & Opacity
    const blur = useTransform(distance, (diff) => {
        const absDiff = Math.abs(diff);
        // Reduced blur intensity
        return absDiff > 0.5 ? 4 : 0;
    });

    const opacity = useTransform(distance, (diff) => {
        const absDiff = Math.abs(diff);
        return 1 - (absDiff * 0.2);
    });

    const zIndex = useTransform(distance, (diff) => Math.round(100 - Math.abs(diff) * 10));

    return (
        <motion.div
            style={{
                x,
                y,
                scale: clampedScale,
                opacity,
                filter: useTransform(blur, (b) => `blur(${b}px)`),
                zIndex
            }}
            className="absolute bottom-0 flex flex-col items-center justify-end origin-bottom p-0"
        >
            <div className="relative">
                {/* Image Container - Base size 55vh to prevent top clipping when scaled x1.5 */}
                <motion.img
                    src={slide.img}
                    alt={slide.title}
                    className="h-[55vh] w-auto object-contain drop-shadow-2xl"
                    animate={{
                        y: [0, -15, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                    }}
                />
            </div>
        </motion.div>
    );
}
