//nececitas agregar tyscript
//yarn add typescript ts-node
//yarn add @types/fs-extra

// const ethers = require( "ethers" );
// const fse = require( "fs" );
// const fs = require( "fs-extra" );
// require( "dotenv" ).config();
import { ethers } from "ethers";
import * as fs from "fs-extra";
import "dotenv/config";

async function main() {
  const wallet = new ethers.Wallet( process.env.PRIVATE_KEY2! );

  const encryptedJsonkey2 = await wallet.encrypt(
    process.env.PRIVATE_KEY2_PSW!,
    process.env.PRIVATE_KEY2!,
  );
  console.log( encryptedJsonkey2 );
  fs.writeFileSync( "./.encryptedkey2.json", encryptedJsonkey2 );
}

main()
  .then( () => process.exit( 0 ) )
  .catch( ( Error ) => {
    console.error( Error );
    process.exit( 1 );
  } );
