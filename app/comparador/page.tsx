import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ComparadorSistemas } from "@/components/comparador-sistemas"

export default function ComparadorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Comparador de Sistemas de Amortización</h1>
          <p className="text-center text-muted-foreground mb-8">
            Compara los sistemas de amortización francés y alemán para encontrar la mejor opción para tu préstamo
          </p>

          <ComparadorSistemas />
        </div>
      </main>
      <Footer />
    </div>
  )
}
