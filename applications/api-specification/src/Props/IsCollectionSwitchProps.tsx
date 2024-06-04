import { DataStructure } from '@/Models/DataStructureModel';
import { BaseProps } from './BaseProps';

export interface IsCollectionSwitchProps extends BaseProps 
{
    setValue: (path: string, value: any) => void;
    getValues: any;
    dataStructureName: string;
    dataStructures: DataStructure[];
    setIsCollection: React.Dispatch<React.SetStateAction<boolean>>;
}