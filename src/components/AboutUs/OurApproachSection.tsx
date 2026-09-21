import type { OurApproachSectionProps } from "../../types";
import ApproachCardItem from "./ApproachCardItem";
import ApproachStats from "./ApproachStats";

/**
 * "Our Approach" section: rationale copy, capability cards and the stats row.
 */
const OurApproachSection = ({
  cards,
  stats,
}: OurApproachSectionProps): JSX.Element => (
  <section className="w-full bg-[#F9F9F9] py-16 lg:py-[120px] px-4 md:px-8 lg:px-[140px]">
    <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-[100px]">
      {/* Left Column: Text */}
      <div className="flex-1 max-w-[510px] flex flex-col gap-6">
        <span className="text-[#E37016] font-semibold text-[16px] leading-[24px] tracking-[-0.2px] uppercase">
          Our Approach
        </span>
        <h2 className="text-[36px] md:text-[48px] font-bold leading-[1.1] tracking-[0.2px] text-[#0A2F5A]">
          Practical Technology. <br />
          <span className="text-[#00B4D8]">Built for Real Operations.</span>
        </h2>
        <div className="flex flex-col gap-6 text-[16px] lg:text-[20px] text-[#1A1A1ACC] leading-[1.6] tracking-[0.2px] mt-2">
          <p>
            Businesses have different processes, requirements, and challenges.
            We don't believe technology should be designed around a
            one-size-fits-all model.
          </p>
          <p>
            Our solutions are built to address specific operational needs while
            giving businesses the flexibility to adapt and grow.
          </p>
          <p>
            From business applications to cloud infrastructure, we focus on
            making technology useful, reliable, and relevant to the
            organizations that depend on it.
          </p>
        </div>
      </div>

      {/* Right Column: Cards & Stats */}
      <div className="flex-1 max-w-[590px] flex flex-col gap-[26px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[26px]">
          {cards.map((card) => (
            <ApproachCardItem key={card.title} card={card} />
          ))}
        </div>

        <ApproachStats stats={stats} />
      </div>
    </div>
  </section>
);

export default OurApproachSection;