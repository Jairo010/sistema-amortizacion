"use client"

import type React from "react"

import { useState } from "react"
import { Calculator, Download, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ComparadorSistemas() {
  // Estados para los valores del formulario
  const [amount, setAmount] = useState(100000)
  const [term, setTerm] = useState(60)
  const [interestRate, setInterestRate] = useState(12.5)
  const [showResults, setShowResults] = useState(false)

  // Función para formatear montos como moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResults(true)
  }

  // Calcular resultados para ambos sistemas
  const calculateResults = () => {
    const monthlyRate = interestRate / 100 / 12

    // Sistema Francés
    const frenchResults = {
      firstPayment: 0,
      lastPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      payments: [] as { period: number; payment: number; principal: number; interest: number; balance: number }[],
    }

    // Sistema Alemán
    const germanResults = {
      firstPayment: 0,
      lastPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      payments: [] as { period: number; payment: number; principal: number; interest: number; balance: number }[],
    }

    // Calcular sistema francés
    let balance = amount
    const monthlyPayment =
      (amount * (monthlyRate * Math.pow(1 + monthlyRate, term))) / (Math.pow(1 + monthlyRate, term) - 1)

    for (let i = 1; i <= term; i++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      balance -= principalPayment

      frenchResults.payments.push({
        period: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance > 0 ? balance : 0,
      })
    }

    frenchResults.firstPayment = frenchResults.payments[0].payment
    frenchResults.lastPayment = frenchResults.payments[frenchResults.payments.length - 1].payment
    frenchResults.totalPayment = frenchResults.payments.reduce((sum, row) => sum + row.payment, 0)
    frenchResults.totalInterest = frenchResults.payments.reduce((sum, row) => sum + row.interest, 0)

    // Calcular sistema alemán
    balance = amount
    const principalPayment = amount / term

    for (let i = 1; i <= term; i++) {
      const interestPayment = balance * monthlyRate
      const payment = principalPayment + interestPayment
      balance -= principalPayment

      germanResults.payments.push({
        period: i,
        payment: payment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance > 0 ? balance : 0,
      })
    }

    germanResults.firstPayment = germanResults.payments[0].payment
    germanResults.lastPayment = germanResults.payments[germanResults.payments.length - 1].payment
    germanResults.totalPayment = germanResults.payments.reduce((sum, row) => sum + row.payment, 0)
    germanResults.totalInterest = germanResults.payments.reduce((sum, row) => sum + row.interest, 0)

    return { frenchResults, germanResults }
  }

  const results = calculateResults()

  return (
    <div>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="amount">Monto del Préstamo</Label>
                  <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                </div>
                <Slider
                  id="amount"
                  min={5000}
                  max={1000000}
                  step={1000}
                  value={[amount]}
                  onValueChange={(values) => setAmount(values[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(5000)}</span>
                  <span>{formatCurrency(1000000)}</span>
                </div>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value)
                    if (!isNaN(value)) {
                      setAmount(Math.min(Math.max(value, 5000), 1000000))
                    }
                  }}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="term">Plazo (meses)</Label>
                  <span className="text-sm font-medium">
                    {term} meses
                    {term >= 12 && ` (${Math.floor(term / 12)} años${term % 12 > 0 ? ` y ${term % 12} meses` : ""})`}
                  </span>
                </div>
                <Slider
                  id="term"
                  min={3}
                  max={360}
                  step={1}
                  value={[term]}
                  onValueChange={(values) => setTerm(values[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>3 meses</span>
                  <span>360 meses</span>
                </div>
                <Input
                  type="number"
                  value={term}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value)
                    if (!isNaN(value)) {
                      setTerm(Math.min(Math.max(value, 3), 360))
                    }
                  }}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="interest-rate">Tasa de Interés Anual (%)</Label>
                  <span className="text-sm font-medium">{interestRate}%</span>
                </div>
                <Slider
                  id="interest-rate"
                  min={5}
                  max={30}
                  step={0.1}
                  value={[interestRate]}
                  onValueChange={(values) => setInterestRate(values[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5%</span>
                  <span>30%</span>
                </div>
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value)
                    if (!isNaN(value)) {
                      setInterestRate(Math.min(Math.max(value, 5), 30))
                    }
                  }}
                  step="0.1"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button type="submit">
                <Calculator className="mr-2 h-4 w-4" />
                Comparar Sistemas
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showResults && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Sistema Francés</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Pago Mensual</h4>
                      <p className="mt-1 text-xl font-medium">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(results.frenchResults.firstPayment)}
                      </p>
                      <span className="text-xs text-muted-foreground">Cuota fija</span>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Total a Pagar</h4>
                      <p className="mt-1 text-xl font-medium">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(results.frenchResults.totalPayment)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Total Intereses</h4>
                      <p className="mt-1 text-xl font-medium">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(results.frenchResults.totalInterest)}
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Costo Financiero</h4>
                      <p className="mt-1 text-xl font-medium">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(results.frenchResults.totalPayment - amount)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Características</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Cuota fija durante toda la vida del préstamo</li>
                      <li>Al principio se paga más interés que capital</li>
                      <li>Con el tiempo, la proporción de capital aumenta y la de interés disminuye</li>
                      <li>Ideal para préstamos a largo plazo</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Sistema Alemán</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Primer Pago</h4>
                      <p className="mt-1 text-xl font-medium">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(results.germanResults.firstPayment)}
                      </p>
                      <span className="text-xs text-muted-foreground">Cuota decreciente</span>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Último Pago</h4>
                      <p className="mt-1 text-xl font-medium">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(results.germanResults.lastPayment)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Total a Pagar</h4>
                      <p className="mt-1 text-xl font-medium">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(results.germanResults.totalPayment)}
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Total Intereses</h4>
                      <p className="mt-1 text-xl font-medium">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(results.germanResults.totalInterest)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Características</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Amortización de capital constante</li>
                      <li>Cuota decreciente a lo largo del tiempo</li>
                      <li>Se paga más al principio y menos al final</li>
                      <li>Se pagan menos intereses totales que en el sistema francés</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Comparativa de Sistemas</h3>

              <Tabs defaultValue="table">
                <TabsList className="mb-4">
                  <TabsTrigger value="table">Tabla Comparativa</TabsTrigger>
                  <TabsTrigger value="chart">Gráfico</TabsTrigger>
                </TabsList>

                <TabsContent value="table">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Concepto</TableHead>
                          <TableHead>Sistema Francés</TableHead>
                          <TableHead>Sistema Alemán</TableHead>
                          <TableHead>Diferencia</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Primer Pago</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(results.frenchResults.firstPayment)}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(results.germanResults.firstPayment)}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(results.frenchResults.firstPayment - results.germanResults.firstPayment)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Último Pago</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(results.frenchResults.lastPayment)}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(results.germanResults.lastPayment)}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(results.frenchResults.lastPayment - results.germanResults.lastPayment)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Total a Pagar</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(results.frenchResults.totalPayment)}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(results.germanResults.totalPayment)}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(results.frenchResults.totalPayment - results.germanResults.totalPayment)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Total Intereses</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(results.frenchResults.totalInterest)}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(results.germanResults.totalInterest)}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(results.frenchResults.totalInterest - results.germanResults.totalInterest)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="chart">
                  <div className="rounded-md border p-6 text-center">
                    <p className="text-muted-foreground">Gráfico comparativo no disponible en esta versión.</p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-between">
                <div>
                  <h4 className="font-medium mb-2">Conclusión</h4>
                  <p className="text-sm text-muted-foreground">
                    {results.frenchResults.totalInterest > results.germanResults.totalInterest
                      ? "El sistema alemán resulta más económico en términos de intereses totales, pero requiere una mayor capacidad de pago al inicio del préstamo."
                      : "El sistema francés resulta más económico en términos de intereses totales, y ofrece cuotas fijas durante toda la vida del préstamo."}
                  </p>
                </div>
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
