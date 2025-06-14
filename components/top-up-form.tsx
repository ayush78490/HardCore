"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Wallet, ExternalLink, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

const MONAD_TESTNET = {
  chainId: "0x279F",
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  blockExplorerUrls: ["https://testnet.monadexplorer.com"],
}

const GAME_WALLET_ADDRESS = "0x34D41FB82d053C4A06Cf4d435fd0AF865fb0eD0C"

export function TopUpForm() {
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<{
    hash: string
    amount: number
  } | null>(null)
  const [userTimeBalance, setUserTimeBalance] = useState(2.5)

  // 🔄 Load balance from localStorage on mount
  useEffect(() => {
    const storedBalance = localStorage.getItem("userTimeBalance")
    const parsed = parseFloat(storedBalance || "NaN")
    if (!isNaN(parsed) && parsed >= 0) {
      setUserTimeBalance(parsed)
    } else {
      const defaultBalance = 2.5
      localStorage.setItem("userTimeBalance", defaultBalance.toString())
      setUserTimeBalance(defaultBalance)
    }
  }, [])

  // 💾 Save balance to localStorage whenever it changes
  useEffect(() => {
    if (!isNaN(userTimeBalance) && userTimeBalance >= 0) {
      localStorage.setItem("userTimeBalance", userTimeBalance.toString())
    }
  }, [userTimeBalance])

  const getCurrentAccount = async (): Promise<string> => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("Ethereum provider not available")
    }
    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found")
    }
    return accounts[0]
  }

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" })
      return
    }

    if (typeof window === "undefined" || !window.ethereum) {
      toast({ title: "Wallet not connected", variant: "destructive" })
      return
    }

    setIsProcessing(true)

    try {
      const amountInMon = parseFloat(amount)
      const amountInWei = (amountInMon * 1e18).toString(16)

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: await getCurrentAccount(),
            to: GAME_WALLET_ADDRESS,
            value: `0x${amountInWei}`,
          },
        ],
      })

      const newBalance = userTimeBalance + amountInMon
      setUserTimeBalance(newBalance)
      setLastTransaction({ hash: txHash, amount: amountInMon })

      toast({
        title: "Top Up Successful!",
        description: `You've purchased ${amountInMon} hours of game time.`,
      })

      setAmount("")
    } catch (error: any) {
      toast({
        title: "Transaction failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value.replace(/[^0-9.]/g, ""))
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Balance Panel */}
        <Card className="bg-gray-900/70 border border-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Game Time Balance
            </CardTitle>
            <CardDescription className="text-gray-400">
              Monitor your available hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Available</p>
                <p className="text-4xl font-bold text-purple-400">
                  {userTimeBalance.toFixed(2)}{" "}
                  <span className="text-xl font-normal">hrs</span>
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="border-purple-500 hover:bg-purple-600/10 text-white"
              >
                <Link href="/games">Play Games</Link>
              </Button>
            </div>

            <div className="bg-gray-800/60 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-300 mb-2">
                Recent Activity
              </p>
              {lastTransaction ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Added:</span>
                    <span className="text-white">
                      {lastTransaction.amount} hours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction:</span>
                    <Link
                      href={`${MONAD_TESTNET.blockExplorerUrls[0]}/tx/${lastTransaction.hash}`}
                      target="_blank"
                      className="text-purple-400 hover:underline flex items-center"
                    >
                      View on explorer <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No recent transactions</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Purchase Form */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900/70 border border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Purchase Game Time</CardTitle>
              <CardDescription className="text-gray-400">
                Exchange MON tokens for time (1 MON = 1 hour)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Amount to Send
                </label>
                <Input
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount in MON"
                  className="bg-gray-800 border-gray-700 text-white text-lg h-12 px-4"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gray-800/60 border border-gray-700">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">You'll receive</p>
                      <p className="text-xl text-white font-semibold">
                        {amount ? parseFloat(amount).toFixed(2) : "0.00"} hours
                      </p>
                    </div>
                    <Clock className="h-6 w-6 text-purple-400" />
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/60 border border-gray-700">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">New Balance</p>
                      <p className="text-xl text-white font-semibold">
                        {(userTimeBalance + (amount ? parseFloat(amount) : 0)).toFixed(2)} hours
                      </p>
                    </div>
                    <Wallet className="h-6 w-6 text-purple-400" />
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={handleTopUp}
                disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Transaction...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-5 w-5" />
                    Purchase Time
                  </>
                )}
              </Button>

              <div className="text-center text-gray-500 text-sm">
                <p>Transactions are processed on the Monad Testnet</p>
                <p className="mt-1">Estimated confirmation time: ~15 seconds</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
