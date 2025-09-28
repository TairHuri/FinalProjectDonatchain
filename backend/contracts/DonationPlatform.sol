// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DonationManager {
    struct Campaign {
        uint256 id;
        address payable owner;
        string title;
        string description;
        uint256 target; // in wei
        uint256 raised; // in wei
        bool active;
    }

    uint256 public nextCampaignId;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations; // campaignId => donor => amount

    event CampaignCreated(uint256 indexed id, address owner, string title, uint256 target);
    event Donated(uint256 indexed id, address indexed donor, uint256 amount);
    event Withdrawn(uint256 indexed id, address owner, uint256 amount);

    function createCampaign(string calldata title, string calldata description, uint256 target) external {
        campaigns[nextCampaignId] = Campaign({
            id: nextCampaignId,
            owner: payable(msg.sender),
            title: title,
            description: description,
            target: target,
            raised: 0,
            active: true
        });
        emit CampaignCreated(nextCampaignId, msg.sender, title, target);
        nextCampaignId++;
    }

    function donate(uint256 campaignId) external payable {
        Campaign storage c = campaigns[campaignId];
        require(c.active, "campaign not active");
        require(msg.value > 0, "donation must be > 0");
        c.raised += msg.value;
        donations[campaignId][msg.sender] += msg.value;
        emit Donated(campaignId, msg.sender, msg.value);
    }

    function withdraw(uint256 campaignId) external {
        Campaign storage c = campaigns[campaignId];
        require(msg.sender == c.owner, "only owner");
        uint256 amount = c.raised;
        require(amount > 0, "no funds");
        c.raised = 0;
        c.active = false;
        (bool ok, ) = c.owner.call{value: amount}("");
        require(ok, "transfer failed");
        emit Withdrawn(campaignId, c.owner, amount);
    }

    // view helpers
    function getCampaign(uint256 id) external view returns (Campaign memory) {
        return campaigns[id];
    }
}
