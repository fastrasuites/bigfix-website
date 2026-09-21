import { Fragment } from "react";
import { isExternalUrl } from "../../utils/scroll";
import type { SolutionDetailsProps } from "../../types";

/**
 * Expanded accordion content: the titled paragraphs separated by vertical
 * dividers, plus the explore link.
 */
const SolutionDetails = ({ solution }: SolutionDetailsProps): JSX.Element => (
  <div className="w-full p-6 lg:p-[32px] pt-0 flex flex-col gap-[24px]">
    <div className="w-full flex flex-col md:flex-row gap-8 md:gap-[24px] relative">
      {solution.content.map((column, index) => (
        <Fragment key={column.title}>
          <div className="flex-1 flex flex-col gap-[16px]">
            <div className="flex items-center gap-[8px]">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: solution.color }}
              ></div>
              <span
                className="text-[14px] font-semibold uppercase tracking-[-0.2px] leading-[1]"
                style={{ color: solution.color }}
              >
                {column.title}
              </span>
            </div>
            <p className="text-[14px] font-normal text-[#0A2F5A] leading-[1.5] tracking-[-0.2px]">
              {column.text}
            </p>
          </div>
          {index < solution.content.length - 1 && (
            <div className="hidden md:block w-[1px] bg-[#A8A8A8] mx-4"></div>
          )}
        </Fragment>
      ))}
    </div>
    <div className="mt-4 md:mt-8">
      <a
        href={solution.link}
        target={isExternalUrl(solution.link) ? "_blank" : undefined}
        rel={isExternalUrl(solution.link) ? "noopener noreferrer" : undefined}
        className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#0A2F5A] hover:text-[#00B4D8] transition-colors group"
        onClick={solution.onClick}
      >
        {solution.exploreLink}
      </a>
    </div>
  </div>
);

export default SolutionDetails;