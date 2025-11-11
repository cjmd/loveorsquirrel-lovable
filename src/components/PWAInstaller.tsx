import { useEffect } from "react";
import { createPNGFromIcon } from "./PWAIcon";

export function PWAInstaller() {
  useEffect(() => {
    const setup = async () => {
      // Generate icon data URLs from the actual Figma icon
      const icon192 = await createPNGFromIcon(192);
      const icon512 = await createPNGFromIcon(512);
      const appleIcon = await createPNGFromIcon(180);

      // Try to register service worker (will work when deployed, not in Figma Make preview)
      if ("serviceWorker" in navigator) {
        try {
          // Try to register from /sw.js (will work when deployed)
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });

          console.log("✅ [PWA] Service Worker registered successfully!");
          console.log("[PWA] Scope:", registration.scope);

          // Handle updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("[PWA] New service worker available");
                }
              });
            }
          });
        } catch (swError) {
          console.log("ℹ️ [PWA] Service Worker not available in Figma Make preview");
          console.log("ℹ️ [PWA] This is expected - SW will work when deployed to Vercel/Netlify/etc.");
          console.log("ℹ️ [PWA] The app still works perfectly, just without offline caching");
        }
      }

      // Generate manifest dynamically with inline icon data
      const manifestData = {
        name: "love or squirrel",
        short_name: "love or squirrel",
        start_url: window.location.origin + "/",
        scope: window.location.origin + "/",
        display: "standalone",
        background_color: "#333333",
        theme_color: "#333333",
        orientation: "portrait",
        icons: [
          {
            src: icon192,
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: icon512,
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: icon192,
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: icon512,
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      };

      // Create blob URL for manifest
      const manifestBlob = new Blob([JSON.stringify(manifestData)], {
        type: "application/manifest+json",
      });
      const manifestUrl = URL.createObjectURL(manifestBlob);

      // Remove any existing manifest links
      const existingManifestLinks = document.querySelectorAll('link[rel="manifest"]');
      existingManifestLinks.forEach((link) => link.remove());

      // Add manifest link to head with blob URL
      const manifestLink = document.createElement("link");
      manifestLink.rel = "manifest";
      manifestLink.href = manifestUrl;
      document.head.appendChild(manifestLink);

      // Add theme color meta tag
      if (!document.querySelector('meta[name="theme-color"]')) {
        const themeColor = document.createElement("meta");
        themeColor.name = "theme-color";
        themeColor.content = "#333333";
        document.head.appendChild(themeColor);
      }

      // Add apple touch icon
      const existingAppleIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (existingAppleIcon) {
        existingAppleIcon.remove();
      }
      const appleTouchIcon = document.createElement("link");
      appleTouchIcon.rel = "apple-touch-icon";
      appleTouchIcon.href = appleIcon;
      document.head.appendChild(appleTouchIcon);

      // Add mobile web app capable for Android
      if (!document.querySelector('meta[name="mobile-web-app-capable"]')) {
        const mobileWebAppCapable = document.createElement("meta");
        mobileWebAppCapable.name = "mobile-web-app-capable";
        mobileWebAppCapable.content = "yes";
        document.head.appendChild(mobileWebAppCapable);
      }

      // Add apple meta tags
      if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
        const appleMobileWebAppCapable = document.createElement("meta");
        appleMobileWebAppCapable.name = "apple-mobile-web-app-capable";
        appleMobileWebAppCapable.content = "yes";
        document.head.appendChild(appleMobileWebAppCapable);
      }

      if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
        const appleMobileWebAppStatusBarStyle = document.createElement("meta");
        appleMobileWebAppStatusBarStyle.name = "apple-mobile-web-app-status-bar-style";
        appleMobileWebAppStatusBarStyle.content = "black";
        document.head.appendChild(appleMobileWebAppStatusBarStyle);
      }

      if (!document.querySelector('meta[name="apple-mobile-web-app-title"]')) {
        const appleMobileWebAppTitle = document.createElement("meta");
        appleMobileWebAppTitle.name = "apple-mobile-web-app-title";
        appleMobileWebAppTitle.content = "love or squirrel";
        document.head.appendChild(appleMobileWebAppTitle);
      }

      // Add viewport meta tag if not present
      if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement("meta");
        viewport.name = "viewport";
        viewport.content =
          "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover";
        document.head.appendChild(viewport);
      }
    };

    setup();
  }, []);

  return null;
}
