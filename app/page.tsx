"use client";
import React, { useState, useContext, useEffect } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";

export default function Home() {
  const { createCampaign, error, getCampaigns, currentAccount, connectWallet } =
    useContext(CrowdFundingContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const fetchCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Error while fetching campaigns:", error);
      setErrorMessage("Error while fetching campaigns");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const campaign = {
      title,
      description,
      amount,
      deadline,
    };
    try {
      await createCampaign(campaign);
      setErrorMessage("");
      setTitle("");
      setDescription("");
      setAmount("");
      setDeadline("");
      fetchCampaigns();
    } catch (error) {
      console.error("Error while creating campaign:", error);
      setErrorMessage(error.message || "Error while creating campaign");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}
      >
        TINY SMART CONTRACT
      </h1>
      {!currentAccount ? (
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <p style={{ marginTop: "10px" }}>
            Connected Wallet: {currentAccount}
          </p>
        </div>
      )}
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "20px" }}>
        Create Campaign
      </h2>
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label
            style={{ display: "block", fontSize: "16px", marginBottom: "5px" }}
          >
            Title:
          </label>
          <input
            style={{ width: "100%", padding: "10px" }}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label
            style={{ display: "block", fontSize: "16px", marginBottom: "5px" }}
          >
            Description:
          </label>
          <textarea
            style={{ width: "100%", padding: "10px" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label
            style={{ display: "block", fontSize: "16px", marginBottom: "5px" }}
          >
            Amount:
          </label>
          <input
            style={{ width: "100%", padding: "10px" }}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label
            style={{ display: "block", fontSize: "16px", marginBottom: "5px" }}
          >
            Deadline:
          </label>
          <input
            style={{ width: "100%", padding: "10px" }}
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Create Campaign
        </button>
        {errorMessage && (
          <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
        )}
      </form>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "20px" }}>
        Campaigns
      </h2>
      <div>
        {campaigns.map((campaign, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              marginTop: "20px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
              {campaign.title}
            </h3>
            <p>Description: {campaign.description}</p>
            <p>Target Amount: {campaign.target}</p>
            <p>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
