export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "operator" | "client"
}

export interface Institution {
  name: string
  logo?: string
  frenchInterestRate: number
  germanInterestRate: number
  maxLoanAmount: number
  maxLoanTerm: number
}

export interface Loan {
  id: string
  clientName: string
  clientEmail: string
  amount: number
  term: number
  interestRate: number
  amortizationType: "french" | "german"
  createdAt: string
  createdBy: string
  accessCode: string
}

export interface AmortizationRow {
  period: number
  payment: number
  principal: number
  interest: number
  balance: number
}
