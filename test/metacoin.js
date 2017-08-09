var MetaCoin = artifacts.require("./MetaCoin.sol");

contract('MetaCoin', function(accounts) {
  it("should put 10000 MetaCoin in the first account", async function() {
    let meta = await MetaCoin.deployed();
    let balance = await meta.getBalance.call(accounts[0]);
    assert.equal(
      balance.valueOf(),
      10000,
      "10000 wasn't in the first account"
    );
  });

  it("should call a function that depends on a linked library", async function() {

    let meta = await MetaCoin.deployed();
    let metaCoinBalance = await meta.getBalance.call(accounts[0]);
    let metaCoinEthBalance = await meta.getBalanceInEth.call(accounts[0]);
    assert.equal(
      metaCoinEthBalance.toNumber(),
      2 * metaCoinBalance.toNumber(),
      "Library function returned unexpected function, linkage may be broken"
    );
  });

  it("should send coin correctly", async function() {
    let meta = await MetaCoin.deployed();

    // Get initial balances of first and second account.
    let account_one = accounts[0];
    let account_two = accounts[1];

    let account_one_starting_balance = await meta.getBalance.call(account_one);
    let account_two_starting_balance = await meta.getBalance.call(account_two);

    let amount = 10;
    await meta.sendCoin(account_two, amount, {from: account_one})

    let account_one_ending_balance = await meta.getBalance.call(account_one);
    let account_two_ending_balance = await meta.getBalance.call(account_two);

    assert.equal(
      account_one_ending_balance.toNumber(),
      account_one_starting_balance.toNumber() - amount,
      "Amount wasn't correctly taken from the sender"
    );
    assert.equal(
      account_two_ending_balance.toNumber(),
      account_two_starting_balance.toNumber() + amount,
      "Amount wasn't correctly sent to the receiver"
    );
  });
});


