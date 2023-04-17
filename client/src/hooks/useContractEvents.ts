import { useContext, useEffect } from 'react';
import EthersContext from '../../context/EthersContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ethers } from 'ethers';
import { IBookingCreatedEvent, IBookingReview, IMessageSentEvent, IPropertyRegisteredEvent, IReviewSubmittedEvent, IRewardWithdrawnEvent, IUserPointsAddedEvent, IUserRegisteredEvent, UserPointType } from '../../models/evmEvents';
import { IEventInput, getEvents, saveEvent } from '../../services/evmEventService';
import { addEvent, addEvents } from '../../store/slices/evmEventSlice';

const useContractEvents = () => {

  const { provider } = useContext(EthersContext);

  const contracts = useAppSelector((state) => state.solContract.contracts);
  const blockNumber = useAppSelector((state) => state.blockchain.blockNumber);

  const dispatch = useAppDispatch();

  useEffect(() => {
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

          //User Contract events
          const userContract = contracts.find(x => x.name === "User");
          if (userContract) {
            const evmUserContract = new ethers.Contract(userContract.address, userContract.abi, provider);
            evmUserContract.on("UserRegistered", async (owner, tokenId, tokenUri, event) => {
              const eventData: IUserRegisteredEvent = { owner, tokenId: tokenId.toString(), tokenUri }
              const eventResponse = await saveEvent({ eventName: "UserRegistered", contract: userContract.name, blockNumber: event.log.blockNumber, transactionHash: event.log.transactionHash, eventData: eventData });
              if (eventResponse.event) {
                dispatch(addEvent(eventResponse.event));
              }
            });
          }

          //Property Contract events
          const propertyContract = contracts.find(x => x.name === "Property");
          if (propertyContract) {
            const evmPropertyContract = new ethers.Contract(propertyContract.address, propertyContract.abi, provider);
            evmPropertyContract.on("PropertyRegistered", async (propertyId, owner, name, location, country, imageId, pricePerNight, description, event) => {
              const eventData: IPropertyRegisteredEvent = { propertyId: propertyId.toString(), owner, name, location, country, imageId, pricePerNight: pricePerNight.toString(), description }
              const eventResponse = await saveEvent({ eventName: "PropertyRegistered", contract: propertyContract.name, blockNumber: event.log.blockNumber, transactionHash: event.log.transactionHash, eventData: eventData });
              if (eventResponse.event) {
                dispatch(addEvent(eventResponse.event));
              }
            });
          }

          // Booking Contract events
          const bookingContract = contracts.find(x => x.name === "Booking");
          if (bookingContract) {
            const evmBookingContract = new ethers.Contract(bookingContract.address, bookingContract.abi, provider);
            evmBookingContract.on("BookingCreated", async (bookingId, propertyId, renter, startDate, endDate, totalPrice, platformFeesAmount, event) => {
              const eventData: IBookingCreatedEvent = { bookingId: bookingId.toString(), propertyId: propertyId.toString(), renter, startDate: startDate.toString(), endDate: endDate.toString(), totalPrice: totalPrice.toString(), platformFeesAmount: platformFeesAmount.toString() }
              const eventResponse = await saveEvent({ eventName: "BookingCreated", contract: bookingContract.name, blockNumber: event.log.blockNumber, transactionHash: event.log.transactionHash, eventData: eventData });
              if (eventResponse.event) {
                dispatch(addEvent(eventResponse.event));
              }
            });
          }

          // Rewards Contract events
          const rewardsContract = contracts.find(x => x.name === "Rewards");
          if (rewardsContract) {
            const evmRewardsContract = new ethers.Contract(rewardsContract.address, rewardsContract.abi, provider);

            // UserPointsAdded event
            evmRewardsContract.on("UserPointsAdded", async (user, points, month, pointType, event) => {
              const eventData: IUserPointsAddedEvent = {
                user,
                points: points.toString(),
                month: month.toString(),
                pointType: pointType.toString()
              }
              const eventResponse = await saveEvent({ eventName: "UserPointsAdded", contract: rewardsContract.name, blockNumber: event.log.blockNumber, transactionHash: event.log.transactionHash, eventData: eventData });
              if (eventResponse.event) {
                dispatch(addEvent(eventResponse.event));
              }
            });

            // RewardWithdrawn event
            evmRewardsContract.on("RewardWithdrawn", async (user, amount, month, event) => {
              const eventData: IRewardWithdrawnEvent = {
                user,
                amount: amount.toString(),
                month: month.toString(),
              }
              const eventResponse = await saveEvent({ eventName: "RewardWithdrawn", contract: rewardsContract.name, blockNumber: event.log.blockNumber, transactionHash: event.log.transactionHash, eventData: eventData });
              if (eventResponse.event) {
                dispatch(addEvent(eventResponse.event));
              }
            });
          }

          // Message Contract events
          const messageContract = contracts.find(x => x.name === "Messaging");
          if (messageContract) {
            const evmMessageContract = new ethers.Contract(messageContract.address, messageContract.abi, provider);

            // MessageSent event
            evmMessageContract.on("MessageSent", async (bookingId, sender, content, timestamp, event) => {
              const eventData: IMessageSentEvent = {
                bookingId: bookingId.toString(),
                sender,
                content,
                timestamp: timestamp.toString(),
              }
              const eventResponse = await saveEvent({ eventName: "MessageSent", contract: messageContract.name, blockNumber: event.log.blockNumber, transactionHash: event.log.transactionHash, eventData: eventData });
              if (eventResponse.event) {
                dispatch(addEvent(eventResponse.event));
              }
            });
          }

          // Review Contract events
          const reviewContract = contracts.find(x => x.name === "Review");
          if (reviewContract) {
            const evmReviewContract = new ethers.Contract(reviewContract.address, reviewContract.abi, provider);

            // ReviewSubmitted event
            evmReviewContract.on("ReviewSubmitted", async (reviewer, propertyId, bookingId, review, event) => {
              const reviewData: IBookingReview = {
                rating: review.rating.toString(),
                comment: review.comment,
                timestamp: review.timestamp.toString(),
              };

              const eventData: IReviewSubmittedEvent = {
                reviewer,
                propertyId: propertyId.toString(),
                bookingId: bookingId.toString(),
                review: reviewData,
              }
              const eventResponse = await saveEvent({ eventName: "ReviewSubmitted", contract: reviewContract.name, blockNumber: event.log.blockNumber, transactionHash: event.log.transactionHash, eventData: eventData });
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