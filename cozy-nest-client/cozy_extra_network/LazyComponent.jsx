import React, {useEffect, useRef, useState} from "react";

export const LazyComponent = ({children, placeholderClassName}) => {
    const [isInView, setIsInView] = useState(false);
    const targetRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            {
                root: null, // use viewport as root
                rootMargin: '0px',
                threshold: 0.1, // percentage of element's visibility needed to trigger the callback
            }
        );

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => {
            if (targetRef.current) {
                observer.unobserve(targetRef.current);
            }
        };
    }, []);

    return (
        <div ref={targetRef}>
            {isInView ? children : <div className={placeholderClassName}>blank</div>}
        </div>
    );
};