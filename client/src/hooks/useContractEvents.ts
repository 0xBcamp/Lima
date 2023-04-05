import { useContext, useEffect } from 'react';
import EthersContext from '../../context/EthersContext';
import { getAccounts } from '../../services/accountService';
import { getSolContracts } from '../../services/solContractService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setAccounts, setSelectedAccount } from '../../store/slices/accountSlice';
import { setBlock, setBlocknumber } from '../../store/slices/blockchainSlice';
import { setSolContracts } from '../../store/slices/solContractSlice';
import { ethers } from 'ethers';
import { AbiTypesEnum } from '@/enums/AbiTypesEnum';

const useContractEvents = () => {

  const { provider } = useContext(EthersContext);

  const contracts = useAppSelector((state) => state.solContract.contracts);

  const dispatch = useAppDispatch();

  // useEffect(() => {

  // }, [contracts]);


  //Listining to events
  useEffect(() => {
    console.log('contracts :>> ', contracts);

    if (contracts && contracts?.length > 0) {
      const fetchEvents = async () => {
        try {

          const userContract = contracts.find(x => x.name === "User");
          if (userContract) {
            console.log('userContract :>> ', userContract);
            const evmUserContract = new ethers.Contract(userContract.address, userContract.abi, provider);
            evmUserContract.on("UserNFTMinted", (owner, tokenId, tokenURI) => {
              console.log("owner, tokenId, tokenURI", owner, tokenId, tokenURI);
          });
          }
          // for (let index = 0; index < contracts.length; index++) {
          //   const contract = contracts[index];
          //   const evmContract = new ethers.Contract(contract.address, contract.abi, provider);

          //   const contractEvents = contract.abi.filter(x => x.type === AbiTypesEnum.Event);

          //   if (contractEvents && contractEvents?.length > 0) {
          //     for (let eventIndex = 0; eventIndex < contractEvents.length; eventIndex++) {
          //       const event = contractEvents[eventIndex];

          //       console.log("event", event);

          //       if (event.name) {
          //         // Fetch previous events
          //         const pastEvents = await evmContract.queryFilter(event.name);
          //         console.log('pastEvents :>> ', pastEvents);

          //         //Listen for new events
          //         evmContract.on(event.name, (newEvent) => {
          //           // Retrieve event data
                    
          //           console.log("newEvent dir");
          //           console.dir(newEvent, { depth: null });

          //           const eventData = {
          //             name: event.name,
          //             args: newEvent.args,
          //             blockNumber: newEvent.blockNumber,
          //             transactionHash: newEvent.transactionHash,
          //           };

          //           console.log("eventData", eventData);

          //           //setEvents((existingEvents) => [...existingEvents, event]);
          //         });
          //       }
          //       // 

          //       // setEvents(pastEvents);

          //       // // Listen for new events
          //       // contract.on(eventName, (event) => {
          //       //   setEvents((existingEvents) => [...existingEvents, event]);
          //       // });
          //     }
          //   }


          // }
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      fetchEvents();

      // Clean up event listener when the component is unmounted
      // return () => {
      //   const contract = new ethers.Contract(contractAddress, contractABI, provider);
      //   contract.removeAllListeners(eventName);
      // };
   }



  }, [contracts]);
};

export default useContractEvents;