// "use client";

// import { motion } from "framer-motion";
// import type { Doc } from "@/convex/_generated/dataModel";
// import { getCvLayoutMeta, type CvLayoutId } from "@/lib/layouts";
// import { CenteredLayout } from "./cv-layouts/centered";
// import { SidebarPhotoLayout } from "./cv-layouts/sidebar-photo";
// import { SplitBannerLayout } from "./cv-layouts/split-banner";
// import { MinimalAtsLayout } from "./cv-layouts/minimal-ats";
// import type { CvLayoutProps } from "./cv-layouts/types";
// import { JSX } from "react";
// import { GraphStatsLayout } from "./cv-layouts/graph-stats";
// import { useInterludeAudio } from "@/hooks/use-interlude-audio";
// import { InterludeAudioToggle } from "@/app/components/interlude-audio-toggle";

// /**
//  * One entry per CvLayoutId in lib/layouts.ts. Adding a 5th layout means
//  * adding one line here (plus registering the matching PDF builder in
//  * lib/pdf-layouts/index.ts) — nothing else in the app needs to know
//  * layouts exist.
//  */
// const LAYOUT_COMPONENTS: Record<
//   CvLayoutId,
//   (props: CvLayoutProps) => JSX.Element
// > = {
//   centered: CenteredLayout,
//   "sidebar-photo": SidebarPhotoLayout,
//   "split-banner": SplitBannerLayout,
//   "minimal-ats": MinimalAtsLayout,
//   "graph-stats": GraphStatsLayout,
// };

// export function CvAnimatedView({
//   cv,
//   version,
//   pdfUrl, // add this
// }: {
//   cv: Doc<"cvs">;
//   version: Doc<"cvVersions">;
//   pdfUrl?: string; // add this
// }) {
//   const { fullName } = cv.personalInfo;
//   const resolvedPdfUrl = pdfUrl ?? `/api/cv/${cv.shareId}/pdf`; // add this

//   const { muted, toggleMute } = useInterludeAudio(true);

//   if (cv.status === "generating" || cv.status === "draft") {
//     return (
//       <div className="max-w-3xl mx-auto py-20 px-4 text-center">
//         <InterludeAudioToggle muted={muted} onToggle={toggleMute} />
//         <motion.div
//           animate={{ opacity: [0.4, 1, 0.4] }}
//           transition={{ duration: 2.4, repeat: Infinity }}
//           className="text-muted-foreground"
//         >
//           Generating {fullName}&apos;s CV...
//         </motion.div>
//       </div>
//     );
//   }

//   if (cv.status === "failed") {
//     return (
//       <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-2">
//         <p className="text-lg font-medium">
//           Something went wrong generating this CV.
//         </p>
//         {cv.generationError && (
//           <p className="text-sm text-muted-foreground">{cv.generationError}</p>
//         )}
//       </div>
//     );
//   }

//   const layoutId = getCvLayoutMeta(version.layout).id;
//   const Layout = LAYOUT_COMPONENTS[layoutId] ?? CenteredLayout;

//   return (
//     <>
//       <InterludeAudioToggle muted={muted} onToggle={toggleMute} />
//       <Layout cv={cv} version={version} pdfUrl={resolvedPdfUrl} />{" "}
//       {/* pass it down */}
//     </>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Doc } from "@/convex/_generated/dataModel";
import { getCvLayoutMeta, type CvLayoutId } from "@/lib/layouts";
import { CenteredLayout } from "./cv-layouts/centered";
import { SidebarPhotoLayout } from "./cv-layouts/sidebar-photo";
import { SplitBannerLayout } from "./cv-layouts/split-banner";
import { MinimalAtsLayout } from "./cv-layouts/minimal-ats";
import type { CvLayoutProps } from "./cv-layouts/types";
import { JSX } from "react";
import { GraphStatsLayout } from "./cv-layouts/graph-stats";
import { useInterludeAudio } from "@/hooks/use-interlude-audio";
import { InterludeAudioToggle } from "@/app/components/interlude-audio-toggle";

const LAYOUT_COMPONENTS: Record<
  CvLayoutId,
  (props: CvLayoutProps) => JSX.Element
> = {
  centered: CenteredLayout,
  "sidebar-photo": SidebarPhotoLayout,
  "split-banner": SplitBannerLayout,
  "minimal-ats": MinimalAtsLayout,
  "graph-stats": GraphStatsLayout,
};

export function CvAnimatedView({
  cv,
  version,
  pdfUrl,
  // Only the public /cv/[shareId] page sets this. Creation modal and
  // history preview never pass it, so they keep autoplaying immediately.
  deferAutoplay = false,
}: {
  cv: Doc<"cvs">;
  version: Doc<"cvVersions">;
  pdfUrl?: string;
  deferAutoplay?: boolean;
}) {
  const { fullName } = cv.personalInfo;
  const resolvedPdfUrl = pdfUrl ?? `/api/cv/${cv.shareId}/pdf`;

  const { muted, toggleMute, triggerPlay } = useInterludeAudio(true, {
    trigger: deferAutoplay ? "interaction" : "immediate",
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!deferAutoplay) return;
    // First scroll anywhere on the window arms playback. Browsers don't
    // always treat "scroll" as a sound-unlocking gesture, so this may
    // silently fall back to muted — the click handler below always works.
    const onScroll = () => triggerPlay();
    window.addEventListener("scroll", onScroll, { once: true, passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [deferAutoplay, triggerPlay]);

  const handleClick = () => {
    if (deferAutoplay) triggerPlay();
  };

  if (cv.status === "generating" || cv.status === "draft") {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <InterludeAudioToggle muted={muted} onToggle={toggleMute} />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="text-muted-foreground"
        >
          Generating {fullName}&apos;s CV...
        </motion.div>
      </div>
    );
  }

  if (cv.status === "failed") {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-2">
        <p className="text-lg font-medium">
          Something went wrong generating this CV.
        </p>
        {cv.generationError && (
          <p className="text-sm text-muted-foreground">{cv.generationError}</p>
        )}
      </div>
    );
  }

  const layoutId = getCvLayoutMeta(version.layout).id;
  const Layout = LAYOUT_COMPONENTS[layoutId] ?? CenteredLayout;

  return (
    // className="contents" keeps this div out of the layout tree (no
    // extra box), while still giving us a click target to arm playback.
    <div ref={containerRef} onClick={handleClick} className="contents">
      <InterludeAudioToggle muted={muted} onToggle={toggleMute} />
      <Layout cv={cv} version={version} pdfUrl={resolvedPdfUrl} />
    </div>
  );
}
