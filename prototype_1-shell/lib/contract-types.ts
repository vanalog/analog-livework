// Contract-related types for database operations

export type ContractStatus = 'draft' | 'pending' | 'active' | 'completed' | 'cancelled'

export interface Contract {
  id: string
  athlete_name: string
  counterparty_name: string
  team: 'MBB' | 'WBB'
  start_date: string
  end_date: string
  total_value: number
  payment_frequency: 'bi-weekly' | 'monthly' | 'quarterly'
  status: ContractStatus
  created_at: string
  updated_at: string
}

export interface ContractPayment {
  id: string
  contract_id: string
  payment_date: string
  amount: number
  cap_period: string
  fiscal_year?: string
  payment_type?: string
  cap_applicable?: boolean
  created_at: string
  updated_at: string
}

export interface ContractCapAllocation {
  id: string
  contract_id: string
  budget_period_id: string
  allocated_amount: number
  created_at: string
}

export interface ContractConditionalPayment {
  id: string
  contract_id: string
  payment_date: string
  amount: number
  payment_type: string
  cap_period: string
  created_at: string
  updated_at: string
}

// Input types for creating contracts
export interface CreateContractInput {
  athlete_name: string
  counterparty_name: string
  team: 'MBB' | 'WBB'
  start_date: string
  end_date: string
  total_value: number
  payment_frequency: 'bi-weekly' | 'monthly' | 'quarterly'
  status?: ContractStatus
}

export interface CreatePaymentInput {
  contract_id: string
  payment_date: string
  amount: number
  cap_period_label: string // This gets mapped to 'cap_period' column in DB
}

export interface CreateCapAllocationInput {
  contract_id: string
  budget_period_id: string
  allocated_amount: number
}

export interface CreateConditionalPaymentInput {
  contract_id: string
  payment_date: string
  amount: number
  payment_type: string
  cap_period: string
}

// Full contract with related data
export interface ContractWithDetails extends Contract {
  payments: ContractPayment[]
  conditional_payments?: ContractConditionalPayment[]
  cap_allocations: ContractCapAllocation[]
}
