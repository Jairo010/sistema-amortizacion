"use client"

import { useState } from "react"
import { Download, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LoanCalculatorProps {
  amount: number
  term: number
  rate: number
  type: string
}

interface PaymentRow {
  period: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export function LoanCalculator({ amount, term, rate, type }: LoanCalculatorProps) {
  const [activeTab, setActiveTab] = useState("table")

  // Convertir tasa anual a mensual
  const monthlyRate = rate / 100 / 12

  // Calcular tabla de amortización
  const amortizationTable: PaymentRow[] = []
  let balance = amount

  if (type === "french") {
    // Sistema Francés (cuota fija)
    const monthlyPayment =
      (amount * (monthlyRate * Math.pow(1 + monthlyRate, term))) / (Math.pow(1 + monthlyRate, term) - 1)

    for (let i = 1; i <= term; i++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      balance -= principalPayment

      amortizationTable.push({
        period: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance > 0 ? balance : 0,
      })
    }
  } else {
    // Sistema Alemán (amortización constante)
    const principalPayment = amount / term

    for (let i = 1; i <= term; i++) {
      const interestPayment = balance * monthlyRate
      const payment = principalPayment + interestPayment
      balance -= principalPayment

      amortizationTable.push({
        period: i,
        payment: payment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance > 0 ? balance : 0,
      })
    }
  }

  // Calcular totales
  const totalPayment = amortizationTable.reduce((sum, row) => sum + row.payment, 0)
  const totalInterest = amortizationTable.reduce((sum, row) => sum + row.interest, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Pago {type === "french" ? "Mensual" : "Inicial"}
            </div>
            <div className="mt-1 text-2xl font-bold">${amortizationTable[0].payment.toFixed(2)}</div>
            {type === "german" && (
              <div className="mt-1 text-xs text-muted-foreground">(Disminuye con cada período)</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Total a Pagar</div>
            <div className="mt-1 text-2xl font-bold">${totalPayment.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Total Intereses</div>
            <div className="mt-1 text-2xl font-bold">${totalInterest.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="table">Tabla de Amortización</TabsTrigger>
            <TabsTrigger value="summary">Resumen</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <TabsContent value="table" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Cuota</TableHead>
                  <TableHead>Capital</TableHead>
                  <TableHead>Interés</TableHead>
                  <TableHead>Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amortizationTable.slice(0, 12).map((row) => (
                  <TableRow key={row.period}>
                    <TableCell>{row.period}</TableCell>
                    <TableCell>${row.payment.toFixed(2)}</TableCell>
                    <TableCell>${row.principal.toFixed(2)}</TableCell>
                    <TableCell>${row.interest.toFixed(2)}</TableCell>
                    <TableCell>${row.balance.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {term > 12 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Mostrando los primeros 12 períodos de {term}. Haz clic en "Ver Completo" para ver todos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {term > 12 && (
            <div className="mt-4 text-center">
              <Button variant="outline">Ver Completo</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Resumen del Préstamo</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Sistema de Amortización</p>
                    <p className="font-medium">
                      {type === "french" ? "Francés (cuota fija)" : "Alemán (amortización constante)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monto del Préstamo</p>
                    <p className="font-medium">${amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plazo</p>
                    <p className="font-medium">{term} meses</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tasa de Interés</p>
                    <p className="font-medium">
                      {rate}% anual ({(rate / 12).toFixed(2)}% mensual)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total a Pagar</p>
                    <p className="font-medium">${totalPayment.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Intereses</p>
                    <p className="font-medium">${totalInterest.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="mb-2 font-medium">
                    Características del Sistema {type === "french" ? "Francés" : "Alemán"}
                  </h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {type === "french" ? (
                      <>
                        <li>Cuota fija durante toda la vida del préstamo</li>
                        <li>Al principio se paga más interés que capital</li>
                        <li>Con el tiempo, la proporción de capital aumenta y la de interés disminuye</li>
                        <li>Ideal para préstamos a largo plazo</li>
                      </>
                    ) : (
                      <>
                        <li>Amortización de capital constante</li>
                        <li>Cuota decreciente a lo largo del tiempo</li>
                        <li>Se paga más al principio y menos al final</li>
                        <li>Se pagan menos intereses totales que en el sistema francés</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
