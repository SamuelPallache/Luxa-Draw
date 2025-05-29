import { useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton
} from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import "./index.css";
import "@solana/wallet-adapter-react-ui/styles.css";

const connectionEndpoint = clusterApiUrl("devnet");

function AppContent() {
  const { connected } = useWallet();
  const [ticketsSold, setTicketsSold] = useState(0);
  const totalTickets = 1000;
  const ticketPrice = 100;
  const prize = 1000;
  const [buyCount, setBuyCount] = useState(1);

  const handleBuyTickets = () => {
    setTicketsSold(prev => Math.min(totalTickets, prev + buyCount));
  };

  const percentage = ((ticketsSold / totalTickets) * 100).toFixed(1);

  return (
    <div className="bg-white text-black min-h-screen font-sans flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold">$Luxa Draw</h1>
          <WalletMultiButton className="!bg-black !text-white !font-bold !px-4 !py-2 !rounded-md" />
        </div>

        <div className="bg-white p-6 rounded-xl mb-6 border border-black">
          <h2 className="text-xl font-bold mb-4">Raffle Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Prize:</span>
              <span className="font-bold">{prize} $LUXA</span>
            </div>
            <div className="flex justify-between">
              <span>Ticket Price:</span>
              <span className="font-bold">{ticketPrice} $LUXA</span>
            </div>
            <div className="flex justify-between">
              <span>Total Tickets:</span>
              <span className="font-bold">{totalTickets}</span>
            </div>
            <div className="flex justify-between">
              <span>Tickets Sold:</span>
              <span className="font-bold">{ticketsSold}</span>
            </div>
            <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden mt-2">
              <div
                className="bg-black h-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-xs text-right text-black mt-1">
              {ticketsSold} / {totalTickets} ({percentage}%)
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-black">
          <h2 className="text-xl font-bold mb-4">Buy Tickets</h2>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              min="1"
              value={buyCount}
              onChange={e => setBuyCount(Number(e.target.value))}
              className="w-20 px-3 py-2 rounded border border-black text-black"
            />
            <button
              onClick={handleBuyTickets}
              className="bg-black text-white font-bold px-6 py-2 rounded hover:bg-gray-800 transition"
            >
              + Buy
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-black mt-6">
          🛡️ Raffle is <span className="font-bold underline">OPEN</span>
        </div>
      </div>
    </div>
  );
}

export function WrappedApp() {
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ], []);

  return (
    <ConnectionProvider endpoint={connectionEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default WrappedApp;
