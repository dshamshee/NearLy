"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  // NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  console.log(session);

  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Services",
      link: "/services",
    },
    {
      name: "Contact Us",
      link: "/contact-us",
    },
  ];

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        {/* <NavbarLogo /> */}
        <h1 className="text-2xl font-bold flex items-center gap-1">
          <svg
            className="w-10 h-10 LogoIcon"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 15C30.67 15 15 30.67 15 50C15 65.45 25.02 78.55 39 83.33V72.58C30.94 68.49 25.5 60 25.5 50C25.5 36.47 36.47 25.5 50 25.5C63.53 25.5 74.5 36.47 74.5 50C74.5 60 69.06 68.49 61 72.58V83.33C74.98 78.55 85 65.45 85 50C85 30.67 69.33 15 50 15Z"
              fill="url(#paint0_linear)"
            />

            <path
              d="M42 40V60H46.5V51L53.5 60H58V40H53.5V49L46.5 40H42Z"
              fill="url(#paint1_linear)"
            />

            <circle cx="50" cy="88" r="6" fill="#FF8C00" />

            <defs>
              <linearGradient
                id="paint0_linear"
                x1="15"
                y1="15"
                x2="85"
                y2="85"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2DD4BF" />{" "}
                <stop offset="1" stopColor="#0891B2" />{" "}
              </linearGradient>
              <linearGradient
                id="paint1_linear"
                x1="42"
                y1="40"
                x2="58"
                y2="60"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FF8C00" />
                <stop offset="1" stopColor="#FF6900" />
              </linearGradient>
            </defs>
          </svg>
          <div className="text-xl">
            <span className="text-foreground">Near</span>
            <span className="text-orange-500">Ly</span>
          </div>
        </h1>
        <NavItems items={navItems} />
        <div className="flex items-center">
          {/* <NavbarButton variant="primary">Book a Service</NavbarButton> */}
          <NavbarButton variant="secondary">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavbarButton>
          <NavbarButton variant="secondary">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full w-full"
                    size="icon"
                  >
                    {session?.user?.avatar ? (
                      <Image
                        src={session?.user?.avatar || ""}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-[1.8rem] w-[1.8rem]" />
                    )}
                    <span className="sr-only">Profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    {session?.user?.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/c/profile/${session?.user?._id}`)
                    }
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="secondary" onClick={() => router.push("/login")}>
                Login
              </Button>
            )}
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <h1 className="text-2xl font-bold">
            <span className="text-foreground">Near</span>
            <span className="text-orange-500">Ly</span>
          </h1>
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Login
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Book a call
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

{
  /* Navbar */
}
{
  /* <DummyContent /> */
}
export const DummyContent = () => {
  return (
    <div className="container mx-auto p-8 pt-24">
      <h1 className="mb-4 text-center text-3xl font-bold">
        Check the navbar at the top of the container
      </h1>
      <p className="mb-10 text-center text-sm text-zinc-500">
        For demo purpose we have kept the position as{" "}
        <span className="font-medium">Sticky</span>. Keep in mind that this
        component is <span className="font-medium">fixed</span> and will not
        move when scrolling.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            id: 1,
            title: "The",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 2,
            title: "First",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 3,
            title: "Rule",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 4,
            title: "Of",
            width: "md:col-span-3",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 5,
            title: "F",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 6,
            title: "Club",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 7,
            title: "Is",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 8,
            title: "You",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 9,
            title: "Do NOT TALK about",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 10,
            title: "F Club",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
        ].map((box) => (
          <div
            key={box.id}
            className={`${box.width} ${box.height} ${box.bg} flex items-center justify-center rounded-lg p-4 shadow-sm`}
          >
            <h2 className="text-xl font-medium">{box.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};
