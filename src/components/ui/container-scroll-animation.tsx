import React from "react";

/**
 * The card tilts back and scales, then straightens as the section scrolls into view, while the
 * title rises. Same geometry as the original framer-motion component (rotateX 20° → 0, scale
 * 1.05 → 1, or 0.7 → 0.9 on phones, title up 100 px), but driven by CSS scroll-driven animations
 * (`animation-timeline: view()`), so the compositor runs it and no JavaScript works on each scroll
 * frame. Browsers without scroll timelines show the card straight; reduced motion does too.
 * Styles: `.cs-*` in globals.css.
 */
export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="cs-root h-[44rem] md:h-[60rem] flex items-center justify-center relative p-2 md:p-20">
      <div className="py-10 md:py-24 w-full relative" style={{ perspective: "1000px" }}>
        <Header titleComponent={titleComponent} />
        <Card>{children}</Card>
      </div>
    </div>
  );
};

export const Header = ({ titleComponent }: { titleComponent: string | React.ReactNode }) => {
  return <div className="cs-header div max-w-5xl mx-auto text-center">{titleComponent}</div>;
};

export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="cs-card max-w-4xl -mt-8 mx-auto h-[22rem] md:h-[32rem] w-full border-4 border-[#1f3a29] p-2 md:p-4 bg-[#0a170e] rounded-[26px]"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-black md:rounded-2xl">{children}</div>
    </div>
  );
};
