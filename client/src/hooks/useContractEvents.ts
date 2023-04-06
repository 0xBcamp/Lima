import { useContext, useEffect } from 'react';
import EthersContext from '../../context/EthersContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ethers } from 'ethers';
import { IUserRegisteredEvent } from '../../models/evmEvents';
import { IEventInput, getEvents, saveEvent } from '../../services/evmEventService';
import { addEvent, addEvents } from '../../store/slices/evmEventSlice';

const useContractEvents = () => {

  const { provider } = useContext(EthersContext);

  const contracts = useAppSelector((state) => state.solContract.contracts);
  const blockNumber = useAppSelector((state) => state.blockchain.blockNumber);

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('contracts :>> ', contracts);

    
    
    if (contracts && contracts?.length > 0 && provider) {
      const fetchEvents = async () => {
        try {
          dispatch(addEvents(await getEvents()));
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      const listenEvents = async () => {
        try {
          dispatch(addEvents(await getEvents()));

          //User Contract events
          const userContract = contracts.find(x => x.name === "User");
          if (userContract) {
            const evmUserContract = new ethers.Contract(userContract.address, userContract.abi, provider);
            evmUserContract.on("UserRegistered", async (owner, tokenId, firstName, lastName, event) => {
              const eventData: IUserRegisteredEvent = { owner, tokenId: tokenId.toString(), firstName, lastName }
              const eventResponse = await saveEvent({ eventName: "UserRegistered", contract: userContract.name, blockNumber: event.log.blockNumber, transactionHash: event.log.transactionHash, eventData: eventData });
              if (eventResponse.event) {
                dispatch(addEvent(eventResponse.event));
              }
            });
          }

        } catch (error) {
          console.error("Error listening to events:", error);
        }
      };

      fetchEvents();
      listenEvents();

      // Clean up event listener when the component is unmounted
      // return () => {
      //   const contract = new ethers.Contract(contractAddress, contractABI, provider);
      //   contract.removeAllListeners(eventName);
      // };
    }



  }, [contracts, provider]);
};

export default useContractEvents;