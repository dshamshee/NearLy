import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Link from "next/link";

const iconClass =
  "size-5 text-muted-foreground transition-colors hover:text-foreground";

export const Footer = () => {
  return (
    <footer className="border-t border-border ">
      <div className="mainContainer flex flex-col items-center justify-center gap-1 px-4 py-4">
        <nav
          className="flex flex-wrap items-center justify-center gap-3"
          aria-label="Social links"
        >
          <Link
            href="https://github.com/dshamshee"
            className="rounded-full p-1.5 outline-offset-2 hover:bg-muted/80 focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="GitHub"
          >
            <IconBrandGithub className={iconClass} aria-hidden />
          </Link>
          <Link
            href="#"
            className="rounded-full p-1.5 outline-offset-2 hover:bg-muted/80 focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="X"
          >
            <IconBrandX className={iconClass} aria-hidden />
          </Link>
          {/* <Link
            href="#"
            className="rounded-full p-1.5 outline-offset-2 hover:bg-muted/80 focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Instagram"
          >
            <IconBrandInstagram className={iconClass} aria-hidden />
          </Link> */}
          <Link
            href="https://linkedin.com/in/danish-shamshee"
            className="rounded-full p-1.5 outline-offset-2 hover:bg-muted/80 focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="LinkedIn"
          >
            <IconBrandLinkedin className={iconClass} aria-hidden />
          </Link>
        </nav>
        <p className="text-center text-xs text-muted-foreground sm:text-sm">
          © {new Date().getFullYear()} NearLy. All rights reserved.
        </p>
        <p className="text-center text-xs text-muted-foreground sm:text-xs">Developed by Danish Shamshee</p>
      </div>
    </footer>
  );
};
