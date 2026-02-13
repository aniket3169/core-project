"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="px-5 sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <span className="text-lg font-bold text-white">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Home</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 md:flex">
            <Link
              href="/home"
              className="rounded-lg px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              AQI
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              About
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden items-center space-x-3 md:flex">
            {!session ? (
              <>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="rounded-lg px-5 py-2 font-medium text-gray-700 transition-all hover:bg-gray-100"
                >
                  Log In
                </button>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => signOut()}
                  className="rounded-lg px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Logout
                </button>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-200 transition-all hover:ring-4 hover:ring-blue-500/30"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user?.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600">
                        <span className="text-sm font-bold text-white">
                          {session.user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white shadow-xl">
                      <div className="p-4">
                        <p className="font-semibold text-gray-900">{session.user?.name || "User"}</p>
                        <p className="text-sm text-gray-500">{session.user?.email}</p>
                      </div>
                      <div className="border-t border-gray-100">
                        <Link
                          href="/profile"
                          className="block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Profile Settings
                        </Link>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            signOut();
                          }}
                          className="block w-full px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            {session?.user?.image && (
              <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-gray-200">
                <Image
                  src={session.user.image}
                  alt={session.user?.name || "User"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/aqi"
              className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AQI
            </Link>
            <Link
              href="/pricing"
              className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>

            {!session ? (
              <>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="mt-2 block w-full rounded-lg px-3 py-2 text-left font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Log In
                </button>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="mt-2 block w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-center font-semibold text-white shadow-lg"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                <Link
                  href="/dashboard"
                  className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut();
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}