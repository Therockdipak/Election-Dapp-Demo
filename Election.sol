// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Election {
    address public ElectionComission;
    uint256 public candidatesCount;

    enum Candidtae{BJP, Congress, AAP}

    mapping(uint => uint) public votes;
    mapping(address => bool) public voters;

    event voted(address indexed _voter, bool voted);

    constructor() {
        ElectionComission = msg.sender;
    }

    modifier onlyElectionComission {
        require(msg.sender == ElectionComission,"strictly prohibited");
        _; 
    }

    function addVoters(address _voter) public onlyElectionComission{
        voters[_voter] = true;
    }

    function removeVoters(address _voter) public onlyElectionComission {
        voters[_voter] = false;
    }

    function vote(uint256 _candidate) public {
        require(voters[msg.sender] ,"you are not eligible to vote");
        require(_candidate >=0 && _candidate <= 2,"invalid candidate");
        votes[_candidate] ++;
        voters[msg.sender] = true;
        emit voted(msg.sender, true);
    }
}