import React, { Component } from "react";
import EscribirEnLaBlockchain from "./contracts/EscribirEnLaBlockchain.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { 
    valorActual: "",
    nuevoValor: "",
    web3: null, 
    accounts: null, 
    contract: null 
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EscribirEnLaBlockchain.networks[networkId];
      const instance = new web3.eth.Contract(
        EscribirEnLaBlockchain.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });

      const response = await this.state.contract.methods.Leer().call();
      this.setState({
        valorActual :response
      })

     

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  storeValue = async (event) => {
    event.preventDefault();

    const { accounts, contract } = this.state;

    try{
          // Stores a new value in blockchain
        await contract.methods.Escribir(this.state.nuevoValor).send({ from: accounts[0] });

        const response = await this.state.contract.methods.Leer().call();
        
        this.setState({
          valorActual :response
          })
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error
      );
      console.error(error);
    }

    
  };

  handleChangevalue = (event) => {
    this.setState ({
      nuevoValor  : event.target.value
    })
  }

  render() {
   if (!this.state.web3) {
      return <div>Cargando Web3, cuentas, y contratos..</div>;
    }
    return (
    <div  className="App">
      
      <div class="app" >

      <h3>EscribirEnLaBlockchain </h3>

       <label class="renglon">El valor en la Blockchain es:  <b class="valorEnBlockchain" >{this.state.valorActual}</b> </label>
       <br/>
       <br/>

       <form onSubmit={this.storeValue}>
       <label  class="nuevoValor" >Escribe el nuevo valor que deseas asignar</label>
       <br/>
       
       <input class="input-text" type="text" value={this.state.nuevoValor} onChange={this.handleChangevalue}></input>
       <br/>
       <input class="input" type="submit" value="Almacenar nuevo valor"></input>
       </form>
      </div>

</div>
    );
  }
}

export default App;
