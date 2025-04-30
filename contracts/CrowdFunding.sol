// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFunding {
    address public owner;
    uint public totalFunds;
    uint public target;
    bool public campaignEnded;

    struct Campaign {
        address creator;
        string title;
        string description;
        uint amount;
        uint deadline;
        uint amountCollected;
        bool active;
    }

    mapping(address => uint) public contributors;
    mapping(uint => Campaign) public campaigns;
    uint public campaignCounter;

    event FundsContributed(address indexed contributor, uint amount);
    event CampaignCreated(
        address indexed creator,
        string title,
        uint amount,
        uint deadline
    );
    event CampaignEnded(uint totalFunds, bool succeeded);

    constructor(uint _target) {
        owner = msg.sender;
        target = _target;
        campaignEnded = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier campaignNotEnded() {
        require(!campaignEnded, "Campaign has already ended");
        _;
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint _amount,
        uint _deadline
    ) public campaignNotEnded {
        require(_amount > 0, "Contribution amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        campaigns[campaignCounter] = Campaign({
            creator: msg.sender,
            title: _title,
            description: _description,
            amount: _amount,
            deadline: _deadline,
            amountCollected: 0,
            active: true
        });

        campaignCounter++;

        emit CampaignCreated(msg.sender, _title, _amount, _deadline);
    }

    function contribute(uint _campaignId) public payable campaignNotEnded {
        require(campaigns[_campaignId].active, "Campaign is not active");
        require(msg.value > 0, "Contribution amount must be greater than 0");
        require(
            block.timestamp < campaigns[_campaignId].deadline,
            "Campaign deadline has passed"
        );

        contributors[msg.sender] += msg.value;
        campaigns[_campaignId].amountCollected += msg.value;
        totalFunds += msg.value;

        emit FundsContributed(msg.sender, msg.value);
        checkGoalReached(_campaignId);
    }

    function checkGoalReached(uint _campaignId) private {
        if (
            campaigns[_campaignId].amountCollected >=
            campaigns[_campaignId].amount
        ) {
            campaigns[_campaignId].active = false;
            campaignEnded = true;
            emit CampaignEnded(totalFunds, true);
        }
    }

    function withdrawFunds() public onlyOwner {
        require(campaignEnded, "Campaign has not ended yet");
        require(address(this).balance >= totalFunds, "Insufficient funds");
        payable(owner).transfer(totalFunds);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCounter);
        for (uint i = 0; i < campaignCounter; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }
}