const Ritual = () => {
  return (
    <div>
      <svg
        width="1600"
        height="900"
        viewBox="0 0 1600 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="55" />
          </filter>
      
          <filter id="heavyBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="90" />
          </filter>
      
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.22" />
            </feComponentTransfer>
          </filter>
      
          <linearGradient id="baseGradient" x1="0" y1="0" x2="1600" y2="900">
            <stop offset="0%" stop-color="#A77C6B" />
            <stop offset="35%" stop-color="#B89687" />
            <stop offset="70%" stop-color="#171715" />
            <stop offset="100%" stop-color="#171715" />
          </linearGradient>
        </defs>
      
        <rect width="1600" height="900" fill="url(#baseGradient)" />
      
        <path
          d="M-132 207C-32 70 151 -56 346 -2C541 52 604 173 786 173C968 173 1103 74 1278 90C1453 106 1590 201 1696 319V-106H-132V207Z"
          fill="#A77C6B"
          opacity="0.9"
          filter="url(#heavyBlur)"
        />
      
        <path
          d="M-111 416C62 271 193 252 359 334C525 416 619 513 808 466C997 419 1028 289 1219 265C1410 241 1569 315 1704 429V-33H-111V416Z"
          fill="#171715"
          opacity="0.82"
          filter="url(#heavyBlur)"
        />
      
        <path
          d="M-80 734C77 549 254 486 435 547C616 608 677 771 867 776C1057 781 1180 618 1365 603C1550 588 1649 714 1710 811V1014H-80V734Z"
          fill="#D8C9BD"
          opacity="0.75"
          filter="url(#heavyBlur)"
        />
      
        <path
          d="M399 493C476 331 675 253 873 275C1071 297 1264 424 1250 567C1236 710 1037 785 843 754C649 723 322 655 399 493Z"
          fill="#C8AFA2"
          opacity="0.7"
          filter="url(#softBlur)"
        />
      
        <path
          d="M1024 577C1125 438 1303 365 1478 422C1653 479 1746 621 1699 754C1652 887 1437 926 1254 866C1071 806 923 716 1024 577Z"
          fill="#171715"
          opacity="0.78"
          filter="url(#heavyBlur)"
        />
      
        <path
          d="M-83 857C48 704 219 621 380 660C541 699 616 823 765 825C914 827 1036 721 1197 728C1358 735 1497 828 1589 944H-83V857Z"
          fill="#B89687"
          opacity="0.6"
          filter="url(#heavyBlur)"
        />
      
        <path
          d="M-83 105C30 6 192 -26 349 39C506 104 552 220 716 225C880 230 1000 122 1177 114C1354 106 1514 175 1685 305V-103H-83V105Z"
          fill="#A77C6B"
          opacity="0.48"
          filter="url(#softBlur)"
        />
      
        <path
          d="M336 341C398 239 535 202 662 238C789 274 850 363 797 455C744 547 594 569 469 522C344 475 274 443 336 341Z"
          fill="#171715"
          opacity="0.65"
          filter="url(#softBlur)"
        />
      
        <path
          d="M1052 258C1149 170 1322 155 1456 231C1590 307 1621 443 1515 510C1409 577 1235 535 1119 457C1003 379 955 346 1052 258Z"
          fill="#D8C9BD"
          opacity="0.35"
          filter="url(#heavyBlur)"
        />
      
        <rect width="1600" height="900" filter="url(#grain)" opacity="0.26" />
      
        <rect
          width="1600"
          height="900"
          fill="#171715"
          opacity="0.14"
        />
      </svg>
    </div>
  )
}

export default Ritual;