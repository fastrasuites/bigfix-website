import type { VisionMissionSectionProps } from "../../types";
import InfoCardItem from "./InfoCardItem";

/**
 * Side-by-side vision and mission cards.
 */
const VisionMissionSection = ({
  cards,
}: VisionMissionSectionProps): JSX.Element => (
  <section className="w-full bg-[#F9F9F9] py-16 lg:py-[120px] px-4 md:px-8 lg:px-[140px]">
    <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-[40px]">
      {cards.map((card) => (
        <InfoCardItem key={card.title} card={card} />
      ))}
    </div>
  </section>
);

export default VisionMissionSection;