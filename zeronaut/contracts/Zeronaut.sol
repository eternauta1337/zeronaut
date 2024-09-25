// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./interfaces/ILevel.sol";

contract Zeronaut {
    struct Campaign {
        bytes32 id;
        address owner;
        address[] levels;
    }

    mapping(bytes32 => Campaign) public campaigns;

    modifier onlyCampaignOwner(bytes32 campaignId) {
        require(campaigns[campaignId].owner == msg.sender, "Only campaign owner allowed");
        _;
    }

    function createLevel(bytes32 campaignId, address addr) public onlyCampaignOwner(campaignId) {
        // Check if the campaign exists
        require(campaigns[campaignId].id != bytes32(0), "Campaign does not exist");

        // Check if the level is not already in the campaign
        Campaign storage campaign = campaigns[campaignId];
        for (uint i = 0; i < campaign.levels.length; i++) {
            require(campaign.levels[i] != addr, "Level already in campaign");
        }

        campaign.levels.push(addr);
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

    function getLevelName(address level) public view returns (bytes32) {
        return ILevel(level).name();
    }

    function getLevelInstructions(address level) public view returns (string memory) {
        return ILevel(level).instructions();
    }

    function getLevelCircuit(address level) public view returns (string memory) {
        return ILevel(level).circuit();
    }

    function checkLevel(address level, bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        return ILevel(level).check(proof, publicInputs);
    }
}
