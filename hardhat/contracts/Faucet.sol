//SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Faucet{
    address payable owner;
    IERC20 public token;

    uint256 withdrawlAmount = 50 * (10**18);
    mapping(address =>uint256) nextAccessTime;

    uint256 lockTime = 1 minutes;

    event withdraw(address indexed to, uint256 indexed amount);
    event Deposit(address  indexed from , uint256 indexed amount);


    constructor(address tokenAddress) payable{
        token = IERC20(tokenAddress);
        owner = payable(msg.sender);
    }

    function requestTokens() public{
        require(msg.sender !=address(0),"Request  must not originate from a zero account");
        require(token.balanceOf(address(this)) >= withdrawlAmount,"Insufficient balance in faucet");
        require(block.timestamp >= nextAccessTime[msg.sender],"insufficient time , try again later");

        nextAccessTime[msg.sender] = block.timestamp + lockTime;
        token.transfer(msg.sender, withdrawlAmount);

    }

    function recieve() external payable{
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256){
        return token.balanceOf(address(this));
    }

    function setWithdrawlAmount(uint256 amount) public onlyOwner {
        withdrawlAmount = amount * (10**18);
    }

    modifier onlyOwner(){
        require(msg.sender == owner,"only owner can call this function");
        _;
    }

    function setLockTime(uint256 amount) public onlyOwner{
        lockTime = amount * 1 minutes;
    }

    function withdrawl() external onlyOwner{
        emit withdraw(msg.sender, token.balanceOf(address(this)));
        token.transfer(msg.sender, token.balanceOf(address(this)));
    } 


}