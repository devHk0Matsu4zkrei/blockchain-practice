// promise have 3 states: pending fulfilled rejected

//tiene un problema que no puede calcular la cantidad de gas y sale error.
// const ethers = require( "ethers" );
// const fse = require( "fs" );
// const fs = require( "fs-extra" );
// require( "dotenv" ).config();
import { ethers } from "ethers";
import * as fs from "fs-extra";
import "dotenv/config";

async function main() {
  // compile then in our code
  // complite them separately
  // HTTP://0.0.0.0:7545
  const provider = new ethers.providers.JsonRpcProvider( process.env.RPC_URL2! ); //no esta que reconoce si no es la v5.7.2 del paquete ethers
  // en wallet no me reconoce con private_key en el .env file con el 0x tiene que euitar el 0x para que te lo reconosca
  // console.log(process.env.PRIVATE_KEY);
  // const wallet = new ethers.Wallet( process.env.PRIVATE_KEY2!, provider );

  /*  // pasan js a ts pide any y se aplica de la siguiente manera 
  const TestConstructorFunction = function (this: any, a: any, b: any) {
    this.a = a;
    this.b = b;
  };
  let test1 = new (TestConstructorFunction as any)(1, 2);
  */ //cualquier otra forma es erronea
  const encryptedJson = fs.readFileSync( "./.encryptedkey2.json", "utf8" );
  let wallet = new ( ethers.Wallet.fromEncryptedJsonSync as any )(
    encryptedJson,
    process.env.PRIVATE_KEY2_PSW
  );

  wallet = await wallet.connect( provider );
  const abi = fs.readFileSync( "./simpleStorage_sol_SimpleStorage.abi", "utf8" );
  const binary = fs.readFileSync(
    "./simpleStorage_sol_SimpleStorage.bin",
    "utf8",
  );
  const contractFactory = new ethers.ContractFactory( abi, binary, wallet );
  console.log( "Deploying, please wait ..." );
  // saying stop, need to wait for the contract to be deployed
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait( 1 );
  console.log( "Here is the deployment transaction response:  " );
  console.log( `Contract Address: ${contract.address}` );
  // obtener el numero
  const currentFavoriteNumber = await contract.retrieve();
  console.log( `Current Favorite Number: ${currentFavoriteNumber.toString()}` );
  // pasar un numero grande a string porque javascript tiene problemas en reconocerlo
  const transactionResponse = await contract.store( "7" );
  const transactionReciept = await transactionResponse.wait( 1 );
  const updatedFavoriteNumber = await contract.retrieve();
  console.log( `Update favorite number is: ${updatedFavoriteNumber}` );
}
main()
  .then( () => process.exit( 0 ) )
  .catch( ( Error ) => {
    console.error( Error );
    process.exit( 1 );
  } );

