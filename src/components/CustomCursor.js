import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hidden, setHidden] = useState(true);
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);

    useEffect(() => {
        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setHidden(false);
        };

        const onMouseDown = () => setClicked(true);
        const onMouseUp = () => setClicked(false);
        const onMouseLeave = () => setHidden(true);
        const onMouseEnter = () => setHidden(false);

        const onLinkHoverStart = () => setLinkHovered(true);
        const onLinkHoverEnd = () => setLinkHovered(false);

        window.addEventListener('mousemove', updatePosition);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.body.addEventListener('mouseleave', onMouseLeave);
        document.body.addEventListener('mouseenter', onMouseEnter);

        // Add event listeners to all links and buttons
        const handleLinkHover = () => {
            const links = document.querySelectorAll('a, button, .cursor-pointer');
            links.forEach(link => {
                link.addEventListener('mouseenter', onLinkHoverStart);
                link.addEventListener('mouseleave', onLinkHoverEnd);
            });
        };

        handleLinkHover();
        // Re-run whenever DOM triggers movement (rough check)
        window.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                setLinkHovered(true);
            } else {
                setLinkHovered(false);
            }
        });

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.body.removeEventListener('mouseleave', onMouseLeave);
            document.body.removeEventListener('mouseenter', onMouseEnter);
        };
    }, []);

    // Only show on non-touch devices
    if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) return null;

    return (
        <div
            className={`fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference transition-opacity duration-300 ${hidden ? 'opacity-0' : 'opacity-100'}`}
            style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            }}
        >
            {/* Main Dot */}
            <div className={`
                absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold transition-all duration-300 ease-out
                ${clicked ? 'w-3 h-3' : 'w-2 h-2'}
                ${linkHovered ? 'scale-0' : 'scale-100'}
            `}></div>

            {/* Trailing Ring */}
            <div className={`
                absolute -translate-x-1/2 -translate-y-1/2 border border-white rounded-full transition-all duration-500 ease-out
                ${clicked ? 'scale-75' : 'scale-100'}
                ${linkHovered ? 'w-12 h-12 bg-white/10 border-gold' : 'w-8 h-8 opacity-50'}
            `}></div>
        </div>
    );
}
