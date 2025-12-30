// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakeInNature is ERC20, Ownable {
    uint256 public constant MINIMUM_STAKE = 900 * 10**18; 
    uint256 public constant REWARD_PERCENTAGE = 8; 

    mapping(address => uint256) public stakedBalance;
    mapping(address => bool) public isValidated;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event Slashed(address indexed user, uint256 amount);
    event UserValidated(address indexed user, uint256 reward);

    constructor(uint256 initialSupply) ERC20("Stake in Nature", "SIN") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function stake(uint256 amount) external {
        require(amount >= MINIMUM_STAKE, "Minimum stake is 900 SIN");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be > 0");

        stakedBalance[msg.sender] += amount;
        _burn(msg.sender, amount);

        emit Staked(msg.sender, amount);
    }

    function slashUser(address user) external onlyOwner {
        require(stakedBalance[user] > 0, "No staked balance to slash");

        uint256 slashedAmount = stakedBalance[user];
        stakedBalance[user] = 0;
        isValidated[user] = false;

        emit Slashed(user, slashedAmount);
    }

    function validateUser(address user) external onlyOwner {
        require(!isValidated[user], "User already validated");
        require(stakedBalance[user] >= MINIMUM_STAKE, "User must have at least 900 SIN staked");

        uint256 reward = (stakedBalance[user] * REWARD_PERCENTAGE) / 100;

     
        stakedBalance[user] += reward;
        
       
        isValidated[user] = true;

        emit UserValidated(user, reward);
    }

    function unstake(uint256 amount) external {
        require(isValidated[msg.sender], "User not validated yet");
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");
        require(amount > 0, "Amount must be > 0");

       
        stakedBalance[msg.sender] -= amount;
        
       
        _mint(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    function unstakeAll() external {
        require(isValidated[msg.sender], "User not validated yet");
        require(stakedBalance[msg.sender] > 0, "No staked balance");

        uint256 amount = stakedBalance[msg.sender];
        
        
        stakedBalance[msg.sender] = 0;
        
       
        isValidated[msg.sender] = false;
        
        
        _mint(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    function getStakedBalance(address user) external view returns (uint256) {
        return stakedBalance[user];
    }
}