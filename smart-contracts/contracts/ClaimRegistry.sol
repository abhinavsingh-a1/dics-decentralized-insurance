// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IOracle {
    function requestData(bytes32 requestId, string calldata endpoint) external;
}

/// @title ClaimRegistry — Registers claims, manages lifecycle, performs payouts (token)
contract ClaimRegistry is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant UNDERWRITER_ROLE = keccak256("UNDERWRITER_ROLE");

    enum ClaimStatus { Submitted, UnderReview, Approved, Paid, Rejected }

    struct Claim {
        uint256 claimId;
        uint256 policyId;
        address claimant;
        bytes32 merkleRoot; // plaint text: root hash of documents
        uint256 amount; // token amount in smallest denom
        ClaimStatus status;
        uint256 submittedAt;
        uint256 processedAt;
    }

    uint256 public nextClaimId = 1;
    mapping(uint256 => Claim) public claims;
    mapping(uint256 => uint256[]) public policyClaims;

    // Optional oracle mapping (requestId => claimId)
    mapping(bytes32 => uint256) public oracleRequests;

    // events
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed policyId, address indexed claimant, bytes32 merkleRoot, uint256 amount, uint256 timestamp);
    event ClaimStatusChanged(uint256 indexed claimId, ClaimStatus status);
    event ClaimPayout(uint256 indexed claimId, address indexed to, uint256 amount, address token);

    IOracle public oracle;
    address public payoutToken; // an ERC20 token used for payouts

    constructor(address admin, address oracleAddress, address tokenAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        //_setupRole(DEFAULT_ADMIN_ROLE, admin);
        //_setupRole(ADMIN_ROLE, admin);
        oracle = IOracle(oracleAddress);
        payoutToken = tokenAddress;
    }

    function submitClaim(uint256 policyId, bytes32 merkleRoot, uint256 amount) external returns (uint256) {
        uint256 id = nextClaimId++;
        Claim storage c = claims[id];
        c.claimId = id;
        c.policyId = policyId;
        c.claimant = msg.sender;
        c.merkleRoot = merkleRoot;
        c.amount = amount;
        c.status = ClaimStatus.Submitted;
        c.submittedAt = block.timestamp;
        policyClaims[policyId].push(id);

        emit ClaimSubmitted(id, policyId, msg.sender, merkleRoot, amount, block.timestamp);

        return id;
    }

    function setClaimStatus(uint256 claimId, ClaimStatus status) external onlyRole(UNDERWRITER_ROLE) {
        Claim storage c = claims[claimId];
        require(c.claimId != 0, "Claim not found");
        c.status = status;
        if (status == ClaimStatus.Approved || status == ClaimStatus.Rejected) {
            c.processedAt = block.timestamp;
        }
        emit ClaimStatusChanged(claimId, status);
    }

    /// underwriter triggers payout after approval; contract must have token allowance or balance
    function payoutClaim(uint256 claimId) external onlyRole(UNDERWRITER_ROLE) {
        Claim storage c = claims[claimId];
        require(c.claimId != 0, "Claim not found");
        require(c.status == ClaimStatus.Approved, "Claim not approved");
        c.status = ClaimStatus.Paid;
        c.processedAt = block.timestamp;
        IERC20 token = IERC20(payoutToken);
        require(token.transfer(c.claimant, c.amount), "Payout failed");
        emit ClaimPayout(claimId, c.claimant, c.amount, payoutToken);
    }

    /// Request off-chain verification via oracle (example flow)
    function requestOracleVerification(uint256 claimId, string calldata endpoint) external onlyRole(ADMIN_ROLE) {
        bytes32 req = keccak256(abi.encodePacked(block.timestamp, claimId, endpoint));
        oracleRequests[req] = claimId;
        oracle.requestData(req, endpoint);
        // Oracle would call back to a fulfilment method (off-chain or another contract)
    }

    // Admin can update the oracle address and token
    function setOracle(address oracleAddress) external onlyRole(ADMIN_ROLE) {
        oracle = IOracle(oracleAddress);
    }

    function setPayoutToken(address tokenAddress) external onlyRole(ADMIN_ROLE) {
        payoutToken = tokenAddress;
    }

    // getters for policy claims
    function getClaimsForPolicy(uint256 policyId) external view returns (uint256[] memory) {
        return policyClaims[policyId];
    }
}
