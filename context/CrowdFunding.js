"use client";

import { useState, useEffect, createContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

import { CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS } from "./Constants";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(CROWDFUNDING_ADDRESS, CROWDFUNDING_ABI, signerOrProvider);

export const CrowdFundingContext = createContext();

export const CrowdFundingProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [error, setError] = useState(null);

  const createCampaign = async ({ title, description, amount, deadline }) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    try {
      const transaction = await contract.createCampaign(
        title,
        description,
        ethers.utils.parseUnits(amount, 18),
        new Date(deadline).getTime()
      );
      await transaction.wait();
      console.log("Transaction Mined", transaction);
    } catch (error) {
      console.error(error);
    }
  };

  const getCampaigns = async () => {
    const contract = fetchContract(new ethers.providers.JsonRpcProvider());
    const campaigns = await contract.getCampaigns();

    return campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.amount.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      pId: i,
    }));
  };

  const ifWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        setError("Install Metamask");
        return false;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        return true;
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log("Something wrong while connecting to the wallet ", error);
      return false;
    }
  };

  useEffect(() => {
    ifWalletConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("Install Metamask");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Something wrong while connecting to the wallet", error);
    }
  };

  return (
    <CrowdFundingContext.Provider
      value={{
        currentAccount,
        connectWallet,
        createCampaign,
        getCampaigns,
        error,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
