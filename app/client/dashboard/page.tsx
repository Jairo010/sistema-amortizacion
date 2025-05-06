"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, CreditCard, FileText, Home, LogOut, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("active")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            <span className="text-xl font-bold">Portal de Cliente</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                Cliente <ChevronDown className="h-4 w-4" />
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
              <Link href="/client/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/client/loans">
                <CreditCard className="mr-2 h-4 w-4" />
                Mis Préstamos
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/client/history">
                <FileText className="mr-2 h-4 w-4" />
                Historial
              </Link>
            </Button>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <h1 className="mb-6 text-3xl font-bold">Mis Préstamos</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Préstamos Activos</TabsTrigger>
              <TabsTrigger value="history">Historial de Consultas</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Préstamo Personal</CardTitle>
                  <CardDescription>Sistema de Amortización Francés - Creado el 15/04/2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Monto del Préstamo</h3>
                      <p className="text-2xl font-bold">$150,000</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Plazo</h3>
                      <p className="text-2xl font-bold">60 meses</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Tasa de Interés</h3>
                      <p className="text-2xl font-bold">5.5% anual</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                    <Button variant="outline" size="sm">
                      Imprimir
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Préstamo Hipotecario</CardTitle>
                  <CardDescription>Sistema de Amortización Alemán - Creado el 10/01/2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Monto del Préstamo</h3>
                      <p className="text-2xl font-bold">$450,000</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Plazo</h3>
                      <p className="text-2xl font-bold">240 meses</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Tasa de Interés</h3>
                      <p className="text-2xl font-bold">4.8% anual</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                    <Button variant="outline" size="sm">
                      Imprimir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Consultas</CardTitle>
                  <CardDescription>Consultas de préstamos realizadas anteriormente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Simulación de Préstamo Personal</h3>
                          <p className="text-sm text-muted-foreground">Sistema Francés - 05/03/2023</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Simulación de Préstamo Automotriz</h3>
                          <p className="text-sm text-muted-foreground">Sistema Alemán - 20/02/2023</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Simulación de Préstamo Educativo</h3>
                          <p className="text-sm text-muted-foreground">Sistema Francés - 15/01/2023</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
