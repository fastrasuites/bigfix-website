import { isExternalUrl } from "../../utils/scroll";
import type { ApplicationsDropdownProps } from "../../types";

/**
 * Hover panel listing the BigFix business applications.
 */
const ApplicationsDropdown = ({
  applications,
}: ApplicationsDropdownProps): JSX.Element => (
  <div className="absolute top-[100%] left-[-100px] pt-4 z-50">
    <div className="absolute top-[10px] left-[130px] w-4 h-4 bg-[#F7F7F7] rotate-45 shadow-sm"></div>
    <div className="w-[423px] bg-[#F7F7F7] rounded-[10px] p-[32px] shadow-2xl flex flex-col gap-[10px] relative z-10">
      <div className="text-[#A8A8A8] text-[12px] font-medium uppercase tracking-[0.5px] leading-[150%] mb-2">
        Business Applications suite
      </div>
      <div className="flex flex-col gap-5">
        {applications.map((app) => (
          <a
            key={app.title}
            href={app.link}
            target={isExternalUrl(app.link) ? "_blank" : undefined}
            rel={isExternalUrl(app.link) ? "noopener noreferrer" : undefined}
            className="flex gap-3 items-start group cursor-pointer"
            onClick={app.onClick}
          >
            <div className="mt-1 flex-shrink-0">{app.icon}</div>
            <div className="flex flex-col gap-[2px]">
              <h4 className="text-[#1A1A1A] font-bold text-[16px] leading-tight group-hover:text-[#00B4D8] transition-colors">
                {app.title}
              </h4>
              <p className="text-[#00B4D8] font-medium text-[14px] leading-[150%]">
                {app.subtitle}
              </p>
              <p className="text-[#A8A8A8] font-normal text-[14px] leading-[150%] mt-0.5">
                {app.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default ApplicationsDropdown;