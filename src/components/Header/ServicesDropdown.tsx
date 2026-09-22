import type { NavLink } from "../../types";

/**
 * Services dropdown panel: white background, rounded corners, shadow.
 */
const ServicesDropdown = ({ services }: { services: NavLink[] }): JSX.Element => (
  <div className="absolute top-[100%] left-[-40px] pt-4 z-50">
    <div className="bg-white rounded-lg shadow-xl flex flex-col gap-[10px] relative z-10 min-w-[260px] py-4 px-5">
      <div className="flex flex-col gap-3">
        {services.map((service) => (
          <a
            key={service.label}
            href={service.to}
            className="text-[#1A1A1A] text-[14px] font-medium hover:text-[#00B4D8] transition-colors"
          >
            {service.label}
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default ServicesDropdown;
