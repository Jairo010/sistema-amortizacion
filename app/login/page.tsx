"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Building, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "client"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // En un proyecto real, aquí iría la autenticación
    // Por ahora, simplemente redirigimos según el rol
    if (role === "admin") {
      router.push("/admin/dashboard")
    } else if (role === "operator") {
      router.push("/operator/dashboard")
    } else {
      router.push("/client/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            {role === "admin" ? (
              <Building className="h-12 w-12 text-primary" />
            ) : (
              <User className="h-12 w-12 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl text-center">
            {role === "admin" ? "Acceso Administrador" : role === "operator" ? "Acceso Operador" : "Acceso Cliente"}
          </CardTitle>
          <CardDescription className="text-center">Ingresa tus credenciales para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Regístrate
            </Link>
          </div>
          <div className="text-center text-sm">
            <Link href="/" className="text-muted-foreground hover:underline">
              Volver al inicio
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
