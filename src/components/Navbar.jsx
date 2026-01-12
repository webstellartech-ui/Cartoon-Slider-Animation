import { motion } from 'framer-motion';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full px-12 py-8 flex justify-between items-center z-50 text-white">
            {/* Left: Brand / Menu Label */}
            <motion.div
                className="text-sm font-bold tracking-widest uppercase cursor-pointer"
                whileHover={{ scale: 1.05 }}
            >
                Cartoon.
            </motion.div>

            {/* Right: Hamburger Menu */}
            <motion.div
                className="flex flex-col gap-1.5 cursor-pointer group"
                whileHover="hover"
            >
                <motion.span
                    className="w-8 h-[2px] bg-white block"
                    variants={{
                        hover: { width: '24px' }
                    }}
                />
                <motion.span
                    className="w-8 h-[2px] bg-white block"
                    variants={{
                        hover: { width: '32px' }
                    }}
                />
            </motion.div>
        </nav>
    );
}
