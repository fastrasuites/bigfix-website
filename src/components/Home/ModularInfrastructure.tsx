import type { ModularInfrastructureProps } from "../../types";

/**
 * "Why Modular Infrastructure Works" section: intro copy plus the product
 * cards that link out to each application.
 */
const ModularInfrastructure = ({
  eyebrow,
  titleLine1,
  titleLine2,
  paragraphs,
  cards,
}: ModularInfrastructureProps): JSX.Element => (
  <section className="w-full bg-[#0A2F5A] py-16 lg:py-[120px] px-4 md:px-8 lg:px-[140px]">
    <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-10">
      <div className="flex-1 max-w-[535px] flex flex-col gap-6">
        <span className="text-[#E37016] font-semibold text-[16px] uppercase tracking-[-0.2px] leading-[24px]">
          {eyebrow}
        </span>
        <h2 className="text-[32px] lg:text-[40px] font-bold leading-[1.2] lg:leading-[1] tracking-[0.2px] text-white">
          {titleLine1} <br className="hidden lg:block" />
          <span className="text-[#00B4D8]">{titleLine2}</span>
        </h2>
        <div className="flex flex-col gap-6 text-[16px] lg:text-[18px] text-[#A8A8A8] leading-[1.7] lg:leading-[30px] tracking-[0.2px]">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-[542px] flex flex-col gap-[24px]">
        {cards.map((card) => (
          <a
            key={card.title}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#FFFFFF1A] border-[0.5px] border-[#F7F7F780] rounded-[10px] p-[24px] flex items-center gap-[24px] backdrop-blur-sm hover:bg-[#FFFFFF26] transition-colors cursor-pointer"
            onClick={card.onClick}
          >
            <div className="w-10 h-10 rounded-[4px] bg-[#FFFFFF1A] border-[1.5px] border-[#00B4D8] flex items-center justify-center text-[#00B4D8] flex-shrink-0">
              {card.icon}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-bold text-[#F7F7F7] leading-[1] tracking-[-0.2px]">
                {card.title}
              </h3>
              <p className="text-[14px] text-[#F7F7F7] leading-[24px] tracking-[-0.2px]">
                {card.subtitle}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default ModularInfrastructure;
