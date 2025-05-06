"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Calculator, ChevronDown, FileText, Home, LogOut, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoanCalculator } from "@/components/loan-calculator"

export default function OperatorDashboard() {
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [loanAmount, setLoanAmount] = useState("100000")
  const [loanTerm, setLoanTerm] = useState("60")
  const [amortizationType, setAmortizationType] = useState("french")
  const [interestRate, setInterestRate] = useState("5.5")
  const [showResults, setShowResults] = useState(false)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResults(true)
  }

  const handleNewCalculation = () => {
    setShowResults(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            <span className="text-xl font-bold">Panel de Operador</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                Operador <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <Link href="/">Cerrar Sesión</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/30 p-4">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/operator/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/operator/calculator">
                <Calculator className="mr-2 h-4 w-4" />
                Calculadora
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/operator/clients">
                <Users className="mr-2 h-4 w-4" />
                Clientes
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/operator/history">
                <FileText className="mr-2 h-4 w-4" />
                Historial
              </Link>
            </Button>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <h1 className="mb-6 text-3xl font-bold">Calculadora de Préstamos</h1>

          {!showResults ? (
            <Card>
              <CardHeader>
                <CardTitle>Nueva Consulta de Préstamo</CardTitle>
                <CardDescription>Ingresa los datos del cliente y del préstamo para realizar el cálculo</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCalculate} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Información del Cliente</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="client-name">Nombre del Cliente</Label>
                        <Input
                          id="client-name"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-email">Correo Electrónico</Label>
                        <Input
                          id="client-email"
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Detalles del Préstamo</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="loan-amount">Monto del Préstamo</Label>
                        <Input
                          id="loan-amount"
                          type="number"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loan-term">Plazo (meses)</Label>
                        <Input
                          id="loan-term"
                          type="number"
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interest-rate">Tasa de Interés Anual (%)</Label>
                        <Input
                          id="interest-rate"
                          type="number"
                          step="0.01"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amortization-type">Sistema de Amortización</Label>
                        <Select value={amortizationType} onValueChange={setAmortizationType}>
                          <SelectTrigger id="amortization-type">
                            <SelectValue placeholder="Selecciona un sistema" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="french">Sistema Francés</SelectItem>
                            <SelectItem value="german">Sistema Alemán</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Calcular Préstamo
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resultado del Cálculo</CardTitle>
                  <CardDescription>
                    Préstamo calculado para {clientName} utilizando el sistema{" "}
                    {amortizationType === "french" ? "Francés" : "Alemán"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Monto del Préstamo</h3>
                      <p className="text-2xl font-bold">${Number(loanAmount).toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Plazo</h3>
                      <p className="text-2xl font-bold">{loanTerm} meses</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Tasa de Interés</h3>
                      <p className="text-2xl font-bold">{interestRate}% anual</p>
                    </div>
                  </div>

                  <LoanCalculator
                    amount={Number.parseFloat(loanAmount)}
                    term={Number.parseInt(loanTerm)}
                    rate={Number.parseFloat(interestRate)}
                    type={amortizationType}
                  />

                  <div className="mt-6 flex flex-wrap gap-4">
                    <Button onClick={handleNewCalculation}>Nueva Consulta</Button>
                    <Button variant="outline">Enviar por Email</Button>
                    <Button variant="outline">Imprimir</Button>
                    <Button variant="outline">Guardar</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
