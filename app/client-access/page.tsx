"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Calculator } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ClientAccess() {
  const [accessCode, setAccessCode] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!accessCode.trim() || !email.trim()) {
      setError("Por favor complete todos los campos")
      return
    }

    // En un proyecto real, aquí verificaríamos el código de acceso
    // Por ahora, simplemente redirigimos a la página de resultados
    window.location.href = `/client/loan-result?code=${accessCode}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Sistema de Préstamos</h1>
          </Link>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acceso de Cliente</CardTitle>
            <CardDescription>
              Ingresa tu código de acceso y correo electrónico para ver los detalles de tu préstamo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="access-code">Código de Acceso</Label>
                <Input
                  id="access-code"
                  placeholder="Ej: ABC123XYZ"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                Acceder
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              El código de acceso fue proporcionado por tu asesor financiero
            </p>
          </CardFooter>
        </Card>
      </main>
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Sistema de Préstamos. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
