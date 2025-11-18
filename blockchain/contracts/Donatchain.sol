// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Donatchain {
    // -------- Basic permissions --------
    address public owner;
    modifier onlyOwner() { require(msg.sender == owner, "not owner"); _; }

    // -------- Pause --------
    bool public paused;
    modifier whenNotPaused() { require(!paused, "paused"); _; }
    function setPaused(bool p) external onlyOwner { paused = p; }

    // -------- Campaign model --------
    struct Campaign {
        uint256 campaignId;
        string  campaignName;
        uint256 charityId;

        uint64  startDate;   // unix timestamp (seconds)
        uint64  endDate;     // unix timestamp (seconds)
        uint256 goalAmount;

        uint256 totalCrypto;     
        uint256 totalFiat;
        address manager;       
        address beneficiary;
        bool    active;    
    }

    uint256 public nextCampaignId;
    mapping(uint256 => Campaign) public campaigns;

    modifier onlyOwnerOrManager(uint256 campaignId) {
        require(
            msg.sender == owner || msg.sender == campaigns[campaignId].manager,
            "not manager/owner"
        );
        _;
    }

    // -------- Events --------
    event CampaignCreated(
        uint256 indexed campaignId,
        string  campaignName,
        uint256 charityId,
        uint64  startDate,
        uint64  endDate,
        uint256 goalAmount,
        address beneficiary,
        address manager
    );

    event CampaignUpdated(
        uint256 indexed campaignId,
        string  campaignName,
        uint64  startDate,
        uint64  endDate,
        uint256 goalAmount,
        address beneficiary
    );

    event CampaignStatusChanged(
        uint256 indexed campaignId,
        bool    active
    );

    event CryptoDonation(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event CreditDonationRecorded(
        uint256 indexed campaignId,
        uint256 amount,
        string  currency,
        string  refCode
    );

    // -------- Constructor --------
    constructor() {
        owner = msg.sender;
        paused = false;
    }

    // -------- Create campaign --------
    function createCampaign(
        string  calldata campaignName,
        uint256         charityId,
        uint64          startDate,
        uint64          endDate,
        uint256         goalAmount,
        address         beneficiary
    )
        external
        returns (uint256 id)
    {
        require(bytes(campaignName).length > 0, "empty name");
        require(beneficiary != address(0), "bad beneficiary");

        require(startDate >= block.timestamp, "start in past"); // Start date not in the past
        require(endDate > startDate, "bad end date"); // End date must be greater than start date

        require(goalAmount > 0, "goal=0"); //goalAmount greater than 0

        id = nextCampaignId++;

        campaigns[id] = Campaign({
            campaignId:   id,
            campaignName: campaignName,
            charityId:    charityId,
            startDate:    startDate,
            endDate:      endDate,
            goalAmount:   goalAmount,
            totalCrypto:  0,
            totalCredit:  0,
            manager:      msg.sender,
            beneficiary:  beneficiary,
            active:       true
        });

        emit CampaignCreated(
            id,
            campaignName,
            charityId,
            startDate,
            endDate,
            goalAmount,
            beneficiary,
            msg.sender
        );
    }

    // -------- Update campaign (without active) --------
    function updateCampaign(
        uint256 campaignId,
        string  calldata campaignName,
        uint64          newStartDate,
        uint64          newEndDate,
        uint256         newGoalAmount,
        address         newBeneficiary
    )
        external
        onlyOwnerOrManager(campaignId)
    {
        Campaign storage c = campaigns[campaignId];
        require(c.manager != address(0), "unknown campaign");
        require(bytes(campaignName).length > 0, "empty name");
        require(newBeneficiary != address(0), "bad beneficiary");

        // שם תמיד אפשר לעדכן
        c.campaignName = campaignName;

        // עדכון תאריך התחלה – רק אם עדיין לא עבר התאריך הישן
        if (newStartDate != c.startDate) {
            require(block.timestamp < c.startDate, "start already passed");
            require(newStartDate >= block.timestamp, "start in past");
            require(newStartDate < c.endDate, "start >= end");
            c.startDate = newStartDate;
        }

        // עדכון תאריך סיום – רק אם עדיין לא עבר התאריך הישן
        if (newEndDate != c.endDate) {
            require(block.timestamp < c.endDate, "end already passed");
            require(newEndDate > c.startDate, "end <= start");
            c.endDate = newEndDate;
        }

        // יעד
        c.goalAmount = newGoalAmount;

        // beneficiary
        c.beneficiary = newBeneficiary;

        emit CampaignUpdated(
            campaignId,
            c.campaignName,
            c.startDate,
            c.endDate,
            c.goalAmount,
            c.beneficiary
        );
    }

    // -------- Update active flag separately --------
    function setCampaignActive(uint256 campaignId, bool active_)
        external
        onlyOwnerOrManager(campaignId)
    {
        Campaign storage c = campaigns[campaignId];
        require(c.manager != address(0), "unknown campaign");

        c.active = active_;

        emit CampaignStatusChanged(campaignId, active_);
    }

    // -------- Donate in crypto (ETH) --------
    function donateCrypto(uint256 campaignId)
        external
        payable
        whenNotPaused
    {
        Campaign storage c = campaigns[campaignId];
        require(c.beneficiary != address(0), "unknown campaign");
        require(c.active, "inactive");

        // תורמים רק בין תאריך התחלה לתאריך סיום
        require(block.timestamp >= c.startDate, "not started");
        require(block.timestamp <= c.endDate, "ended");

        require(msg.value > 0, "no value");

        c.totalCrypto += msg.value;

        (bool ok,) = c.beneficiary.call{value: msg.value}("");
        require(ok, "transfer failed");

        emit CryptoDonation(campaignId, msg.sender, msg.value);
    }

    // -------- Record Credit donation --------
    function recordCreditDonation(
        uint256 campaignId,
        uint256 originalAmount,
        uint256 ILSAmount,
        string  calldata currency,
        string  calldata refCode
    )
        external
        onlyOwner
    {
        Campaign storage c = campaigns[campaignId];
        require(c.beneficiary != address(0), "unknown campaign");
        require(ILSAmount > 0, "amount=0");


        require(c.active, "inactive");
        require(block.timestamp >= c.startDate, "not started");
        require(block.timestamp <= c.endDate, "ended");

        c.totalCredit += ILSAmount;

        emit CreditDonationRecorded(campaignId, ILSAmount, originalAmount, currency, refCode);
    }

    // -------- Ownership --------
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "bad owner");
        owner = newOwner;
    }
}
