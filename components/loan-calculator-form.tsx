"use client"

import type React from "react"

import { useState } from "react"
import { Calculator, HelpCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LoanResults } from "@/components/loan-results"
import { Badge } from "@/components/ui/badge"

export function LoanCalculatorForm() {
  // Estados para los valores del formulario
  const [loanType, setLoanType] = useState("personal")
  const [amount, setAmount] = useState(100000)
  const [term, setTerm] = useState(60)
  const [interestRate, setInterestRate] = useState(12.5)
  const [amortizationType, setAmortizationType] = useState("french")
  const [paymentFrequency, setPaymentFrequency] = useState("monthly")
  const [includeInsurance, setIncludeInsurance] = useState(false)
  const [includeCommission, setIncludeCommission] = useState(false)
  const [gracePeriod, setGracePeriod] = useState(0)

  // Estado para controlar si se muestran los resultados
  const [showResults, setShowResults] = useState(false)

  // Configuraciones según el tipo de préstamo
  const loanConfigs = {
    personal: {
      minAmount: 5000,
      maxAmount: 500000,
      minTerm: 3,
      maxTerm: 60,
      baseRate: 12.5,
      insuranceRate: 0.5,
      commissionRate: 2,
      commissionType: "opening", // opening, monthly
    },
    mortgage: {
      minAmount: 100000,
      maxAmount: 10000000,
      minTerm: 60,
      maxTerm: 360,
      baseRate: 9.5,
      insuranceRate: 0.3,
      commissionRate: 1,
      commissionType: "opening",
    },
    auto: {
      minAmount: 50000,
      maxAmount: 1000000,
      minTerm: 12,
      maxTerm: 72,
      baseRate: 11.0,
      insuranceRate: 0.4,
      commissionRate: 1.5,
      commissionType: "opening",
    },
    business: {
      minAmount: 50000,
      maxAmount: 5000000,
      minTerm: 12,
      maxTerm: 120,
      baseRate: 14.0,
      insuranceRate: 0.6,
      commissionRate: 2.5,
      commissionType: "opening",
    },
  }

  // Obtener la configuración actual según el tipo de préstamo
  const currentConfig = loanConfigs[loanType as keyof typeof loanConfigs]

  // Función para manejar el cambio de tipo de préstamo
  const handleLoanTypeChange = (value: string) => {
    setLoanType(value)
    const config = loanConfigs[value as keyof typeof loanConfigs]

    // Ajustar valores según los límites del nuevo tipo de préstamo
    setAmount(Math.min(Math.max(amount, config.minAmount), config.maxAmount))
    setTerm(Math.min(Math.max(term, config.minTerm), config.maxTerm))
    setInterestRate(config.baseRate)
  }

  // Función para formatear montos como moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Función para calcular el CAT (Costo Anual Total)
  const calculateCAT = () => {
    // Esta es una aproximación simplificada del CAT
    let cat = interestRate

    if (includeInsurance) {
      cat += currentConfig.insuranceRate * 12
    }

    if (includeCommission) {
      if (currentConfig.commissionType === "opening") {
        // Convertir comisión de apertura a tasa anual equivalente
        cat += (currentConfig.commissionRate / (term / 12)) * 100
      } else {
        cat += currentConfig.commissionRate * 12
      }
    }

    return cat.toFixed(2)
  }

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResults(true)
  }

  // Función para iniciar un nuevo cálculo
  const handleNewCalculation = () => {
    setShowResults(false)
  }

  return (
    <div>
      {!showResults ? (
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="basic">Datos Básicos</TabsTrigger>
                <TabsTrigger value="advanced">Opciones Avanzadas</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <TabsContent value="basic" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="loan-type">Tipo de Préstamo</Label>
                      <Select value={loanType} onValueChange={handleLoanTypeChange}>
                        <SelectTrigger id="loan-type">
                          <SelectValue placeholder="Selecciona un tipo de préstamo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Préstamo Personal</SelectItem>
                          <SelectItem value="mortgage">Préstamo Hipotecario</SelectItem>
                          <SelectItem value="auto">Préstamo Automotriz</SelectItem>
                          <SelectItem value="business">Préstamo Empresarial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="amount">Monto del Préstamo</Label>
                        <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                      </div>
                      <Slider
                        id="amount"
                        min={currentConfig.minAmount}
                        max={currentConfig.maxAmount}
                        step={1000}
                        value={[amount]}
                        onValueChange={(values) => setAmount(values[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatCurrency(currentConfig.minAmount)}</span>
                        <span>{formatCurrency(currentConfig.maxAmount)}</span>
                      </div>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          const value = Number.parseInt(e.target.value)
                          if (!isNaN(value)) {
                            setAmount(Math.min(Math.max(value, currentConfig.minAmount), currentConfig.maxAmount))
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
                          {term >= 12 &&
                            ` (${Math.floor(term / 12)} años${term % 12 > 0 ? ` y ${term % 12} meses` : ""})`}
                        </span>
                      </div>
                      <Slider
                        id="term"
                        min={currentConfig.minTerm}
                        max={currentConfig.maxTerm}
                        step={1}
                        value={[term]}
                        onValueChange={(values) => setTerm(values[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{currentConfig.minTerm} meses</span>
                        <span>{currentConfig.maxTerm} meses</span>
                      </div>
                      <Input
                        type="number"
                        value={term}
                        onChange={(e) => {
                          const value = Number.parseInt(e.target.value)
                          if (!isNaN(value)) {
                            setTerm(Math.min(Math.max(value, currentConfig.minTerm), currentConfig.maxTerm))
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

                    <div>
                      <Label htmlFor="amortization-type">Sistema de Amortización</Label>
                      <Select value={amortizationType} onValueChange={setAmortizationType}>
                        <SelectTrigger id="amortization-type">
                          <SelectValue placeholder="Selecciona un sistema" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="french">Sistema Francés (cuota fija)</SelectItem>
                          <SelectItem value="german">Sistema Alemán (amortización constante)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {amortizationType === "french"
                          ? "Cuota fija durante toda la vida del préstamo. Al principio se paga más interés que capital."
                          : "Amortización de capital constante. Cuota decreciente a lo largo del tiempo."}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">CAT (Costo Anual Total):</span>
                        <Badge variant="outline" className="font-bold">
                          {calculateCAT()}%
                        </Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5">
                                <HelpCircle className="h-4 w-4" />
                                <span className="sr-only">Información sobre CAT</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                El Costo Anual Total (CAT) es una medida estandarizada del costo de financiamiento,
                                expresado en términos porcentuales anuales. Incluye la tasa de interés, comisiones y
                                otros gastos asociados al préstamo.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Para fines informativos y de comparación exclusivamente
                      </p>
                    </div>
                    <Button type="submit">
                      <Calculator className="mr-2 h-4 w-4" />
                      Calcular
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="payment-frequency">Frecuencia de Pago</Label>
                      <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
                        <SelectTrigger id="payment-frequency">
                          <SelectValue placeholder="Selecciona la frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="biweekly">Quincenal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="include-insurance">Incluir Seguro de Vida/Desempleo</Label>
                        <p className="text-xs text-muted-foreground">
                          Costo: {currentConfig.insuranceRate}% mensual sobre saldo
                        </p>
                      </div>
                      <Switch id="include-insurance" checked={includeInsurance} onCheckedChange={setIncludeInsurance} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="include-commission">Incluir Comisión por Apertura</Label>
                        <p className="text-xs text-muted-foreground">
                          Costo: {currentConfig.commissionRate}% sobre monto del préstamo
                        </p>
                      </div>
                      <Switch
                        id="include-commission"
                        checked={includeCommission}
                        onCheckedChange={setIncludeCommission}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grace-period">Período de Gracia (meses)</Label>
                      <Select
                        value={gracePeriod.toString()}
                        onValueChange={(value) => setGracePeriod(Number.parseInt(value))}
                      >
                        <SelectTrigger id="grace-period">
                          <SelectValue placeholder="Selecciona el período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Sin período de gracia</SelectItem>
                          <SelectItem value="1">1 mes</SelectItem>
                          <SelectItem value="2">2 meses</SelectItem>
                          <SelectItem value="3">3 meses</SelectItem>
                          <SelectItem value="6">6 meses</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Durante el período de gracia solo pagarás intereses, sin amortizar capital
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted p-4">
                    <div className="flex gap-2">
                      <Info className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium">Información Importante</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Esta simulación es solo informativa y no constituye una oferta de préstamo. Las tasas y
                          condiciones pueden variar según la evaluación crediticia. La aprobación final está sujeta a
                          análisis de capacidad de pago y políticas de crédito vigentes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">CAT (Costo Anual Total):</span>
                        <Badge variant="outline" className="font-bold">
                          {calculateCAT()}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Para fines informativos y de comparación exclusivamente
                      </p>
                    </div>
                    <Button type="submit">
                      <Calculator className="mr-2 h-4 w-4" />
                      Calcular
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <LoanResults
          loanType={loanType}
          amount={amount}
          term={term}
          interestRate={interestRate}
          amortizationType={amortizationType}
          paymentFrequency={paymentFrequency}
          includeInsurance={includeInsurance}
          includeCommission={includeCommission}
          gracePeriod={gracePeriod}
          loanConfig={currentConfig}
          onNewCalculation={handleNewCalculation}
        />
      )}
    </div>
  )
}
