"use client"

import { useState } from "react"
import Link from "next/link"
import { Building, ChevronDown, CreditCard, Home, LogOut, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminDashboard() {
  const [institutionName, setInstitutionName] = useState("Mi Institución Financiera")
  const [frenchInterestRate, setFrenchInterestRate] = useState("5.5")
  const [germanInterestRate, setGermanInterestRate] = useState("5.0")
  const [maxLoanAmount, setMaxLoanAmount] = useState("500000")
  const [maxLoanTerm, setMaxLoanTerm] = useState("360")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            <span className="text-xl font-bold">Panel Administrativo</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                Admin <ChevronDown className="h-4 w-4" />
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
              <Link href="/admin/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Usuarios
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/loans">
                <CreditCard className="mr-2 h-4 w-4" />
                Préstamos
              </Link>
            </Button>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <h1 className="mb-6 text-3xl font-bold">Configuración del Sistema</h1>

          <Tabs defaultValue="institution">
            <TabsList className="mb-4">
              <TabsTrigger value="institution">Institución</TabsTrigger>
              <TabsTrigger value="interest-rates">Tasas de Interés</TabsTrigger>
              <TabsTrigger value="loan-parameters">Parámetros de Préstamos</TabsTrigger>
            </TabsList>

            <TabsContent value="institution" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Institución</CardTitle>
                  <CardDescription>Configura la información básica de tu institución financiera</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution-name">Nombre de la Institución</Label>
                    <Input
                      id="institution-name"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution-logo">Logo de la Institución</Label>
                    <Input id="institution-logo" type="file" />
                  </div>
                  <Button>Guardar Cambios</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interest-rates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tasas de Interés</CardTitle>
                  <CardDescription>
                    Configura las tasas de interés para los diferentes sistemas de amortización
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="french-rate">Tasa de Interés - Sistema Francés (%)</Label>
                    <Input
                      id="french-rate"
                      type="number"
                      step="0.01"
                      value={frenchInterestRate}
                      onChange={(e) => setFrenchInterestRate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="german-rate">Tasa de Interés - Sistema Alemán (%)</Label>
                    <Input
                      id="german-rate"
                      type="number"
                      step="0.01"
                      value={germanInterestRate}
                      onChange={(e) => setGermanInterestRate(e.target.value)}
                    />
                  </div>
                  <Button>Guardar Cambios</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="loan-parameters" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Parámetros de Préstamos</CardTitle>
                  <CardDescription>Configura los límites y parámetros para los préstamos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-amount">Monto Máximo de Préstamo</Label>
                    <Input
                      id="max-amount"
                      type="number"
                      value={maxLoanAmount}
                      onChange={(e) => setMaxLoanAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-term">Plazo Máximo (meses)</Label>
                    <Input
                      id="max-term"
                      type="number"
                      value={maxLoanTerm}
                      onChange={(e) => setMaxLoanTerm(e.target.value)}
                    />
                  </div>
                  <Button>Guardar Cambios</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
