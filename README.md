```            
  ____   ___   _   _   ___ 
 |_  /  / _ \ | | | | / __|
  / /  |  __/ | |_| | \__ \
 /___|  \___|  \__,_| |___/  IDE
            
```

Start the Zeus IDE with [Gitpod](https://gitpod.io/#https://github.com/liquidapps-io/zeus-ide)

Zeus is creating `mycontract.cpp` and `mycontract.spec.js` compiling and running an example unit test.  This is a basic smart contract, to create a smart contract with all of the DAPP Network service includes run:

```bash
cd /workspace/zeus-ide
mkdir all-dapp-services; cd all-dapp-services
zeus box create
zeus unbox all-dapp-services
zeus test -c
```
