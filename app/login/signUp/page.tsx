"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, User } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { toast } from "sonner";

export default function SignUpPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const role = searchParams.get("role") || "client"

    const [form, setForm] = useState({ 
        email: '', 
        password: '' 
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const supabase = createClient()
            
            // Validar que el email y password no estén vacíos
            if (!form.email || !form.password) {
                toast.error('Por favor completa todos los campos')
                return
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(form.email)) {
                toast.error('Por favor ingresa un email válido')
                return
            }

            // Validar longitud mínima de contraseña
            if (form.password.length < 6) {
                toast.error('La contraseña debe tener al menos 6 caracteres')
                return
            }

            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: {
                        role: role,
                        email: form.email
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            })

            if (error) {
                console.error('Error detallado:', error)
                toast.error(error.message)
                return
            }

            if (data?.user) {
                toast.success('Registro exitoso. Por favor verifica tu email.')
                
                // Redirigir según el rol
                if (role === "admin") {
                    router.push("/admin/dashboard")
                } else if (role === "operator") {
                    router.push("/operator/dashboard")
                } else {
                    router.push("/client/dashboard")
                }
            }

        } catch (error) {
            console.error('Error inesperado:', error)
            toast.error('Ocurrió un error durante el registro')
        } finally {
            setLoading(false)
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
                        {role === "admin"
                            ? "Acceso Administrador"
                            : role === "operator"
                                ? "Acceso Operador"
                                : "Acceso Cliente"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        Ingresa tus credenciales para registrarte al sistema
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={form.email}
                                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                                required
                                disabled={loading}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
