var bip39 = require("bip39");
var ethWallet = require('ethereumjs-wallet');
var ProviderEngine = require("web3-provider-engine");
var FiltersSubprovider = require('web3-provider-engine/subproviders/filters.js');
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
var Web3 = require("web3");

function PrivateKeyWalletProvider(private_key, provider_url) {
  this.wallet = ethWallet.fromPrivateKey(Buffer.from(private_key, 'hex'));
  this.address = "0x" + this.wallet.getAddress().toString("hex");

  this.engine = new ProviderEngine();
  this.engine.addProvider(new WalletSubprovider(this.wallet, {}));
  this.engine.addProvider(new FiltersSubprovider());
  this.engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(provider_url)));
  this.engine.start(); // Required by the provider engine.
};

PrivateKeyWalletProvider.prototype.sendAsync = function() {
  this.engine.sendAsync.apply(this.engine, arguments);
};

PrivateKeyWalletProvider.prototype.send = function() {
  return this.engine.send.apply(this.engine, arguments);
};

PrivateKeyWalletProvider.prototype.getAddress = function() {
  return this.address;
};

module.exports = PrivateKeyWalletProvider;
