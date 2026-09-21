import OutlineIcon from "../common/OutlineIcon";
import { SHIELD_CHECK_ICON_PATH } from "../../constants/icons";
import { CLOUDONE_URL } from "../../constants/links";

/**
 * Left column of the CloudOne panel: positioning copy and the primary CTA.
 */
const CloudOneIntro = (): JSX.Element => (
  <div className="flex-1 flex flex-col gap-6 relative z-10 max-w-[500px]">
    <div className="flex items-center gap-[16px] mb-2">
      <div className="w-[48px] h-[48px] rounded-[12px] border border-[#E37016] flex items-center justify-center text-[#E37016] flex-shrink-0">
        <OutlineIcon
          path={SHIELD_CHECK_ICON_PATH}
          className="w-6 h-6"
          strokeWidth={1.5}
        />
      </div>
      <span className="text-[#E37016] font-semibold text-[16px] uppercase tracking-[-0.2px] leading-[24px]">
        NEED RELIABLE INFRASTRUCTURE FOR YOUR APPLICATIONS?
      </span>
    </div>

    <h2 className="text-[36px] md:text-[48px] font-bold text-[#F7F7F7] leading-[1.2] tracking-[0.2px]">
      CloudOne
    </h2>
    <p className="text-[18px] md:text-[20px] font-medium text-[#00B4D8] leading-[1.2] tracking-[0.2px]">
      Virtual Private Servers for Business and Development
    </p>
    <p className="text-[16px] text-[#F7F7F7] opacity-80 leading-[1.7] tracking-[0.2px] mb-4">
      CloudOne provides secure, high-performance virtual servers for hosting
      business applications, databases, websites, and development workloads.
    </p>

    <a
      href={CLOUDONE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#E37016] hover:bg-[#c96012] text-[#F7F7F7] font-semibold text-[16px] leading-[19.2px] tracking-[0.2px] px-[43px] py-[18px] rounded-[10px] transition-colors w-fit shadow-lg inline-block"
    >
      View VPS Hosting Plans
    </a>
  </div>
);

export default CloudOneIntro;