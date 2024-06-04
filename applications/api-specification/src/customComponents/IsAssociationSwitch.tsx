import React, { useEffect, useState } from 'react';
import { Switch } from "../components/ui/switch";
import ResponseObjectSelect from './ResponseObjectSelect';
import { DataStructure } from '../Models/DataStructureModel';
import {IsAssociationSwitchProps} from '../Props/IsAssociationSwitchProps';

const Association: React.FC<IsAssociationSwitchProps> = ({
    index,
    operationIndex,
    register,
    setValue,
    getValues,
    dataStructureName,
    dataStructures,
    setSelectedResponseObject,
    setResponseObjectFields,
    setAssociationModeOn,
    defaultValue
}) => {
    const path = `dataStructures.${index}.operations.${operationIndex}.oAssociatonMode`;

    const formState = register(path);

    /* Local state init */
    const [selectedAssociationMode, setSelectedAssociationMode] = useState(formState.value);

    /* sync local state with form state */
    useEffect(() => {
        const currentFormValue = getValues(path);
        if (currentFormValue !== selectedAssociationMode) 
        {
            setSelectedAssociationMode(currentFormValue);
            setAssociationModeOn(currentFormValue);
        }

    }, [path, getValues, selectedAssociationMode, setAssociationModeOn]);

    const handleSwitchChange = (checked: boolean) => {
        setValue(path, checked);
        setSelectedAssociationMode(checked);
        setAssociationModeOn(checked);
    };
    
    const selectedDataStructure = dataStructures.find(ds => ds.givenName === dataStructureName);

    const objectFields = selectedDataStructure ? selectedDataStructure.fields
        .filter(field => field.type === 'Object' && field.nestedFields)
        .map(field => ({
            id: field.nestedFields.id,
            givenName: field.nestedFields.name,
            name: field.name,
            fields: field.nestedFields.fields,
        })) : [];

    /* set fields of resp obj */
    useEffect(() => {
        setResponseObjectFields(objectFields);
    }, [objectFields, setResponseObjectFields]);

    return (
        <div className="p-1 flex items-center justify-between mr-5">
            <div>
                <label>Association Mode: </label>
                <Switch
                    {...formState}
                    checked={selectedAssociationMode}
                    onCheckedChange={handleSwitchChange}
                />
            </div>
            {selectedAssociationMode && (
                <div>
                    <label>Target Datastructure: </label>
                    <ResponseObjectSelect
                        index={index}
                        operationIndex={operationIndex}
                        defaultValue={defaultValue}
                        register={register}
                        dataStructures={objectFields}
                        getValues = {getValues}
                        isResponseObj={true}
                        onChange={(selectedDataStructure) => {
                            setSelectedResponseObject(selectedDataStructure);
                            const responseObjectPath = `dataStructures.${index}.operations.${operationIndex}.oResponseObject.name`;
                            if(selectedDataStructure)
                            {
                                setValue(responseObjectPath, selectedDataStructure.name);
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );

};

export default Association;
