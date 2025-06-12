declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      isAtomicWallet?: boolean
      isCoinbaseWallet?: boolean
      isTrust?: boolean
      request: (request: { method: string; params?: any[] }) => Promise<any>
      on?: (event: string, callback: (data: any) => void) => void
      removeAllListeners?: (event?: string) => void
    }
  }
}

export {}
