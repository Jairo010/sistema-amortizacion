import Link from "next/link"
import { Calculator, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5" />
              <span className="font-bold">Sistema de Préstamos</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Herramienta profesional para el cálculo y simulación de préstamos con sistemas de amortización francesa y
              alemana.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4">Herramientas</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Calculadora de Préstamos
                </Link>
              </li>
              <li>
                <Link href="/comparador" className="text-muted-foreground hover:text-foreground transition-colors">
                  Comparador de Sistemas
                </Link>
              </li>
              <li>
                <Link href="/client-access" className="text-muted-foreground hover:text-foreground transition-colors">
                  Consulta de Préstamos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Información</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sistema-frances" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sistema Francés
                </Link>
              </li>
              <li>
                <Link href="/sistema-aleman" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sistema Alemán
                </Link>
              </li>
              <li>
                <Link href="/glosario" className="text-muted-foreground hover:text-foreground transition-colors">
                  Glosario Financiero
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-foreground transition-colors">
                  Formulario de Contacto
                </Link>
              </li>
              <li className="text-muted-foreground">Email: info@sistemaprestamos.com</li>
              <li className="text-muted-foreground">Teléfono: +123 456 7890</li>
              <li className="flex items-center gap-4 mt-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Sistema de Préstamos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
