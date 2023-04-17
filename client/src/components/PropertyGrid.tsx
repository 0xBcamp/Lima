import React from 'react';
import { IProperty } from '../../models/property';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { PanelsEnum } from '@/enums/PanelsEnum';
import { openSidePanel } from '../../store/slices/sidePanelSlice';
import { useAppDispatch } from '../../store/hooks';
import { setSelectedProperty } from '../../store/slices/navigationSlice';

interface IPropertyGrid {
    properties: IProperty[]
}

const PropertyGrid = ({ properties }: IPropertyGrid) => {
    const dispatch = useAppDispatch();
    
    const generateRandomNumber = () => {
        return Math.floor(Math.random() * 150);
    };

    return (
        <div className="grid grid-cols-4 gap-4">
            {properties.map((property, index) => (
                <div key={index} className="w-full shadow-md hover:shadow-xl hover:cursor-pointer" onClick={() => {
                    dispatch(setSelectedProperty(property));
                    dispatch(openSidePanel({
                        title: `${property.name}`,
                        contentComponent: PanelsEnum.ViewPropertyPanel,
                        sourceId: `OverviewPage`
                    }))
                }}>
                    <img
                        src={`/properties/${property.imageId ? property.imageId : '0'}.avif`}
                        alt={property.name}
                        className="w-full h-auto object-cover"
                    />
                    <div className='px-1 text-sm font-bold pt-1'>{property.name}</div>
                    <div className='px-1 text-sm'>{property.location}</div>
                    <div className='flex'>
                        <div className='font-bold px-1 text-sm grow pb-1 '>
                            <FontAwesomeIcon icon={faStar} className='text-yellow-500' />
                            <FontAwesomeIcon icon={faStar} className='text-yellow-500' />
                            <FontAwesomeIcon icon={faStar} className='text-yellow-500' />
                            <FontAwesomeIcon icon={faStar} className='text-yellow-500' />
                            <FontAwesomeIcon icon={faStarHalfStroke} className='text-yellow-500' />
                        </div>
                        <div className='pr-2 text-sm'>{generateRandomNumber()} reviews</div>
                    </div>
                    <div className='px-1 text-sm pb-2 '>${property.pricePerNight} per night</div>
                </div>
            ))}
        </div>
    );
};

export default PropertyGrid;