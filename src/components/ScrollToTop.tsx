import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [pathname]);
    return null;
};

export default ScrollToTop;