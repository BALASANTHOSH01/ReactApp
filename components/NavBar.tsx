"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Book, Menu, X, LogOut, Home, FileText, Settings } from "lucide-react"
import { useAuth } from "@/hook/useAuth"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await signOut()
    setIsMenuOpen(false)
    router.push("/auth")
  }

  useEffect(() => {
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  const NavLink = ({
    href,
    children,
    icon: Icon,
  }: {
    href: string
    children: React.ReactNode
    icon: React.ElementType
  }) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className={`flex items-center px-4 py-3 rounded-md text-base font-medium ${
          isActive ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
        } transition-all duration-300 ease-in-out transform hover:scale-105`}
      >
        <Icon className="w-6 h-6 mr-3" />
        {children}
      </Link>
    )
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur-sm shadow-md" : "bg-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <Book className="h-10 w-10 text-white group-hover:text-zinc-300 transition-colors duration-300" />
              <span className="ml-3 text-white font-bold text-xl group-hover:text-zinc-300 transition-colors duration-300">
                StudyHub
              </span>
            </Link>
          </motion.div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <NavLink href="/" icon={Home}>
                Home
              </NavLink>
              <NavLink href="/materials" icon={FileText}>
                Study Materials
              </NavLink>
              {user && user.user_metadata?.role === "admin" && (
                <NavLink href="/admin" icon={Settings}>
                  Admin
                </NavLink>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 py-3 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <LogOut className="h-6 w-6 mr-3" />
                  Logout
                </button>
              ) : (
                <NavLink href="/auth" icon={LogOut}>
                  Login
                </NavLink>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-white transition-all duration-300 ease-in-out transform hover:scale-110"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-8 w-8" /> : <Menu className="block h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink href="/" icon={Home}>
                Home
              </NavLink>
              <NavLink href="/materials" icon={FileText}>
                Study Materials
              </NavLink>
              {user && user.user_metadata?.role === "admin" && (
                <NavLink href="/admin" icon={Settings}>
                  Admin
                </NavLink>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 py-3 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <LogOut className="h-6 w-6 mr-3" />
                  Logout
                </button>
              ) : (
                <NavLink href="/auth" icon={LogOut}>
                  Login
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

