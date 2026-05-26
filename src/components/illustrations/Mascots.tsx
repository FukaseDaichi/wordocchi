import type { SVGProps } from "react";

type MascotProps = SVGProps<SVGSVGElement>;

export function DogDetective({ className, ...props }: MascotProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      <defs>
        <radialGradient id="dog-shadow" cx="0.5" cy="1" r="0.6">
          <stop offset="0" stopColor="#3D2E1F" stopOpacity="0.12" />
          <stop offset="1" stopColor="#3D2E1F" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="48" cy="86" rx="28" ry="4" fill="url(#dog-shadow)" />
      <g transform="translate(8 12)">
        <path
          d="M16 36c0-14 13-26 30-26s30 12 30 26-12 24-30 24S16 50 16 36z"
          fill="#FFCB47"
        />
        <path
          d="M14 22c-2-8 4-14 10-14s8 4 8 10-6 12-10 14z"
          fill="#E36B6B"
        />
        <path
          d="M78 22c2-8-4-14-10-14s-8 4-8 10 6 12 10 14z"
          fill="#E36B6B"
        />
        <path
          d="M18 24c-1-5 2-9 5-9s5 3 5 7-3 8-5 9z"
          fill="#FBE3E0"
        />
        <path
          d="M74 24c1-5-2-9-5-9s-5 3-5 7 3 8 5 9z"
          fill="#FBE3E0"
        />
        <ellipse cx="30" cy="36" rx="6" ry="7" fill="#FFFBF0" />
        <ellipse cx="62" cy="36" rx="6" ry="7" fill="#FFFBF0" />
        <circle cx="31" cy="37" r="3" fill="#3D2E1F" />
        <circle cx="61" cy="37" r="3" fill="#3D2E1F" />
        <circle cx="32" cy="36" r="1" fill="#FFFBF0" />
        <circle cx="62" cy="36" r="1" fill="#FFFBF0" />
        <ellipse cx="46" cy="48" rx="6" ry="4" fill="#3D2E1F" />
        <path
          d="M46 52c-3 0-5 1-5 3s2 3 5 3 5-1 5-3-2-3-5-3z"
          fill="#3D2E1F"
        />
        <g transform="translate(60 10) rotate(18)">
          <ellipse cx="0" cy="0" rx="14" ry="10" fill="none" stroke="#3D2E1F" strokeWidth="3" />
          <line x1="14" y1="2" x2="22" y2="8" stroke="#3D2E1F" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

export function CatNotekeeper({ className, ...props }: MascotProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      <defs>
        <radialGradient id="cat-shadow" cx="0.5" cy="1" r="0.6">
          <stop offset="0" stopColor="#3D2E1F" stopOpacity="0.12" />
          <stop offset="1" stopColor="#3D2E1F" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="48" cy="86" rx="28" ry="4" fill="url(#cat-shadow)" />
      <g transform="translate(8 8)">
        <path
          d="M22 16l-6-8 14 4z"
          fill="#6BB8DB"
        />
        <path
          d="M58 16l6-8-14 4z"
          fill="#6BB8DB"
        />
        <path
          d="M40 12h0c14 0 26 10 26 24s-12 26-26 26S14 52 14 36 26 12 40 12z"
          fill="#6BB8DB"
        />
        <path
          d="M26 14l-4-6 10 3z"
          fill="#E4F4FA"
        />
        <path
          d="M54 14l4-6-10 3z"
          fill="#E4F4FA"
        />
        <ellipse cx="30" cy="34" rx="5" ry="6" fill="#FFFBF0" />
        <ellipse cx="50" cy="34" rx="5" ry="6" fill="#FFFBF0" />
        <ellipse cx="30" cy="34" rx="2" ry="4" fill="#3D2E1F" />
        <ellipse cx="50" cy="34" rx="2" ry="4" fill="#3D2E1F" />
        <path
          d="M38 46l4 4 4-4"
          stroke="#3D2E1F"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30 30c-4-2-8 0-8 0M50 30c4-2 8 0 8 0"
          stroke="#3D2E1F"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <g transform="translate(56 48) rotate(15)">
          <rect x="0" y="0" width="22" height="16" rx="2" fill="#FFFBF0" stroke="#3D2E1F" strokeWidth="1.5" />
          <line x1="3" y1="5" x2="18" y2="5" stroke="#7A6450" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="3" y1="9" x2="15" y2="9" stroke="#7A6450" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="3" y1="13" x2="17" y2="13" stroke="#7A6450" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

export function WordmarkSparkle({ className, ...props }: MascotProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      <path
        d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z"
        fill="currentColor"
      />
    </svg>
  );
}
