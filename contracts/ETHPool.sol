//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ETHPool is Ownable, ReentrancyGuard {
  using SafeMath for uint256;
  using EnumerableSet for EnumerableSet.AddressSet;

  event Deposit(address account, uint256 amount);

  EnumerableSet.AddressSet private teams;
  uint256 aprPercent = 15;
  uint256 unlockPeriod = 7 days;

  mapping(address => uint256) public deposits;
  mapping(address => uint256) public lastUpdate;
  mapping(address => uint256) public rewardDeposits;
  uint256 public minAmount = 1;
  uint256 public totalRewards;
  uint256 public totalDeposits;


  constructor (uint256 _minAmount) {
    minAmount = _minAmount;
  }
  

  // owner function
  function registerTeamAccount (address _account, bool _allow) public onlyOwner {
    if(_allow) {
      teams.add(_account);
    } else {
      teams.remove(_account);
    }
    
  }

  // team function

  function depositReward () public payable nonReentrant {
    require(teams.contains(msg.sender), "Not Team Account!");
    rewardDeposits[msg.sender] = msg.value;
    totalRewards += msg.value;
  }

  // users function

  function userDeposit () external payable nonReentrant {
    require(msg.value >= minAmount, "Not Enough Value!");
    uint256 reward = pendingReward(msg.sender);
    if(reward > 0 && block.timestamp >= lastUpdate[msg.sender] + unlockPeriod) {
      payable(msg.sender).transfer(reward);
    }
    deposits[msg.sender] = msg.value;
    lastUpdate[msg.sender] = block.timestamp;
    totalDeposits += msg.value;
    emit Deposit(msg.sender, msg.value);
  }

  function withdraw(uint256 amount) public nonReentrant {
    require(deposits[msg.sender] > amount, "Not Enough User Balance!");
    uint256 reward = pendingReward(msg.sender);
    if (reward > 0 && block.timestamp >= lastUpdate[msg.sender] + unlockPeriod) {
      payable(msg.sender).transfer(reward);
    }
    deposits[msg.sender] -= amount;
    lastUpdate[msg.sender] = block.timestamp;
    payable(msg.sender).transfer(amount);
  }

  function harvest() external nonReentrant {
    require(deposits[msg.sender] > 0, "No Balance to withdraw!");
    require(block.timestamp >= lastUpdate[msg.sender].add(unlockPeriod), "You can't harvest yet!");
    uint256 reward = pendingReward(msg.sender);
    if(reward > 0) {
      payable(msg.sender).transfer(reward);
    }
    lastUpdate[msg.sender] = block.timestamp;
  }

  function pendingReward(address account) public view returns (uint256) {
    uint256 reward;
    if (totalRewards > 0) {
      if(totalDeposits > 0) {
        reward = deposits[account].div(totalDeposits) * totalRewards;
      } else {
        reward = 0;
      }
    } else {
      reward = 0;
    }
    return reward;
  }
}