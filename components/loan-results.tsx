"use client"

import { useState } from "react"
import { ArrowLeft, Download, FileText, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

interface LoanResultsProps {
  loanType: string
  amount: number
  term: number
  interestRate: number
  amortizationType: string
  paymentFrequency: string
  includeInsurance: boolean
  includeCommission: boolean
  gracePeriod: number
  loanConfig: {
    minAmount: number
    maxAmount: number
    minTerm: number
    maxTerm: number
    baseRate: number
    insuranceRate: number
    commissionRate: number
    commissionType: string
  }
  onNewCalculation: () => void
}

interface PaymentRow {
  period: number
  payment: number
  principal: number
  interest: number
  insurance?: number
  balance: number
}

export function LoanResults({
  loanType,
  amount,
  term,
  interestRate,
  amortizationType,
  paymentFrequency,
  includeInsurance,
  includeCommission,
  gracePeriod,
  loanConfig,
  onNewCalculation,
}: LoanResultsProps) {
  const [activeTab, setActiveTab] = useState("table")

  // Convertir tasa anual a la frecuencia correspondiente
  let ratePerPeriod: number
  let periodsPerYear: number

  switch (paymentFrequency) {
    case "weekly":
      periodsPerYear = 52
      ratePerPeriod = interestRate / 100 / periodsPerYear
      break
    case "biweekly":
      periodsPerYear = 26
      ratePerPeriod = interestRate / 100 / periodsPerYear
      break
    case "monthly":
    default:
      periodsPerYear = 12
      ratePerPeriod = interestRate / 100 / periodsPerYear
      break
  }

  // Calcular número total de pagos
  const totalPeriods = term * (periodsPerYear / 12)

  // Calcular comisión por apertura
  const openingCommission = includeCommission ? amount * (loanConfig.commissionRate / 100) : 0

  // Calcular tabla de amortización
  const amortizationTable: PaymentRow[] = []
  let balance = amount

  if (amortizationType === "french") {
    // Sistema Francés (cuota fija)
    // Para período de gracia, calculamos primero los pagos de solo interés
    for (let i = 1; i <= gracePeriod * (periodsPerYear / 12); i++) {
      const interestPayment = balance * ratePerPeriod
      const insurancePayment = includeInsurance ? balance * (loanConfig.insuranceRate / 100 / periodsPerYear) : 0

      amortizationTable.push({
        period: i,
        payment: interestPayment + insurancePayment,
        principal: 0,
        interest: interestPayment,
        insurance: insurancePayment,
        balance: balance,
      })
    }

    // Luego calculamos los pagos normales con amortización
    if (totalPeriods > gracePeriod * (periodsPerYear / 12)) {
      const remainingPeriods = totalPeriods - gracePeriod * (periodsPerYear / 12)

      // Fórmula para calcular la cuota fija
      const fixedPayment =
        (balance * ratePerPeriod * Math.pow(1 + ratePerPeriod, remainingPeriods)) /
        (Math.pow(1 + ratePerPeriod, remainingPeriods) - 1)

      for (let i = gracePeriod * (periodsPerYear / 12) + 1; i <= totalPeriods; i++) {
        const interestPayment = balance * ratePerPeriod
        const principalPayment = fixedPayment - interestPayment
        const insurancePayment = includeInsurance ? balance * (loanConfig.insuranceRate / 100 / periodsPerYear) : 0

        balance -= principalPayment

        amortizationTable.push({
          period: i,
          payment: fixedPayment + insurancePayment,
          principal: principalPayment,
          interest: interestPayment,
          insurance: insurancePayment,
          balance: balance > 0 ? balance : 0,
        })
      }
    }
  } else {
    // Sistema Alemán (amortización constante)
    const remainingPeriods = totalPeriods - gracePeriod * (periodsPerYear / 12)
    const principalPayment = balance / remainingPeriods

    // Período de gracia (solo intereses)
    for (let i = 1; i <= gracePeriod * (periodsPerYear / 12); i++) {
      const interestPayment = balance * ratePerPeriod
      const insurancePayment = includeInsurance ? balance * (loanConfig.insuranceRate / 100 / periodsPerYear) : 0

      amortizationTable.push({
        period: i,
        payment: interestPayment + insurancePayment,
        principal: 0,
        interest: interestPayment,
        insurance: insurancePayment,
        balance: balance,
      })
    }

    // Pagos normales con amortización constante
    for (let i = gracePeriod * (periodsPerYear / 12) + 1; i <= totalPeriods; i++) {
      const interestPayment = balance * ratePerPeriod
      const insurancePayment = includeInsurance ? balance * (loanConfig.insuranceRate / 100 / periodsPerYear) : 0
      const payment = principalPayment + interestPayment + insurancePayment

      balance -= principalPayment

      amortizationTable.push({
        period: i,
        payment: payment,
        principal: principalPayment,
        interest: interestPayment,
        insurance: insurancePayment,
        balance: balance > 0 ? balance : 0,
      })
    }
  }

  // Calcular totales
  const totalPayment = amortizationTable.reduce((sum, row) => sum + row.payment, 0)
  const totalPrincipal = amortizationTable.reduce((sum, row) => sum + row.principal, 0)
  const totalInterest = amortizationTable.reduce((sum, row) => sum + row.interest, 0)
  const totalInsurance = includeInsurance ? amortizationTable.reduce((sum, row) => sum + (row.insurance || 0), 0) : 0

  // Calcular CAT (Costo Anual Total)
  const calculateCAT = () => {
    let cat = interestRate

    if (includeInsurance) {
      cat += loanConfig.insuranceRate * 12
    }

    if (includeCommission) {
      if (loanConfig.commissionType === "opening") {
        // Convertir comisión de apertura a tasa anual equivalente
        cat += (loanConfig.commissionRate / (term / 12)) * 100
      } else {
        cat += loanConfig.commissionRate * 12
      }
    }

    return cat.toFixed(2)
  }

  // Formatear montos como moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Obtener el nombre del tipo de préstamo
  const getLoanTypeName = () => {
    switch (loanType) {
      case "personal":
        return "Préstamo Personal"
      case "mortgage":
        return "Préstamo Hipotecario"
      case "auto":
        return "Préstamo Automotriz"
      case "business":
        return "Préstamo Empresarial"
      default:
        return "Préstamo"
    }
  }

  // Obtener el nombre de la frecuencia de pago
  const getFrequencyName = () => {
    switch (paymentFrequency) {
      case "weekly":
        return "Semanal"
      case "biweekly":
        return "Quincenal"
      case "monthly":
        return "Mensual"
      default:
        return "Mensual"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl">Resultados del Cálculo</CardTitle>
            <CardDescription>
              {getLoanTypeName()} con sistema de amortización {amortizationType === "french" ? "francés" : "alemán"}
            </CardDescription>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <Button variant="outline" size="sm" onClick={onNewCalculation}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Nuevo Cálculo
            </Button>
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
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Monto del Préstamo</h3>
            <p className="mt-1 text-xl font-medium">{formatCurrency(amount)}</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Plazo</h3>
            <p className="mt-1 text-xl font-medium">
              {term} meses
              <span className="block text-xs text-muted-foreground">
                {totalPeriods} pagos {getFrequencyName()}es
              </span>
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Tasa de Interés</h3>
            <p className="mt-1 text-xl font-medium">
              {interestRate}% anual
              <span className="block text-xs text-muted-foreground">
                {(interestRate / periodsPerYear).toFixed(2)}% {getFrequencyName()}
              </span>
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">CAT</h3>
            <p className="mt-1 text-xl font-medium">
              {calculateCAT()}%
              <span className="block text-xs text-muted-foreground">Sin IVA. Para fines informativos</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Pago {amortizationType === "french" ? "Fijo" : "Inicial"}
            </h3>
            <p className="mt-1 text-xl font-medium">{formatCurrency(amortizationTable[0].payment)}</p>
            {amortizationType === "german" && (
              <span className="block text-xs text-muted-foreground">(Disminuye con cada período)</span>
            )}
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total a Pagar</h3>
            <p className="mt-1 text-xl font-medium">{formatCurrency(totalPayment + openingCommission)}</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Intereses</h3>
            <p className="mt-1 text-xl font-medium">{formatCurrency(totalInterest)}</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {includeCommission ? "Comisión por Apertura" : "Costo Financiero"}
            </h3>
            <p className="mt-1 text-xl font-medium">
              {includeCommission ? formatCurrency(openingCommission) : formatCurrency(totalPayment - amount)}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="table">Tabla de Amortización</TabsTrigger>
              <TabsTrigger value="summary">Resumen</TabsTrigger>
              <TabsTrigger value="chart">Gráfico</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="table" className="mt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Capital</TableHead>
                    <TableHead>Interés</TableHead>
                    {includeInsurance && <TableHead>Seguro</TableHead>}
                    <TableHead>Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amortizationTable.slice(0, 12).map((row) => {
                    // Calcular fecha aproximada de pago
                    const paymentDate = new Date()
                    if (paymentFrequency === "weekly") {
                      paymentDate.setDate(paymentDate.getDate() + row.period * 7)
                    } else if (paymentFrequency === "biweekly") {
                      paymentDate.setDate(paymentDate.getDate() + row.period * 15)
                    } else {
                      paymentDate.setMonth(paymentDate.getMonth() + row.period)
                    }

                    return (
                      <TableRow key={row.period}>
                        <TableCell>{row.period}</TableCell>
                        <TableCell>{paymentDate.toLocaleDateString()}</TableCell>
                        <TableCell>{formatCurrency(row.payment)}</TableCell>
                        <TableCell>{formatCurrency(row.principal)}</TableCell>
                        <TableCell>{formatCurrency(row.interest)}</TableCell>
                        {includeInsurance && <TableCell>{formatCurrency(row.insurance || 0)}</TableCell>}
                        <TableCell>{formatCurrency(row.balance)}</TableCell>
                      </TableRow>
                    )
                  })}
                  {totalPeriods > 12 && (
                    <TableRow>
                      <TableCell colSpan={includeInsurance ? 7 : 6} className="text-center text-muted-foreground">
                        Mostrando los primeros 12 períodos de {totalPeriods}. Haz clic en "Ver Completo" para ver todos.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPeriods > 12 && (
              <div className="mt-4 text-center">
                <Button variant="outline">Ver Completo</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="summary" className="mt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Detalles del Préstamo</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo de Préstamo:</span>
                      <span className="font-medium">{getLoanTypeName()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monto Solicitado:</span>
                      <span className="font-medium">{formatCurrency(amount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plazo:</span>
                      <span className="font-medium">{term} meses</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sistema de Amortización:</span>
                      <span className="font-medium">
                        {amortizationType === "french" ? "Francés (cuota fija)" : "Alemán (amortización constante)"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frecuencia de Pago:</span>
                      <span className="font-medium">{getFrequencyName()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tasa de Interés:</span>
                      <span className="font-medium">{interestRate}% anual</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Período de Gracia:</span>
                      <span className="font-medium">
                        {gracePeriod > 0 ? `${gracePeriod} meses` : "Sin período de gracia"}
                      </span>
                    </div>
                    {includeInsurance && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Seguro:</span>
                          <span className="font-medium">{loanConfig.insuranceRate}% mensual sobre saldo</span>
                        </div>
                      </>
                    )}
                    {includeCommission && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Comisión por Apertura:</span>
                          <span className="font-medium">
                            {loanConfig.commissionRate}% ({formatCurrency(openingCommission)})
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Resumen de Pagos</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Pago {amortizationType === "french" ? "Fijo" : "Inicial"}:
                      </span>
                      <span className="font-medium">{formatCurrency(amortizationTable[0].payment)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pago Final:</span>
                      <span className="font-medium">
                        {formatCurrency(amortizationTable[amortizationTable.length - 1].payment)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Número de Pagos:</span>
                      <span className="font-medium">{totalPeriods}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total a Pagar:</span>
                      <span className="font-medium">{formatCurrency(totalPayment + openingCommission)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Capital:</span>
                      <span className="font-medium">{formatCurrency(totalPrincipal)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Intereses:</span>
                      <span className="font-medium">{formatCurrency(totalInterest)}</span>
                    </div>
                    {includeInsurance && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Seguro:</span>
                          <span className="font-medium">{formatCurrency(totalInsurance)}</span>
                        </div>
                      </>
                    )}
                    {includeCommission && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Comisión por Apertura:</span>
                          <span className="font-medium">{formatCurrency(openingCommission)}</span>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CAT (Costo Anual Total):</span>
                      <span className="font-medium">{calculateCAT()}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <h4 className="font-medium mb-2">
                  Características del Sistema {amortizationType === "french" ? "Francés" : "Alemán"}
                </h4>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {amortizationType === "french" ? (
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
          </TabsContent>

          <TabsContent value="chart" className="mt-4">
            <div className="rounded-md border p-6 text-center">
              <p className="text-muted-foreground">Gráfico de distribución de pagos no disponible en esta versión.</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onNewCalculation}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Nuevo Cálculo
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Guardar
            </Button>
            <Button>Solicitar Préstamo</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
