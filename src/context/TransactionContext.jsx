import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;
console.log("etherium", ethereum);
const createEthereumContract = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum); //The provider connects to a Web3-enabled environment,allowing you to interact with the Ethereum blockchain.
  const signer = provider.getSigner(); //signer is an object that can sign transactions on behalf of an Ethereum account.
  const transactionsContract = new ethers.Contract( //instance of an Ethereum contract using the ethers.Contract
    contractAddress,
    contractABI,
    signer
  );
  console.log("transactionsContract", transactionsContract);
  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTheTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        const availableTransactions =
          await transactionsContract?.getAllTransactions();
        const structuredTransactions = availableTransactions?.map(
          (transaction) => {
            console.log("transaction", transaction);
            return {
              addressTo: transaction.receiver,
              addressFrom: transaction.sender,
              timestamp: new Date(
                transaction.timestamp.toNumber() * 1000
              ).toLocaleString(),
              message: transaction.message,
              keyword: transaction.keyword,
              amount: parseInt(transaction.amount._hex) / 10 ** 18,
            };
          }
        );

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTheTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        const currentTransactionCount =
          await transactionsContract.getTransactionCount();
        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      // window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = await createEthereumContract();
        console.log("transactionsContract", transactionsContract);

        const parsedAmount = ethers.utils.parseEther(amount);
        const resp = await ethereum.request({
          //request method of etherium POST
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208", //2100 GWEI
              value: parsedAmount._hex,
            },
          ],
        });
        console.log("resp", resp);
        console.log("addressTo", addressTo);
        console.log("parsedAmount", parsedAmount);
        console.log("message", message);
        console.log("keyword", keyword);

        const transactionHash = await transactionsContract.addToBlockchain(
          //adding data on block-chain
          addressTo,
          parsedAmount,
          message,
          keyword
        );
        console.log("transactionHash", transactionHash);
        setIsLoading(true);
        await transactionHash.wait();
        setIsLoading(false);

        const transactionsCount =
          await transactionsContract.getTransactionCount();
        console.log("transactionsCount", transactionsCount);
        setTransactionCount(transactionsCount.toNumber());
        // window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
