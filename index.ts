const { Command } = require("commander");
const {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  SystemProgram,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} = require("@solana/web3.js");
const fs = require("fs");

const program = new Command();
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

program
  .name("solana-cli-wallet")
  .description("CLI wallet for Solana")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate a new keypair")
  .action(() => {
    const keypair = Keypair.generate();
    const secretKey = JSON.stringify(Array.from(keypair.secretKey));
    fs.writeFileSync("keypair.json", secretKey);
    console.log("Keypair generated and saved to keypair.json");
  });

program
  .command("airdrop")
  .description("Request an airdrop of 1 SOL")
  .action(async () => {
    const secretKeyString = fs.readFileSync("keypair.json", "utf8");
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const keypair = Keypair.fromSecretKey(secretKey);
    const publicKey = keypair.publicKey;

    console.log(`Requesting airdrop for ${publicKey.toBase58()}`);
    const signature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(signature);
    console.log("Airdrop successful");
  });

program
  .command("send")
  .description("Send SOL to another wallet")
  .option("-r, --recipient <recipient>", "Recipient public key")
  .option("-a, --amount <amount>", "Amount of SOL to send")
  .action(async (options: any) => {
    const { recipient, amount } = options;

    if (!recipient || !amount) {
      console.error("Recipient and amount are required.");
      return;
    }

    const secretKeyString = fs.readFileSync("keypair.json", "utf8");
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const keypair = Keypair.fromSecretKey(secretKey);
    const publicKey = keypair.publicKey;

    const recipientPubkey = new PublicKey(recipient);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);
    console.log(`Transaction successful: ${signature}`);
  });

program.parse(process.argv);
