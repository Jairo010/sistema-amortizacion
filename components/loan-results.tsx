"use client"

import { useState } from "react"
import { ArrowLeft, Download, FileText, Printer } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

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
  },
  data: any,
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
  data,
  onNewCalculation,
}: LoanResultsProps) {
  const [activeTab, setActiveTab] = useState("table")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Calcular el índice inicial y final para la paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(data.length / itemsPerPage)

  // Función para generar el rango de páginas a mostrar
  const getPageRange = () => {
    const delta = 2 // Número de páginas a mostrar a cada lado de la página actual
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []
    let l: number | undefined

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i)
      }
    }

    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  // Función para cambiar de página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

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
      case "prestamo personal":
        return "Préstamo Personal"
      case "prestamo hipotecario":
        return "Préstamo Hipotecario"
      case "prestamo automotriz":
        return "Préstamo Automotriz"
      case "prestamo empresarial":
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

  // Función para exportar a PDF
  const handleExportPDF = () => {
    const doc = new jsPDF()
    
    // Título del documento
    doc.setFontSize(16)
    doc.text("Tabla de Amortización", 14, 15)
    
    // Información del préstamo
    doc.setFontSize(10)
    doc.text([
      `Tipo de Préstamo: ${getLoanTypeName()}`,
      `Monto: ${formatCurrency(amount)}`,
      `Plazo: ${term} años`,
      `Tasa de Interés: ${interestRate}% anual`,
      `Sistema: ${amortizationType === "french" ? "Francés" : "Alemán"}`,
      `Frecuencia: ${getFrequencyName()}`,
    ], 14, 25)

    // Configurar la tabla
    const tableColumn = [
      "Período",
      "Fecha",
      "Cuota",
      "Amortización",
      "Interés",
      ...(includeInsurance ? ["Seguro"] : []),
      "Saldo Inicial",
      "Saldo Final"
    ]

    const tableRows = data.map((row: any) => {
      const paymentDate = new Date()
      if (paymentFrequency === "weekly") {
        paymentDate.setDate(paymentDate.getDate() + row.nro_cuota * 7)
      } else if (paymentFrequency === "biweekly") {
        paymentDate.setDate(paymentDate.getDate() + row.nro_cuota * 15)
      } else {
        paymentDate.setMonth(paymentDate.getMonth() + row.nro_cuota)
      }

      return [
        row.nro_cuota,
        paymentDate.toLocaleDateString(),
        formatCurrency(row.cuota),
        formatCurrency(row.amortizacion),
        formatCurrency(row.interes),
        ...(includeInsurance ? [formatCurrency((loanConfig.insuranceRate / 100 / 12) * row.saldo_inicial || 0)] : []),
        formatCurrency(row.saldo_inicial),
        formatCurrency(row.saldo_final)
      ]
    })

    // Agregar la tabla al PDF
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    })

    // Agregar resumen al final
    const finalY = (doc as any).lastAutoTable.finalY || 60
    doc.setFontSize(10)
    doc.text([
      "Resumen:",
      `Total a Pagar: ${formatCurrency(totalPayment + openingCommission)}`,
      `Total Intereses: ${formatCurrency(totalInterest)}`,
      `Total Seguro: ${formatCurrency(totalInsurance)}`,
      `CAT: ${calculateCAT()}%`,
    ], 14, finalY + 10)

    // Guardar el PDF
    doc.save(`tabla-amortizacion-${loanType}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Función para imprimir
  const handlePrint = () => {
    // Crear un elemento temporal para el contenido de impresión
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    // Preparar el contenido HTML
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tabla de Amortización</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: right;
            }
            th {
              background-color: #f5f5f5;
              text-align: center;
            }
            .summary {
              margin-top: 20px;
              border-top: 2px solid #000;
              padding-top: 10px;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Tabla de Amortización</h1>
          </div>

          <div class="info-section">
            <div class="info-row">
              <strong>Tipo de Préstamo:</strong>
              <span>${getLoanTypeName()}</span>
            </div>
            <div class="info-row">
              <strong>Monto:</strong>
              <span>${formatCurrency(amount)}</span>
            </div>
            <div class="info-row">
              <strong>Plazo:</strong>
              <span>${term} años</span>
            </div>
            <div class="info-row">
              <strong>Tasa de Interés:</strong>
              <span>${interestRate}% anual</span>
            </div>
            <div class="info-row">
              <strong>Sistema:</strong>
              <span>${amortizationType === "french" ? "Francés" : "Alemán"}</span>
            </div>
            <div class="info-row">
              <strong>Frecuencia:</strong>
              <span>${getFrequencyName()}</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Período</th>
                <th>Fecha</th>
                <th>Cuota</th>
                <th>Amortización</th>
                <th>Interés</th>
                ${includeInsurance ? '<th>Seguro</th>' : ''}
                <th>Saldo Inicial</th>
                <th>Saldo Final</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((row: any) => {
                const paymentDate = new Date()
                if (paymentFrequency === "weekly") {
                  paymentDate.setDate(paymentDate.getDate() + row.nro_cuota * 7)
                } else if (paymentFrequency === "biweekly") {
                  paymentDate.setDate(paymentDate.getDate() + row.nro_cuota * 15)
                } else {
                  paymentDate.setMonth(paymentDate.getMonth() + row.nro_cuota)
                }

                return `
                  <tr>
                    <td>${row.nro_cuota}</td>
                    <td>${paymentDate.toLocaleDateString()}</td>
                    <td>${formatCurrency(row.cuota)}</td>
                    <td>${formatCurrency(row.amortizacion)}</td>
                    <td>${formatCurrency(row.interes)}</td>
                    ${includeInsurance ? `<td>${formatCurrency((loanConfig.insuranceRate / 100 / 12) * row.saldo_inicial || 0)}</td>` : ''}
                    <td>${formatCurrency(row.saldo_inicial)}</td>
                    <td>${formatCurrency(row.saldo_final)}</td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>

          <div class="summary">
            <div class="info-row">
              <strong>Total a Pagar:</strong>
              <span>${formatCurrency(totalPayment + openingCommission)}</span>
            </div>
            <div class="info-row">
              <strong>Total Intereses:</strong>
              <span>${formatCurrency(totalInterest)}</span>
            </div>
            ${includeInsurance ? `
              <div class="info-row">
                <strong>Total Seguro:</strong>
                <span>${formatCurrency(totalInsurance)}</span>
              </div>
            ` : ''}
            <div class="info-row">
              <strong>CAT:</strong>
              <span>${calculateCAT()}%</span>
            </div>
          </div>

          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()">Imprimir</button>
          </div>
        </body>
      </html>
    `

    // Escribir el contenido en la nueva ventana
    printWindow.document.write(content)
    printWindow.document.close()

    // Esperar a que se cargue el contenido
    printWindow.onload = function() {
      printWindow.print()
      // Cerrar la ventana después de imprimir
      printWindow.onafterprint = function() {
        printWindow.close()
      }
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
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
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
              {term} años
              <span className="block text-xs text-muted-foreground">
                {totalPeriods * 12} pagos {getFrequencyName()}es
              </span>
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Tasa de Interés</h3>
            <p className="mt-1 text-xl font-medium">
              {interestRate}% anual
              <span className="block text-xs text-muted-foreground">
                {(interestRate /100 / periodsPerYear).toFixed(2)}% {getFrequencyName()}
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
                    <TableHead>Cuota</TableHead>
                    <TableHead>Amortizacion</TableHead>
                    <TableHead>Interés</TableHead>
                    {includeInsurance && <TableHead>Seguro</TableHead>}
                    <TableHead>Saldo inicial</TableHead>
                    <TableHead>Saldo final</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((row: any) => {
                    // Calcular fecha aproximada de pago
                    const paymentDate = new Date()
                    if (paymentFrequency === "weekly") {
                      paymentDate.setDate(paymentDate.getDate() + row.nro_cuota * 7)
                    } else if (paymentFrequency === "biweekly") {
                      paymentDate.setDate(paymentDate.getDate() + row.nro_cuota * 15)
                    } else {
                      paymentDate.setMonth(paymentDate.getMonth() + row.nro_cuota)
                    }

                    return (
                      <TableRow key={row.nro_cuota}>
                        <TableCell>{row.nro_cuota}</TableCell>
                        <TableCell>{paymentDate.toLocaleDateString()}</TableCell>
                        <TableCell>{formatCurrency(row.cuota)}</TableCell>
                        <TableCell>{formatCurrency(row.amortizacion)}</TableCell>
                        <TableCell>{formatCurrency(row.interes)}</TableCell>
                        {includeInsurance && <TableCell>{formatCurrency((loanConfig.insuranceRate / 100 / 12) * row.saldo_inicial || 0)}</TableCell>}
                        <TableCell>{formatCurrency(row.saldo_inicial)}</TableCell>
                        <TableCell>{formatCurrency(row.saldo_final)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  «
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  ‹
                </Button>
                <div className="flex items-center gap-1">
                  {getPageRange().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2">...</span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page as number)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  ›
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  »
                </Button>
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
