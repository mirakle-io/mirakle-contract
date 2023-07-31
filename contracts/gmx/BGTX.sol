// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../tokens/MintableBaseToken.sol";

contract BGTX is MintableBaseToken {
    constructor() public MintableBaseToken("BGTX", "BGTX", 0) {}

    function id() external pure returns (string memory _name) {
        return "BGTX";
    }
}
