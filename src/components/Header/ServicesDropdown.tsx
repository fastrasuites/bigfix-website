import { Link, useLocation } from "react-router-dom";
import type { NavLink } from "../../types";

const ServicesDropdown = ({ services }: { services: NavLink[] }): JSX.Element => {
  const location = useLocation();
  return (
    <div className="absolute top-[100%] left-[-40px] pt-4 z-50">
      <div className="bg-white rounded-lg shadow-xl flex flex-col gap-[10px] relative z-10 min-w-[260px] py-4 px-5">
        <div className="flex flex-col gap-3">
          {services.map((service) => (
            <Link
              key={service.label}
              to={service.to}
              className={`text-[14px] font-medium transition-colors ${
                location.pathname === service.to
                  ? "text-[#00B4D8]"
                  : "text-[#1A1A1A] hover:text-[#00B4D8]"
              }`}
            >
              {service.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesDropdown;
