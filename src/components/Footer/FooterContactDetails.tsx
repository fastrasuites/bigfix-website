import type { FooterContactDetailsProps } from "../../types";

/**
 * Address, phone and email block rendered in the first footer column.
 */
const FooterContactDetails = ({
  contact,
}: FooterContactDetailsProps): JSX.Element => (
  <div className="flex flex-col gap-4 text-[14px] text-[#F7F7F7] mt-2">
    <a
      href={contact.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 items-start group hover:text-[#00B4D8] transition-colors"
    >
      <svg
        className="w-4 h-4 mt-1 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01"
        />
      </svg>
      <div className="flex flex-col gap-1">
        <span className="group-hover:underline">{contact.address}</span>
        <span className="text-[12px] text-[#C4C4C4]">
          {contact.addressHours}
        </span>
      </div>
    </a>

    <div className="flex gap-3 items-start">
      <svg
        className="w-4 h-4 mt-1 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        />
      </svg>
      <div className="flex flex-col gap-1">
        <span>{contact.phone1}</span>
        <span>{contact.phone2}</span>
      </div>
    </div>

    <div className="flex gap-3 items-center">
      <svg
        className="w-4 h-4 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        />
        <polyline points="22,6 12,13 2,6" />
      </svg>
      <span>{contact.email}</span>
    </div>
  </div>
);

export default FooterContactDetails;