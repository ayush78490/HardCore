"use client"

import { Button } from "@/components/ui/button"
import { Wallet, CheckCircle2, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

// Core Blockchain network configuration
const CORE_TESTNET2 = {
  chainId: "0x45a", // 1114 in hex
  chainName: "Core Testnet2",
  nativeCurrency: {
    name: "Testnet Core",
    symbol: "tCORE2", // Make sure this is exact to avoid warnings
    decimals: 18,
  },
  rpcUrls: ["https://rpc.test2.btcs.network"],
  blockExplorerUrls: ["https://scan.test2.btcs.network"],
}

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [balance, setBalance] = useState("0")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [walletType, setWalletType] = useState<string>("")

  // Check for existing connection on component mount
  useEffect(() => {
    let mounted = true

    const checkConnection = async () => {
      if (!mounted) return

      try {
        if (typeof window !== "undefined" && window.ethereum) {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (mounted && accounts && accounts.length > 0) {
            const account = accounts[0]
            setAddress(account)
            setIsConnected(true)

            // Detect wallet type
            const walletName = detectWalletType()
            setWalletType(walletName)

            // Fetch balance after connection is established
            await fetchBalance(account)
          }
        }
      } catch (error) {
        console.error("Error checking existing connection:", error)
      }
    }

    // Small delay to ensure window is fully loaded
    const timer = setTimeout(checkConnection, 500)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [])

  const detectWalletType = () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const ethereum = window.ethereum
      if (ethereum.isAtomicWallet) {
        return "Atomic Wallet"
      } else if (ethereum.isMetaMask) {
        return "MetaMask"
      } else if (ethereum.isCoinbaseWallet) {
        return "Coinbase Wallet"
      } else if (ethereum.isTrust) {
        return "Trust Wallet"
      } else {
        return "Web3 Wallet"
      }
    }
    return "Unknown Wallet"
  }

  const addCoreNetwork = async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) return false

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [CORE_TESTNET2],
      })
      return true
    } catch (error: any) {
      if (error.code === 4001) {
        toast({
          title: "Network addition cancelled",
          description: "You declined to add the Core Blockchain to your wallet.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Network Error",
          description: "Failed to add Core Blockchain to your wallet.",
          variant: "destructive",
        })
      }
      return false
    }
  }

  const switchToCoreNetwork = async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) return false

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CORE_TESTNET2.chainId }],
      })
      return true
    } catch (error: any) {
      // This error code indicates that the chain has not been added to the wallet
      if (error.code === 4902) {
        return await addCoreNetwork()
      } else if (error.code === 4001) {
        toast({
          title: "Network switch cancelled",
          description: "You declined to switch to the Core Blockchain.",
          variant: "destructive",
        })
        return false
      }

      console.error("Failed to switch to Core Blockchain:", error)
      return false
    }
  }

  const fetchBalance = async (address: string) => {
    try {
      setIsLoadingBalance(true)

      if (typeof window === "undefined" || !window.ethereum) {
        setBalance("0.0000")
        return
      }

      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })

      if (balance) {
        // Convert from wei to CORE (divide by 10^18)
        const balanceInCore = Number.parseInt(balance, 16) / Math.pow(10, 18)
        const formattedBalance = balanceInCore.toFixed(4)
        setBalance(formattedBalance)
      } else {
        setBalance("0.0000")
      }
    } catch (error) {
      console.error("Failed to get balance:", error)
      setBalance("0.0000")
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const connectWallet = async () => {
    try {
      setIsConnecting(true)

      // Check if any Web3 wallet is installed
      if (typeof window === "undefined" || !window.ethereum) {
        toast({
          title: "No Web3 wallet found",
          description: "Please install a Web3 wallet like MetaMask to connect to Core Blockchain.",
          variant: "destructive",
        })
        setIsConnecting(false)
        return
      }

      // Detect wallet type
      const walletName = detectWalletType()
      setWalletType(walletName)

      // Check current network
      const chainId = await window.ethereum.request({ method: "eth_chainId" })

      // If not connected to Core Blockchain, switch to it
      if (chainId !== CORE_TESTNET2.chainId) {
        const switched = await switchToCoreNetwork()
        if (!switched) {
          setIsConnecting(false)
          return
        }
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const account = accounts[0]
      setAddress(account)
      setIsConnected(true)

      toast({
        title: "Wallet connected to Core Blockchain",
        description: `Connected with ${walletName}`,
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      })

      // Fetch balance after successful connection
      await fetchBalance(account)

      // Set up event listeners
      setupEventListeners()
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)

      // Handle user rejection gracefully
      if (error.code === 4001) {
        toast({
          title: "Connection cancelled",
          description: "You declined the connection request.",
        })
      } else if (error.code === 4900) {
        toast({
          title: "Wallet is locked",
          description: "Please unlock your wallet and try again.",
          variant: "destructive",
        })
      } else if (error.code === -32002) {
        toast({
          title: "Request pending",
          description: "Connection request already pending. Please check your wallet.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Connection failed",
          description: "Failed to connect wallet to Core Blockchain. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const setupEventListeners = () => {
    if (typeof window !== "undefined" && window.ethereum && window.ethereum.on) {
      // Remove existing listeners first
      if (window.ethereum.removeAllListeners) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }

      // Add new listeners
      window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        if (!accounts || accounts.length === 0) {
          disconnectWallet()
        } else {
          setAddress(accounts[0])
          await fetchBalance(accounts[0])
        }
      })

      window.ethereum.on("chainChanged", async (chainId: string) => {
        if (chainId !== CORE_TESTNET2.chainId) {
          toast({
            title: "Wrong network",
            description: "Please switch back to Core Blockchain",
            variant: "destructive",
          })
        } else {
          // Refetch balance when switching back to Core Blockchain
          if (address) {
            await fetchBalance(address)
          }
        }
      })
    }
  }

  const refreshBalance = async () => {
    if (address && isConnected) {
      await fetchBalance(address)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
    setBalance("0")
    setWalletType("")

    // Remove event listeners
    if (typeof window !== "undefined" && window.ethereum && window.ethereum.removeAllListeners) {
      window.ethereum.removeAllListeners("accountsChanged")
      window.ethereum.removeAllListeners("chainChanged")
    }

    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected from Core Blockchain",
    })
  }

  if (isConnected) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-400">{walletType}</div>
            <div className="text-white text-sm font-mono truncate max-w-[150px]">
              {`${address.slice(0, 6)}...${address.slice(-6)}`}
            </div>
            <div className="border-t border-blue-400 my-2" />
            <div className="text-xs text-blue-300 mb-2">Connected to Core</div>
            <Button
              size="sm"
              onClick={disconnectWallet}
              className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
            >
              Disconnect
            </Button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">CORE Balance:</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{isLoadingBalance ? "Loading..." : `${balance} CORE`}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshBalance}
                disabled={isLoadingBalance}
                className="text-gray-400 hover:text-white p-1 h-auto"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingBalance ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={connectWallet}
      className="bg-blue-600 hover:bg-blue-700 text-white w-full flex items-center justify-center gap-2"
      disabled={isConnecting}
    >
      {isConnecting ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Connecting...</span>
        </div>
      ) : (
        <>
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <Wallet className="w-3 h-3 text-white" />
          </div>
          Connect to Core Blockchain
        </>
      )}
    </Button>
  )
}