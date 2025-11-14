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
        // מזהי תצוגה (לא חובה לשמור on-chain, אבל אם תרצי — הנה)
        uint256 campaignId;
        string  campaignName;
        uint256 charityId;
        string  charityName;

        // מצטברים
        uint256 totalCrypto;   // ב-wei
        uint256 totalFiat;     // באגורות/סנטים (יחידות קטנות off-chain)

        // הרשאות ויעד
        address manager;       // בעל/מנהל הקמפיין
        address beneficiary;   // ארנק העמותה שמקבל את ה-ETH

        bool    active;        // האם פתוח לתרומות
    }

    // מזהה רץ
    uint256 public nextCampaignId;
    mapping(uint256 => Campaign) public campaigns;

    // מנהל הקמפיין או סופר-אדמין
    modifier onlyOwnerOrManager(uint256 campaignId) {
        require(
            msg.sender == owner || msg.sender == campaigns[campaignId].manager,
            "not manager/owner"
        );
        _;
    }

    // -------- אירועים לשקיפות --------
    event CampaignCreated(
        uint256 indexed campaignId,
        string  campaignName,
        uint256 charityId,
        string  charityName,
        address beneficiary,
        address manager
    );

    event CampaignUpdated(
        uint256 indexed campaignId,
        string  campaignName,
        uint256 charityId,
        string  charityName,
        address beneficiary,
        bool    active
    );

    event CryptoDonation(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event FiatDonationRecorded(
        uint256 indexed campaignId,
        uint256 amount,
        string  currency,
        string  refCode
    );

    // -------- בנאי --------
    constructor() {
        owner = msg.sender;
        paused = false;
    }

    // -------- יצירת/עדכון קמפיין --------

    function createCampaign(
        string  calldata campaignName,
        uint256         charityId,
        string  calldata charityName,
        address         beneficiary
    )
        external
        returns (uint256 id)
    {
        require(bytes(campaignName).length > 0, "empty name");
        require(bytes(charityName).length  > 0, "empty charity name");
        require(beneficiary != address(0), "bad beneficiary");

        id = nextCampaignId++;

        campaigns[id] = Campaign({
            campaignId:   id,
            campaignName: campaignName,
            charityId:    charityId,
            charityName:  charityName,
            totalCrypto:  0,
            totalFiat:    0,
            manager:      msg.sender,
            beneficiary:  beneficiary,
            active:       true
        });

        emit CampaignCreated(
            id,
            campaignName,
            charityId,
            charityName,
            beneficiary,
            msg.sender
        );
    }

    function updateCampaign(
        uint256 campaignId,
        string  calldata campaignName,
        uint256         charityId,
        string  calldata charityName,
        address         beneficiary,
        bool            active
    )
        external
        onlyOwnerOrManager(campaignId)
    {
        Campaign storage c = campaigns[campaignId];
        require(c.manager != address(0), "unknown campaign");
        require(beneficiary != address(0), "bad beneficiary");

        c.campaignName = campaignName;
        c.charityName  = charityName;
        c.charityId    = charityId;
        c.beneficiary  = beneficiary;
        c.active       = active;

        emit CampaignUpdated(
            campaignId,
            campaignName,
            charityId,
            charityName,
            beneficiary,
            active
        );
    }

    // -------- תרומה בקריפטו (ETH) --------
    function donateCrypto(uint256 campaignId)
        external
        payable
        whenNotPaused
    {
        Campaign storage c = campaigns[campaignId];
        require(c.beneficiary != address(0), "unknown campaign");
        require(c.active, "inactive");
        require(msg.value > 0, "no value");

        c.totalCrypto += msg.value;

        (bool ok,) = c.beneficiary.call{value: msg.value}("");
        require(ok, "transfer failed");

        emit CryptoDonation(campaignId, msg.sender, msg.value);
    }

    // -------- רישום תרומת אשראי --------
    function recordFiatDonation(
        uint256 campaignId,
        uint256 amountFiat,
        string  calldata currency,
        string  calldata refCode
    )
        external
        onlyOwner
    {
        require(campaigns[campaignId].beneficiary != address(0), "unknown campaign");
        require(amountFiat > 0, "amount=0");

        campaigns[campaignId].totalFiat += amountFiat;

        emit FiatDonationRecorded(campaignId, amountFiat, currency, refCode);
    }

    // -------- עזר --------
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "bad owner");
        owner = newOwner;
    }
}
