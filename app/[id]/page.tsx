"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

const CLUBS_ADDRESS = "0x201e95f275F39a5890C976Dc8A3E1b4Af114E635";
const REFERRAL_ADDRESS = "0x659b8aC78bf3428077529ef9E1cCa22B1d711FFD";

// 1000e18 in big int
const AMOUNT_IN = BigInt(2000 * 1e18);

export default function Home({ params }: any) {
  const { id } = params;
  const [signer, setSigner] = useState<any>();
  const [contract, setContract] = useState<any>();
  const [receipt, setReceipt] = useState<any>();
  const [amount, setAmount] = useState<number>(3);
  const [maxIn, setMaxIn] = useState<any>(AMOUNT_IN);
  useEffect(() => {
    console.log(window.ethereum);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const getSigner = async () => {
      const signer = await provider.getSigner();
      setSigner(signer);
    };
    getSigner();
  }, []);
  useEffect(() => {
    if (!signer) return;
    const clubs = new ethers.Contract(
      CLUBS_ADDRESS,
      [
        "function buyToken(uint256 tokenId, uint256 maxTokensIn, uint256 keysOut, address referral) public returns (uint256 amountIn)",
        "function sellToken(uint256 tokenId, uint256 minTokensOut, uint256 keysIn, address referral) external returns (uint256 amountOut)",
      ],
      signer
    );
    setContract(clubs);
  }, [signer]);
  useEffect(() => {
    setTimeout(() => {
      setReceipt(undefined);
    }, 5000);
  }, [receipt]);

  const buyToken = async (amount: number) => {
    const tx = await contract.buyToken(id, maxIn, amount, REFERRAL_ADDRESS);
    const receipt = await tx.wait();
    setReceipt(receipt);
  };
  const sellToken = async (amount: number) => {
    const tx = await contract.sellToken(id, 1, amount, REFERRAL_ADDRESS);
    const receipt = await tx.wait();
    setReceipt(receipt);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Buy/Sell FT Clubs</h1>
      <div className="p-4">
        <h2>Max $FRIEND Spend</h2>
        <input
          type="number"
          placeholder="Max In"
          defaultValue={Number(AMOUNT_IN) / 1e18}
          onChange={(e) => setMaxIn(BigInt(Number(e.target.value) * 1e18))}
          className="placeholder-gray-500 bg-gray-800 text-white p-2 rounded-full w-full"
        />
      </div>
      <div>
        <h2>Buy Token {id}</h2>
        <input
          type="number"
          placeholder="Amount"
          defaultValue={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          className="placeholder-gray-500 bg-gray-800 text-white p-2 rounded-full"
        />
        <button
          onClick={() => {
            if (!amount || !contract)
              return alert("Please enter Token ID and Amount");
            buyToken(amount);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Buy
        </button>
      </div>
      <div>
        <h2>Sell Token {id}</h2>
        <input
          type="number"
          placeholder="Amount"
          onChange={(e) => setAmount(parseInt(e.target.value))}
          className="placeholder-gray-500 bg-gray-800 text-white p-2 rounded-full"
        />
        <button
          onClick={() => {
            if (!amount || !contract)
              return alert("Please enter Token ID and Amount");
            sellToken(amount);
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Sell
        </button>
      </div>
      {receipt && (
        <div>
          <h3>Transaction Receipt</h3>
          <pre>{JSON.stringify(receipt, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
