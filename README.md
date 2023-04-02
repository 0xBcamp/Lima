
<p align="center">
  <img width="auto" height="300" src="logo_black.png">
</p>

## Problem
The current property booking industry is dominated by centralized platforms such as Airbnb, which often charge high fees, restrict control over property listings, and are prone to data breaches and fraud. Moreover, these platforms lack the ability to tokenize assets and enable fractional ownership, limiting opportunities for hosts and guests. Traditional payment methods can also be slow and expensive, creating friction in the booking process. A decentralized solution is needed to address these challenges and offer greater flexibility and security.

## Solution
We propose a decentralized property booking platform built on blockchain technology, enabling secure, transparent, and efficient property bookings. The platform will utilize NFTs or ERC1155 tokens to represent property listings and enable fractional ownership. Users can buy, sell, and transfer properties, while detailed descriptions, images, and search filters help guests find the perfect property. An auction system, decentralized identity and reputation system, and peer-to-peer communication will ensure a seamless user experience. The platform will integrate utility tokens and stablecoins for payments, rewards, and incentives, while DAO and analytics features will encourage community participation and provide insights. Lastly, insurance policies can be integrated for additional security and peace of mind.


## Why it is important?
A decentralized property booking platform offers numerous benefits, including:

- Lower fees and increased control for hosts, enabling them to better manage their properties and maximize their profits.
- Enhanced security through blockchain technology and decentralized identity verification, reducing the risk of fraud and data breaches.
- Faster, cheaper, and more predictable payments through the integration of stablecoins and utility tokens.
- Improved trust and transparency through a decentralized reputation system, auction system, and DAO governance.
- Customizable smart contracts and analytics features, allowing hosts to tailor their offerings and optimize their property management strategies.
- Offering new investment opportunities through fractional property ownership and token-based incentives, while also allowing users to share in the platform's profits.
</div>

## Revenue Model
<p>HomeChain employs a diverse set of income streams to ensure a sustainable and profitable platform for all stakeholders. The primary source of revenue comes from modest transaction fees on bookings, which are significantly lower than those of traditional centralized platforms. These fees are shared among token holders, fostering a sense of community ownership and incentivizing user participation.</p>

<p>Another aspect of HomeChain's revenue model is the potential income generated through fractional property ownership. By tokenizing properties, the platform enables users to buy, sell, and trade fractions of properties, creating new investment opportunities and revenue channels.</p>

<p>Furthermore, HomeChain's native utility token plays a crucial role in the platform's financial ecosystem. Users can earn rewards and incentives for participating in platform activities, while also benefiting from the token's potential appreciation in value.</p>

## Becoming a host
<p>Becoming a host on HomeChain is a straightforward process designed to empower users with the tools they need to list and manage their properties. To get started, users simply need to create an account and verify their identity through the decentralized identity system. This ensures a secure and trusted environment for both hosts and guests.</p>

<p>Once the identity verification is complete, property owners can tokenize their property using blockchain technology. This innovative approach allows for efficient management and secure transactions within the platform. Hosts can set their preferences, such as booking policies and pricing, ensuring that their property listing aligns with their expectations and requirements.</p>

<p>With the property tokenized and preferences set, hosts can manage availability using the real-time booking calendar. HomeChain's user-friendly interface and decentralized infrastructure make it easy for property owners to become hosts, offering their properties for booking and generating income through the platform.</p>

## Roadmap
1. **Develop blockchain infrastructure:** Smart contracts, property tokenization, and identity verification.
2. **Deploy user-friendly interface:** Streamlined property listing, booking, and management.
3. **Implement decentralized identity and reputation system:** Enhance trust and ensure privacy.
4. **Integrate stablecoin payments and tokenomics:** Native utility token, rewards, incentives, and profit-sharing.
5. **Establish secure peer-to-peer communication:** Encrypted messaging and efficient dispute resolution.
6. **Enable fractional property ownership:** Diversified investment opportunities and booking auctions.
7. **Launch Decentralized Autonomous Organization (DAO):** User participation and community-driven governance.
8. **Provide analytics and insights:** Host dashboard with booking statistics, market analysis, and pricing suggestions.
9. **Integrate third-party insurance options:** Coverage for theft, cancellations, and other risks.
10. **Continuous refinement:** User feedback, market trends, and emerging technologies for platform improvement.

## Conclusion
By creating a decentralized property booking platform, we can revolutionize the way people book and manage properties, offering a more secure, efficient, and equitable solution for hosts and guests alike.

# Technical overview

## User.sol
The User contract manages user accounts by minting unique NFTs that represent each user. Each NFT is associated with a token URI, which serves as a unique identifier for the user on the platform. The contract ensures that each user has a distinct NFT, which can be used for various purposes within the platform, such as booking properties, receiving rewards, and writing reviews.

##  Property.sol 
The Property contract manages properties, including registration, fractional ownership, availability, and pricing. It enables users to create and manage properties, transfer fractional ownership shares (if enabled), and check the availability and pricing for booking properties.

#### Main Functions
1. **registerProperty:** This function allows users to register a new property on the platform by providing its name, location, token URI, price in USD, price per night in USD, and whether fractional ownership should be enabled. The function mints an ERC1155 token representing the property and stores the property's information in the _properties mapping. If fractional ownership is enabled, it initializes the _propertyShares mapping accordingly. Finally, it emits the PropertyRegistered event.
2. **enableFractionalShares:** This function allows the owner of a property to enable fractional ownership by providing the property ID and the total number of shares. It updates the _properties mapping and the _propertyShares mapping accordingly.
3. **transferShares:** This function allows users to transfer fractional ownership shares of a property to another address by providing the property ID, the recipient's address, and the number of shares to transfer. It updates the _propertyShares mapping accordingly and emits the SharesTransferred event.
4. **isPropertyAvailable:** This function checks the availability of a property for a specified date range by looping through the _unavailableDates mapping. It returns true if the property is available for the entire date range and false otherwise.
5. **updateAvailability:** This function allows users to update the availability status of a property for a specified date range by providing the property ID, start date, and end date. It updates the _unavailableDates mapping accordingly.
6. **getTotalPriceForDates:** This function calculates the total price for booking a property for a specified date range by providing the property ID, start date, and end date. It returns the total price in USD.
7. **getPropertyOwner, isFractionalOwnershipEnabled, getPropertyInfo, isValidProperty, getShares, toDayTimestamp:** These functions serve as utility functions to retrieve information about a property, such as its owner, fractional ownership status, PropertyInfo struct, validity, the number of shares held by an address, and converting a Unix timestamp to a day-granular timestamp.

## Booking.sol
The Booking contract manages bookings for properties. It enables users to create bookings, store booking information, and update the availability status of properties. Additionally, it facilitates payment transfers to the escrow contract and rewards contract using the USDC stablecoin.

#### Main Functions
1. **createBooking:** This function allows users to create a new booking for a property by providing the property ID, start date, and end date. The function checks the property's availability for the given dates and generates a unique booking ID. It then creates the booking, updates the property's availability status, calculates the total price and platform fees, and deposits the funds into the escrow contract. Finally, it transfers the USDC from the user to the escrow contract and the rewards contract, and emits the BookingCreated event.
2. **getPropertyIdByBookingId:** This function returns the property ID associated with a given booking ID.
3. **getRenterByBookingId:** This function returns the renter's address associated with a given booking ID.
4. **isBookingCompleted:** This function checks if a given booking has been completed by verifying that the booking ID exists and is associated with the property ID, that the user is the renter in the booking, and that the booking's end date is in the past. It returns true if the booking has been completed and false otherwise.

## Rewards.sol
The Rewards contract manages the distribution of rewards for users based on a rolling 3-month period. It allows users to withdraw their rewards in USDC and tracks the points earned by users and the total rewards allocated for each month. Users can add points to their account and withdraw rewards, while the contract ensures that rewards are distributed fairly based on the points earned by all users.

**** Side note
In the rewards section, we initially planned to implement a native token to distribute platform profits among token holders. However, our primary focus is on creating a truly decentralized platform. After attending Recbeards' talk last week about decentralization, we decided to reevaluate our approach.

As a result, we have devised a model that emphasizes rewarding user participation rather than token purchases. This ensures that profits are fairly distributed among active users of the system. Users will be able to earn points based on a 3-month rolling average, calculated through their engagement in various activities.

These activities include registering a profile, becoming a host, making bookings, reviewing stays, responding to guest messages, and more. We will continue to introduce additional ways for users to earn points, fostering an inclusive and decentralized ecosystem that benefits all platform participants.

#### What is a 3-month rolling avarage?
The 3-month rolling average model positively impacts our platform by encouraging consistent user engagement and promoting fair rewards distribution. By focusing on user participation over a **recent three-month period**, the platform can better recognize and reward active users, fostering a sense of community and loyalty.

#### Key components
1. **userMonthPoints:** A public mapping that stores the points earned by a user in a specific month.
2. **totalMonthPoints:** A public mapping that stores the total points earned by all users in a specific month.
3. **totalMonthRewards:** A public mapping that stores the total rewards (in USDC) allocated for a specific month.
4. **userRewardsWithdrawn:** A public mapping that tracks whether a user has withdrawn their rewards for a specific month.

#### Main functions
1. **addUserPoints:** This function adds points to a user for the current month. It updates the user's points and the total points for the current month, then emits the UserPointsAdded event.
2. **withdrawUserRewards:** This function allows users to withdraw their rewards for a specified month based on a rolling 3-month rewards calculation. The function checks if the month is completed and if the user has not withdrawn their rewards for the given month. It then calculates the user's reward based on their points and the total points in the 3-month period. The user's rewards are marked as withdrawn for the specified month, and the calculated reward amount is transferred from the contract's address to the user's address. Finally, the RewardWithdrawn event is emitted.
3. **addRewards:** This function adds rewards to the contract for the current month. It updates the total rewards for the current month with the received ether (in wei).
4. **receive** and **fallback:** These functions ensure that any ether sent to the contract is added to the rewards pool by calling the addRewards function.

## Escrow.sol
The Escrow contract manages the funds deposited by users. It ensures that the funds are held securely in the contract until they are released to the property owner after a booking has been completed. The contract also calculates and distributes platform fees and rewards. It interacts with the Property, Booking, and Rewards contracts to manage the booking funds and rewards distribution process.

#### Main functions
1. **deposit:** This function stores the deposited amount for a booking in the escrow contract. It is called by the Booking contract after it has transferred the required USDC tokens to the escrow contract. The function checks if the booking amount has not been deposited before and stores the deposited amount for the given booking ID.
2. **release:** This function releases the deposited amount for a booking to the property owner. It checks if the booking amount has not been released before, retrieves the deposited amount for the given booking ID, calculates the rewards amount (5% of the deposited amount), and ensures there is a booking amount to release. The function then retrieves the property owner's address, transfers the remaining USDC tokens (after subtracting the platform fees) to the property owner, and transfers the platform fees to the rewards contract. Finally, the function marks the booking amount as released.

## Review.sol
The Review contract manages the submission and storage of reviews from users after they complete their stays. It ensures that users can submit reviews only for completed bookings, and it rewards them for their participation. The contract interacts with the Property, Booking, and Rewards contracts to facilitate review submission and rewards distribution.

#### Main functions
1. **submitReview:** This function allows a user to submit a review for a completed booking. It checks if the rating is between 1 and 5, if the property ID is valid, and if the booking was completed by the user. The function then creates a new BookingReview struct and stores it in the _bookingReviews mapping. It awards the user points for submitting a review (in this example, 100 points) and emits a ReviewSubmitted event.

## Messaging.sol
The Messaging contract enables communication between guests and hosts by allowing them to send and view messages related to a specific booking. The contract interacts with the Property and Booking contracts to ensure that only the guest and host can send messages and to retrieve information about the booking and property.

#### Main functions
1. **sendMessage:** This function allows a user to send a message related to a booking. It checks if the sender is either the guest or the host using the isSenderGuestOrHost helper function. The function then creates a new Message struct and stores it in the _bookingMessages mapping. It emits a MessageSent event.
2. **getMessages:** This function retrieves all messages related to a booking, given the booking ID. It returns an array of Message structs.
3. **isSenderGuestOrHost (internal):** This helper function checks if the sender is the guest or the host. It returns true if the sender is either the guest or the host, and false otherwise.