import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component
 * - Listens to route changes and scrolls the window to the top.
 * - Must be rendered inside a <BrowserRouter> so useLocation() works.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use instant scroll; replace with behavior: 'smooth' if you prefer smooth scrolling
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
