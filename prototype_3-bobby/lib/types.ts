export type ContextType = "athlete" | "sponsor"

export interface ContractContext {
  type: ContextType
  id: string
  name: string
  photo?: string
  logo?: string
  role: "beneficiary" | "source"
}

export interface CounterpartyData {
  name: string
  type: "athlete" | "sponsor"
  extractedFrom: string
}
