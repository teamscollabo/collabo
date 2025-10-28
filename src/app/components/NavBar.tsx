"use client";

import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-[#0f0a19]/70 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center w-full justify-between">

        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="relative h-16 w-48 rounded-lg  overflow-hidden">
            <Image
              src="/LogoImage.png"
              alt="Collabo Logo"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </Link>

        <div className="flex w-full max-w-lg justify-between">
          {/* <NavLink href="/ourTeam">Our Team</NavLink> */}
          {/* <NavLink href="/aboutUs">About Us</NavLink>
          <NavLink href="https://github.com">Github</NavLink> */}
        </div>

      </div>
    </header>
  );
}
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
        href={href}
        className="
        px-3 py-2 rounded-md text-lg font-bold tracking-tight
        text-white transition-all duration-300
        hover:bg-clip-text hover:text-transparent
        hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-600"
        >
        {children}
    </Link>

  )
}
