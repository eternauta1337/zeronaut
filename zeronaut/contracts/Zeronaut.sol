// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./interfaces/ILevel.sol";

contract Zeronaut {
    struct Campaign {
        bytes32 id;
        address owner;
    }

    struct Level {
        bytes32 id;
        address addr;
        bytes32 campaignId;
    }

    mapping(bytes32 => Campaign) public campaigns;
    mapping(bytes32 => Level) public levels;

    modifier onlyCampaignOwner(bytes32 campaignId) {
        require(campaigns[campaignId].owner == msg.sender, "Only campaign owner allowed");
        _;
    }

    function setLevel(bytes32 campaignId, bytes32 levelId, address addr) public onlyCampaignOwner(campaignId) {
        // Check if the campaign exists
        require(campaigns[campaignId].id != bytes32(0), "Campaign does not exist");

        // Store the level
        Level storage newLevel = levels[levelId];
        newLevel.id = levelId;
        newLevel.addr = addr;
        newLevel.campaignId = campaignId;
    }

    function createCampaign(bytes32 id) public {
        // TODO: check if id is already taken
        require(campaigns[id].owner == address(0), "Campaign id already taken");

        Campaign storage newCampaign = campaigns[id];
        newCampaign.id = id;
        newCampaign.owner = msg.sender;
    }

    function getCampaign(bytes32 id) public view returns (Campaign memory) {
        return campaigns[id];
    }

    function getLevel(bytes32 id) public view returns (Level memory) {
        return levels[id];
    }
}
