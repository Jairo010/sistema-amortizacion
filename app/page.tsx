import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LoanCalculatorForm } from "@/components/loan-calculator-form"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Calculadora de Préstamos</h1>
          <p className="text-center text-muted-foreground mb-8">
            Simula tu préstamo con nuestro calculador y conoce las cuotas mensuales según el sistema de amortización que
            elijas
          </p>

          <LoanCalculatorForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
