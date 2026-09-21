import { useCallback, useState } from "react";

export interface NavigationState {
  isDropdownOpen: boolean;
  isMobileMenuOpen: boolean;
  setDropdownOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;
}

/**
 * Owns the header menu state shared by every page: the "Business Applications"
 * dropdown and the mobile menu.
 */
export const useNavigationState = (): NavigationState => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = useCallback((): void => {
    setIsMobileMenuOpen((isOpen) => !isOpen);
  }, []);

  return {
    isDropdownOpen,
    isMobileMenuOpen,
    setDropdownOpen: setIsDropdownOpen,
    toggleMobileMenu,
  };
};