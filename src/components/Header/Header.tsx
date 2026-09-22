import type { HeaderProps } from "../../types";
import DesktopNav from "./DesktopNav";
import HeaderLogo from "./HeaderLogo";
import MobileNav from "./MobileNav";

/**
 * Site header: logo, desktop navigation, mobile menu trigger and the mobile
 * menu panel.
 */
const Header = ({
  logoSrc,
  navApplications,
  services,
  isDropdownOpen,
  isServicesOpen,
  isMobileMenuOpen,
  onDropdownChange,
  onServicesChange,
  onBookDemo,
  onMobileMenuToggle,
  tagline,
  mobileLinks,
}: HeaderProps): JSX.Element => (
  <nav className="w-full flex justify-center py-4 lg:py-[24px] px-4 md:px-8 lg:px-[94px] bg-[#0A192F] relative z-50 border-b border-white/10 lg:border-none">
    <div className="w-full max-w-[1252px] flex justify-between items-center h-[72px]">
      <HeaderLogo logoSrc={logoSrc} tagline={tagline} />

      <DesktopNav
        applications={navApplications}
        services={services}
        isDropdownOpen={isDropdownOpen}
        isServicesOpen={isServicesOpen}
        onDropdownChange={onDropdownChange}
        onServicesChange={onServicesChange}
        onBookDemo={onBookDemo}
      />

      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-white p-2"
          onClick={onMobileMenuToggle}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
    </div>

    {isMobileMenuOpen && (
      <MobileNav
        applications={navApplications}
        services={services}
        isDropdownOpen={isDropdownOpen}
        isServicesOpen={isServicesOpen}
        onDropdownChange={onDropdownChange}
        onServicesChange={onServicesChange}
        onBookDemo={onBookDemo}
        extraLinks={mobileLinks}
      />
    )}
  </nav>
);

export default Header;
