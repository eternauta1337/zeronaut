// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./interfaces/ILevel.sol";
import "./ZeronautStorage.sol";
import "./utils/AddressUtil.sol";
import "hardhat/console.sol";
import {UUPSImplementation} from "./proxy/UUPSImplementation.sol";
import {OwnableStorage} from "./ownable/OwnableStorage.sol";

contract Zeronaut is UUPSImplementation {
    event CampaignCreated(bytes32 id, address owner);

    modifier onlyCampaignOwner(bytes32 campaignId) {
        require(ZeronautStorage.load().campaigns[campaignId].owner == msg.sender, "Only campaign owner allowed");
        _;
    }

    function setLevel(bytes32 campaignId, bytes32 levelId, address addr) public onlyCampaignOwner(campaignId) {
        ZeronautStorage.Store storage store = ZeronautStorage.load();
        ZeronautStorage.Campaign storage campaign = store.campaigns[campaignId];

        // Check if the campaign exists
        require(campaign.id != bytes32(0), "Campaign does not exist");

        // Store the level
        ZeronautStorage.Level storage newLevel = store.levels[levelId];
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
        ZeronautStorage.Store storage store = ZeronautStorage.load();

        // Check if the level exists
        ZeronautStorage.Level storage level = store.levels[levelId];
        require(level.addr != address(0), "Level does not exist");

        // Ensure that the public key corresponds to the player's address
        address computedAddress = AddressUtil.computeAddressFromPublicKey(publicInputs);
        require(computedAddress == msg.sender, "Proof must be generated by player");

        // Check the proof
        bool isSolved = ILevel(level.addr).check(proof, publicInputs);
        require(isSolved, "Level not solved");

        // Mark the level as solved
        store.solvers[levelId][msg.sender] = true;
    }

    function createCampaign(bytes32 id) public {
        ZeronautStorage.Store storage store = ZeronautStorage.load();

        // Ensure id is not already taken
        require(store.campaigns[id].owner == address(0), "Campaign id already taken");

        // Initialize the campaign
        ZeronautStorage.Campaign storage newCampaign = store.campaigns[id];
        newCampaign.id = id;
        newCampaign.owner = msg.sender;

        // Emit an event to log the creation of a new campaign
        emit CampaignCreated(id, msg.sender);

    }

    function getCampaign(bytes32 id) public view returns (ZeronautStorage.Campaign memory) {
        return ZeronautStorage.load().campaigns[id];
    }

    function getLevel(bytes32 id) public view returns (ZeronautStorage.Level memory) {
        return ZeronautStorage.load().levels[id];
    }

    function isLevelSolved(bytes32 levelId, address player) public view returns (bool) {
        return ZeronautStorage.load().solvers[levelId][player];
    }

    function getOwner() public view returns (address) {
        return OwnableStorage.getOwner();
    }
}
