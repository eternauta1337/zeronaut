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
        Campaign storage campaign = campaigns[campaignId];
        // TODO: check if the campaign exists

        campaign.levels.push(addr);
    }

    function createCampaign(bytes32 id) public {
        // TODO: check if id is already taken

        Campaign storage newCampaign = campaigns[id];
        newCampaign.id = id;
        newCampaign.owner = msg.sender;
    }

    function getCampaign(bytes32 id) public view returns (Campaign memory) {
        return campaigns[id];
    }

    function checkLevel(address level, bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        return ILevel(level).check(proof, publicInputs);
    }
}
