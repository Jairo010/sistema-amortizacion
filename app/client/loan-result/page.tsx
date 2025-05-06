"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoanCalculator } from "@/components/loan-calculator"

export default function LoanResult() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")

  const [loading, setLoading] = useState(true)

  // En un proyecto real, cargaríamos los datos del préstamo desde una API
  // Por ahora, simulamos datos de ejemplo
  const [loanData, setLoanData] = useState({
    clientName: "Juan Pérez",
    loanType: "Préstamo Personal",
    amount: 200000,
    term: 48,
    rate: 6.5,
    type: "french",
    date: "2023-05-01",
  })

  useEffect(() => {
    // Simulamos una carga de datos
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Cargando información del préstamo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/client-access"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver
          </Link>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl">Detalles del Préstamo</CardTitle>
                  <CardDescription>Código de acceso: {code}</CardDescription>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
                  <p className="mt-1 font-medium">{loanData.clientName}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Tipo de Préstamo</h3>
                  <p className="mt-1 font-medium">{loanData.loanType}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Fecha de Consulta</h3>
                  <p className="mt-1 font-medium">{new Date(loanData.date).toLocaleDateString()}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Sistema</h3>
                  <p className="mt-1 font-medium">{loanData.type === "french" ? "Francés" : "Alemán"}</p>
                </div>
              </div>

              <LoanCalculator
                amount={loanData.amount}
                term={loanData.term}
                rate={loanData.rate}
                type={loanData.type as string}
              />

              <div className="rounded-lg border bg-muted/30 p-4">
                <h3 className="mb-2 font-medium">Información Importante</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Esta simulación es solo informativa y no constituye una oferta de préstamo.</li>
                  <li>Las tasas y condiciones pueden variar según la evaluación crediticia.</li>
                  <li>Para más información, contacte a su asesor financiero.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Sistema de Préstamos. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
