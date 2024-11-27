// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.27;

contract Token {
    string private _name;
    string private _symbol;
    uint256 private _totalSuply;

    address public _owner;

    mapping (address => uint256) _balances;
    mapping (address => mapping(address => uint256)) _allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);


    constructor(string memory name_, string memory symbol_) {
        _owner = msg.sender;
        _name = name_;
        _symbol = symbol_;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public pure returns (uint8) {
        return 18;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSuply;
    }

    function balanceOf(address owner) public view returns (uint256) {
        return _balances[owner];
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "Invalid to address.");
        require(value <= _balances[msg.sender], "Insufficient funds.");

        _balances[msg.sender] -= value;
        _balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(from != address(0), "Invalid from address.");
        require(to != address(0), "Invalid to address.");
        require(value <= _allowances[from][msg.sender], "Value can not exceed allowance");
        require(value <= _balances[from], "Insufficient funds.");

        spendAllowance(from, _allowances[from][msg.sender] - value);

        _balances[from] -= value;
        _balances[to] += value;
        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        require(spender != address(0), "Invalid spender address.");

        _allowances[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function spendAllowance(address owner, uint256 value) internal {
        _allowances[owner][msg.sender] = value;
        emit Approval(owner, msg.sender, value);
    }

    function mint(address recipient, uint256 value) public OnlyOwner(msg.sender) Valid(recipient) {
        _totalSuply += value;
        _balances[recipient] += value;
        emit Transfer(address(0), recipient, value);
    }

    function burn(address account, uint256 value) public 
        OnlyOwner(msg.sender)
        Valid(account)
        CheckBalance(account, value) {
            _totalSuply -= value;
            _balances[account] -= value;
            emit Transfer(account, address(0), value);
    }

    modifier OnlyOwner(address sender) {
        require(sender == _owner, "You are not an owner.");
        _;
    }

    modifier Valid(address account) {
        require(account != address(0), "Invalid account address.");
        _;
    }

    modifier CheckBalance(address account, uint256 value) {
        require(value <= _balances[account], "Insufficient funds to burn.");
        _;
    }
}