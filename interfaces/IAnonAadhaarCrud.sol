// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

interface IAnonAadhaarCrud {
    function addUser(
        uint256 nullifierSeed,
        uint256 nullifier,
        uint256 timestamp,
        uint256 signal,
        uint256[4] memory revealArray,
        uint256[8] memory groth16Proof
    ) external;

    function getUser(address userAddress) external view returns (
        uint256 nullifierSeed,
        uint256 nullifier,
        uint256[4] memory revealedData
    );
}