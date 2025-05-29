// LuxaDraw MVP - React App with Wallet Connect + Raffle Logic
// Requirements:
// - Fixed 100 tickets per raffle
// - Ticket price = 10 $LUXA
// - Prize = 1000 $LUXA
// - Token Address: FUuRt4n8sBSoJRwyDqp7Jd3Yj2H4LEVizD4qum2RH4JQ
// - Prize wallet: 8Eeqo7QnJX1Bv97NXCYhf8fkJoZ6zf7fSzCiGmf268HE

import { useEffect, useState } from "react"
import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import { useWallet, WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createTransferInstruction } from "@solana/spl-token"

require("@solana/wallet-adapter-react-ui/styles.css")

const LUXA_MINT = new PublicKey("FUuRt4n8sBSoJRwyDqp7Jd3Yj2H4LEVizD4qum2RH4JQ")
const VAULT_WALLET = new PublicKey("8Eeqo7QnJX1Bv97NXCYhf8fkJoZ6zf7fSzCiGmf268HE")
const connection = new Connection("https://api.mainnet-beta.solana.com")

export default function App() {
  const wallet = useWallet()
  const [ticketsSold, setTicketsSold] = useState(0)
  const totalTickets = 100

  const buyTicket = async () => {
    if (!wallet.publicKey) return
    const userTokenAccount = await getAssociatedTokenAddress(LUXA_MINT, wallet.publicKey)
    const vaultTokenAccount = await getAssociatedTokenAddress(LUXA_MINT, VAULT_WALLET)

    const transaction = new Transaction().add(
      createTransferInstruction(
        userTokenAccount,
        vaultTokenAccount,
        wallet.publicKey,
        10 * 10 ** 6, // 10 LUXA assuming 6 decimals
        [],
        TOKEN_PROGRAM_ID
      )
    )

    const signature = await wallet.sendTransaction(transaction, connection)
    await connection.confirmTransaction(signature, "processed")
    alert("Ticket purchased!")
    setTicketsSold((prev) => Math.min(prev + 1, totalTickets))
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">
        Luxa<span className="text-[#00ffe7]">Draw</span> Raffle
      </h1>
      <WalletMultiButton className="mb-4" />
      <div className="bg-white/10 p-6 rounded-xl max-w-md w-full text-center">
        <p className="text-xl mb-2">Prize: 1000 $LUXA</p>
        <p className="mb-4">Ticket Price: 10 $LUXA</p>
        <p className="mb-4">Tickets Sold: {ticketsSold} / {totalTickets}</p>
        <button
          className="bg-[#00ffe7] text-black px-4 py-2 rounded font-bold hover:bg-[#00ffe7]/80"
          onClick={buyTicket}
          disabled={!wallet.connected || ticketsSold >= totalTickets}
        >
          Buy Ticket
        </button>
      </div>
    </div>
  )
}

export function WrappedApp() {
  const wallets = [new PhantomWalletAdapter()]
  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
