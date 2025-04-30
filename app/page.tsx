"use client";
import React, { useState, useContext, useEffect } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Campaign {
  title: string;
  description: string;
  target: string;
  deadline: string;
}

const campaignSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  deadline: z.string().min(1, "Deadline is required"),
});

type FormValues = z.infer<typeof campaignSchema>;

export default function Home() {
  const { createCampaign, getCampaigns, currentAccount, connectWallet } =
    useContext(CrowdFundingContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(campaignSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createCampaign(data);
      setErrorMessage("");
      reset();
      fetchCampaigns();
    } catch (error) {
      console.error("Error while creating campaign:", error);
      setErrorMessage(error instanceof Error ? error.message : "Error while creating campaign");
    }
  };

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

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "monospace" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
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
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontSize: "16px", marginBottom: "5px" }}>
            Title:
          </label>
          <input
            style={{ width: "100%", padding: "10px", fontFamily: "monospace" }}
            type="text"
            {...register("title")}
          />
          {errors.title && (
            <p style={{ color: "red", marginTop: "5px" }}>{errors.title.message}</p>
          )}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontSize: "16px", marginBottom: "5px" }}>
            Description:
          </label>
          <textarea
            style={{ width: "100%", padding: "10px" }}
            {...register("description")}
          />
          {errors.description && (
            <p style={{ color: "red", marginTop: "5px" }}>{errors.description.message}</p>
          )}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontSize: "16px", marginBottom: "5px" }}>
            Amount:
          </label>
          <input
            style={{ width: "100%", padding: "10px", fontFamily: "monospace" }}
            type="number"
            {...register("amount")}
          />
          {errors.amount && (
            <p style={{ color: "red", marginTop: "5px" }}>{errors.amount.message}</p>
          )}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontSize: "16px", marginBottom: "5px" }}>
            Deadline:
          </label>
          <input
            style={{ width: "100%", padding: "10px", fontFamily: "monospace" }}
            type="date"
            {...register("deadline")}
          />
          {errors.deadline && (
            <p style={{ color: "red", marginTop: "5px" }}>{errors.deadline.message}</p>
          )}
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
            fontFamily: "monospace"
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
              borderRadius: "3px",
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
