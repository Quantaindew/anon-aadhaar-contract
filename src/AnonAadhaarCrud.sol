// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "../interfaces/IAnonAadhaar.sol";

contract AnonAadhaarIdentity {
    address public anonAadhaarVerifierAddr;

    struct User {
        uint256 nullifierSeed;
        uint256 nullifier;
        uint256[4] revealedData; // [ageAbove18, gender, state, pincode]
        bool exists;
    }

    mapping(address => User) public users;

    event UserAdded(address indexed userAddress, uint256 nullifier);

    constructor(address _verifierAddr) {
        // anonAadhaarVerifierAddr  should be the contract address
        anonAadhaarVerifierAddr = _verifierAddr;
    }

    /// @dev Convert an address to uint256, used to check against signal.
    /// @param _addr: msg.sender address.
    /// @return Address msg.sender's address in uint256
    function addressToUint256(address _addr) private pure returns (uint256) {
        return uint256(uint160(_addr));
    }

    /// @dev Add a user to the contract.
    /// @param nullifierSeed: Nullifier Seed used while generating the proof.
    /// @param nullifier: Nullifier for the user's Aadhaar data.
    /// @param timestamp: Timestamp of when the QR code was signed.
    /// @param signal: signal used while generating the proof, should be equal to msg.sender.
    /// @param revealArray: Array of the values used as input for the proof generation.
    /// @param groth16Proof: SNARK Groth16 proof.
    function addUser(
        uint256 nullifierSeed,
        uint256 nullifier,
        uint256 timestamp,
        uint256 signal,
        uint256[4] memory revealArray,
        uint256[8] memory groth16Proof
    ) public {
        require(
            !users[msg.sender].exists,
            '[AnonAadhaarIdentity]: User already exists'
        );
        require(
            addressToUint256(msg.sender) == signal,
            '[AnonAadhaarIdentity]: Wrong user signal sent.'
        );
        require(
            IAnonAadhaar(anonAadhaarVerifierAddr).verifyAnonAadhaarProof(
                nullifierSeed,
                nullifier,
                timestamp,
                signal,
                revealArray,
                groth16Proof
            ),
            '[AnonAadhaarIdentity]: Proof sent is not valid.'
        );

        users[msg.sender] = User(nullifierSeed, nullifier, revealArray, true);
        emit UserAdded(msg.sender, nullifier);
    }

    /// @dev Get user information.
    /// @param userAddress: Address of the user to retrieve.
    /// @
    function getUser(address userAddress) public view returns (
        uint256 nullifierSeed,
        uint256 nullifier,
        uint256[4] memory revealedData
    ) {
        require(
            users[userAddress].exists,
            '[AnonAadhaarIdentity]: User does not exist'
        );
        User memory user = users[userAddress];
        
        return (user.nullifierSeed, user.nullifier, user.revealedData);
        

    }