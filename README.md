```            
  ____   ___   _   _   ___ 
 |_  /  / _ \ | | | | / __|
  / /  |  __/ | |_| | \__ \
 /___|  \___|  \__,_| |___/  IDE
            
```

Start the Zeus IDE with [Gitpod](https://gitpod.io/workspaces/)

Documentation: [http://liquidapps.gitbook.io/](http://liquidapps.gitbook.io/)

Zeus is creating `mycontract.cpp` and `mycontract.spec.js` using the `simplecontract` template, compiling, and running an example unit test.  This is a basic smart contract, to create a smart contract with all of the DAPP Network service includes run:

```bash
cd /workspace/zeus-ide
mkdir all-dapp-services; cd all-dapp-services
zeus box create
zeus unbox all-dapp-services
zeus test -c
```
