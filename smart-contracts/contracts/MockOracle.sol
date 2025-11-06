// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MockOracle {
    event OracleRequested(bytes32 indexed requestId, string endpoint);

    function requestData(bytes32 requestId, string calldata endpoint) external {
        emit OracleRequested(requestId, endpoint);
    }
}
