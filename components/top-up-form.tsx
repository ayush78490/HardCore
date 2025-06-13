"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Wallet, ExternalLink, Clock } from "lucide-react"
import { useState } from "react"
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
  const [lastTransaction, setLastTransaction] = useState<{hash: string, amount: number} | null>(null)
  const [userTimeBalance, setUserTimeBalance] = useState(3.5) // Demo initial balance

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
        params: [{
          from: await getCurrentAccount(),
          to: GAME_WALLET_ADDRESS,
          value: `0x${amountInWei}`,
        }],
      })

      // Update user's time balance (1 MON = 1 hour)
      const hoursPurchased = amountInMon
      setUserTimeBalance(prev => prev + hoursPurchased)
      setLastTransaction({ hash: txHash, amount: amountInMon })
      
      toast({ 
        title: "Top Up Successful!", 
        description: `You've purchased ${hoursPurchased} hours of game time.` 
      })
      
      setAmount("")
    } catch (error: any) {
      toast({
        title: "Transaction failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value.replace(/[^0-9.]/g, ""))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Balance Card */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                Game Time Balance
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your available play time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">Available</p>
                    <p className="text-3xl font-bold text-purple-400">
                      {userTimeBalance.toFixed(2)} <span className="text-xl">hours</span>
                    </p>
                  </div>
                  <Button asChild variant="outline" className="border-purple-400 bg-purple-600  hover:bg-purple-900/30 hover:text-white">
                    <Link href="/games">
                      Play Games
                    </Link>
                  </Button>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Recent Activity</h3>
                  {lastTransaction ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Added:</span>
                        <span className="text-white">{lastTransaction.amount} hours</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Transaction:</span>
                        <Link 
                          href={`${MONAD_TESTNET.blockExplorerUrls[0]}/tx/${lastTransaction.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 flex items-center text-xs"
                        >
                          View on explorer
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No recent transactions</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Top Up Form */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Purchase Game Time</CardTitle>
              <CardDescription className="text-gray-400">
                Convert MON tokens to play time (1 MON = 1 hour)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Amount to Send
                  </label>
                  <div className="relative">
                    <Input
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="Enter amount in MON"
                      className="bg-gray-800 border-gray-700 text-white pl-8 text-lg h-12"
                    />
                    <span className="absolute top-3 text-gray-400"></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-400 text-sm">You'll receive</p>
                          <p className="text-xl font-semibold text-white">
                            {amount ? parseFloat(amount).toFixed(2) : "0.00"} hours
                          </p>
                        </div>
                        <Clock className="h-6 w-6 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-400 text-sm">New balance</p>
                          <p className="text-xl font-semibold text-white">
                            {(userTimeBalance + (amount ? parseFloat(amount) : 0)).toFixed(2)} hours
                          </p>
                        </div>
                        <Wallet className="h-6 w-6 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Button
                  onClick={handleTopUp}
                  disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg"
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
                  <p className="mt-1">Estimated time: ~15 seconds</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}