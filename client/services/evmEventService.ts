import axios, { AxiosError } from 'axios';
import { IEvmEvent } from '../models/evmEvents';

export interface IEventInput {
	eventName: string;
	contract: string;
	blockNumber: string;
	transactionHash: string;
	eventData: {
		[key: string]: any;
	};
}

export interface IEventResponse {
	message: string;
	event: IEvmEvent | null;
}

interface IErrorResponse {
	error: string;
}

export const getEvents = async (): Promise<IEvmEvent[]> => {
	return (await axios.get(`http://localhost:3000/api/evmevent`)).data;
};

export const saveEvent = async (eventData: IEventInput): Promise<IEventResponse> => {
	try {
		const response = await axios.post(`http://localhost:3000/api/evmevent`, eventData);
		const savedEvent: IEvmEvent = response.data;

		return {
			message: "Event saved successfully",
			event: savedEvent,
		};
	} catch (error) {
		console.error(error);

		// Check if the error response contains a message from the API
		const axiosError = error as AxiosError<IErrorResponse>;
		const errorMessage = axiosError.response?.data?.error || "Error saving event";

		return {
			message: errorMessage,
			event: null,
		};
	}
};