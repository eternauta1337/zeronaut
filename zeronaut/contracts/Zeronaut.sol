// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./interfaces/ILevel.sol";

contract Zeronaut {
    struct Campaign {
        bytes32 id;
        address owner;
        bytes32[] levels;
    }

    struct Level {
        bytes32 id;
        address addr;
        bytes32 campaignId;
    }

    mapping(bytes32 => Campaign) public campaigns;
    mapping(bytes32 => Level) public levels;
    // levelId -> playerAddress -> levelSolved
    mapping(bytes32 => mapping(address => bool)) public solvers;

    modifier onlyCampaignOwner(bytes32 campaignId) {
        require(campaigns[campaignId].owner == msg.sender, "Only campaign owner allowed");
        _;
    }

    function setLevel(bytes32 campaignId, bytes32 levelId, address addr) public onlyCampaignOwner(campaignId) {
        Campaign storage campaign = campaigns[campaignId];

        // Check if the campaign exists
        require(campaign.id != bytes32(0), "Campaign does not exist");

        // Store the level
        Level storage newLevel = levels[levelId];
        newLevel.id = levelId;
        newLevel.addr = addr;
        newLevel.campaignId = campaignId;

        // Check if the level ID already exists in the campaign
        bool levelExists = false;
        for (uint i = 0; i < campaign.levels.length; i++) {
            if (campaign.levels[i] == levelId) {
                levelExists = true;
                break;
            }
        }

        // Add the level to the campaign only if it doesn't already exist
        if (!levelExists) {
            campaign.levels.push(levelId);
        }
    }

    function solveLevel(bytes32 levelId, bytes calldata proof, bytes32[] calldata publicInputs) public {
        Level storage level = levels[levelId];
        require(level.addr != address(0), "Level does not exist");
        require(!solvers[levelId][msg.sender], "Level already solved");

        bool isSolved = ILevel(level.addr).check(proof, publicInputs);
        require(isSolved, "Level not solved");

        solvers[levelId][msg.sender] = true;
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

    function isLevelSolved(bytes32 levelId, address player) public view returns (bool) {
        return solvers[levelId][player];
    }
}
