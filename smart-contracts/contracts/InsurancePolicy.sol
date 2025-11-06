// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract InsurancePolicy is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Policy {
        uint256 policyId;
        address holder;
        uint256 validFrom;
        uint256 validUntil;
        string meta; // optional metadata (ipfs cid etc.)
    }

    mapping(uint256 => Policy) private policies;
    mapping(uint256 => bool) private exists;

    event PolicyRegistered(uint256 indexed policyId, address indexed holder, uint256 validFrom, uint256 validUntil, string meta);

    constructor(address admin) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(ADMIN_ROLE, admin);
    }

    function registerPolicy(
        uint256 policyId,
        address holder,
        uint256 validFrom,
        uint256 validUntil,
        string calldata meta
    ) external onlyRole(ADMIN_ROLE) {
        require(!exists[policyId], "Policy already exists");
        require(holder != address(0), "Invalid holder");
        policies[policyId] = Policy(policyId, holder, validFrom, validUntil, meta);
        exists[policyId] = true;
        emit PolicyRegistered(policyId, holder, validFrom, validUntil, meta);
    }

    function getPolicy(uint256 policyId) external view returns (Policy memory) {
        require(exists[policyId], "Policy not found");
        return policies[policyId];
    }

    function isPolicyActive(uint256 policyId, uint256 atTime) external view returns (bool) {
        if (!exists[policyId]) return false;
        Policy memory p = policies[policyId];
        return (atTime >= p.validFrom && atTime <= p.validUntil);
    }
}
