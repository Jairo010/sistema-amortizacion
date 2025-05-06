import Link from "next/link"
import { Calculator, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <span className="font-bold">Sistema de Préstamos</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Calculadora
            </Link>
            <Link
              href="/comparador"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Comparador
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary p-0"
                >
                  Información
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/sistema-frances">Sistema Francés</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/sistema-aleman">Sistema Alemán</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/glosario">Glosario Financiero</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/contacto"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contacto
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/client-access">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <FileText className="mr-2 h-4 w-4" />
              Consultar Préstamo
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm">Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
