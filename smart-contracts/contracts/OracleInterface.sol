// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title OracleInterface
/// @notice Minimal oracle interface the ClaimRegistry expects
interface OracleInterface {
    /// Called by ClaimRegistry to request verification. Oracle should call `fulfillRequest`
    /// (off-chain or on-chain depending on implementation) to return result.
    function requestData(bytes32 requestId, string calldata endpoint) external;
}
