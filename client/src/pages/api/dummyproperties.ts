import { NextApiRequest, NextApiResponse } from 'next';
import { IProperty, Property } from '../../../models/property';
import { DummyProperty, IDummyProperty } from '../../../models/dummyProperty';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const properties: IDummyProperty[] = await DummyProperty.find();
            return res.status(200).json(properties);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching dummy properties' });
        }
    } else if (req.method === 'POST') {
        try {
            const data = req.body;

            const newDummyProperty: IDummyProperty = new DummyProperty({
                propertyId: data.propertyId,
                owner: data.owner,
                name: data.name,
                location: data.location,
                country: data.country,
                imageId: data.imageId,
                pricePerNight: data.pricePerNight,
                description: data.description,
            });

            await newDummyProperty.save();
            return res.status(201).json(newDummyProperty);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error creating dummy property' });
        }
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}