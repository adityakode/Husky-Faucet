//SPDX-License-Identifier:MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract HuskyToken is ERC20,ERC20Capped,ERC20Burnable{
    address payable public owner;
    uint256 blockReward;


constructor(uint256 cap,uint256 reward) ERC20("HuskyToken","HKY") ERC20Capped(cap*(10**18)){
    owner = payable(msg.sender);
    _mint(owner,69000000*(10**decimals()));
    blockReward = reward*(10 ** decimals());

}
     function _mint(address account, uint256 amount) internal virtual override(ERC20Capped,ERC20) {
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }

    function setBlockReward(uint256 reward) public onlyOwner {
            blockReward = reward*(10 ** decimals());
    }

    function _mintMyReward() internal{
        _mint(block.coinbase,blockReward);
    }

    function _beforeTokenTransfer(address from , address to , address value) internal virtual {
        if(from !=address(0) && to != block.coinbase && block.coinbase !=address(0)){

        _mintMyReward();
        }
    }

    function destroy() public onlyOwner{
        selfdestruct(owner);
    }

    modifier onlyOwner{
        require(msg.sender == owner,"You are not the owner");
        _;
    }






}