const algosdk = require('algosdk');

// Set up the Algorand client
const client = new algosdk.Algod(
  "https://testnet-algorand.api.purestake.io/ps2",
  "<API key>",
  "<API token>"
);

// Replace with the address of the token's creator
const creatorAddress = "your creator address here";

// Replace with the address of the buyer
const buyerAddress = "your buyer address here";

// Replace with the token ID of the token being purchased
const tokenID = "your token ID here";

// Replace with the amount of Algos the buyer is sending to purchase the token
const algosAmount = 100;

// Get the current block information
client.status().then(async (status) => {
  // Create a transaction to transfer Algos from the buyer to the creator
  const tx = await algosdk.makePaymentTx(
    buyerAddress,
    creatorAddress,
    algosAmount,
    status.lastRound,
    status.lastRound + 1000,
    "<buyer secret key>"
  );

  // Sign the transaction
  const signedTx = tx.signTx("<buyer secret key>");

  // Send the transaction to the network
  client.sendRawTransaction(signedTx).then((txid) => {
    console.log(`Transaction ID: ${txid}`);

    // Check if the transaction was successful
    client.pendingTransactionInformation(txid).then(async (transaction) => {
      if (transaction.status !== "Pending") {
        console.error("The transaction failed!");
        return;
      }

      // Create a transaction to transfer the tokens from the creator to the buyer
      const tx = await algosdk.makeAssetTransferTx(
        creatorAddress,
        buyerAddress,
        tokenID,
        algosAmount,
        "<creator secret key>"
      );

      // Sign the transaction
      const signedTx = tx.signTx("<creator secret key>");

      // Send the transaction to the network
      client.sendRawTransaction(signedTx).then((txid) => {
        console.log(`Transaction ID: ${txid}`);
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error);
    });
  }).catch((error) => {
    console.error(error);
  });
}).catch((error) => {
 
