import { WdEntityId, WdFilterByInstance } from '@dataspecer/wikidata-experimental-adapter';
import { useWdGetSurroundings } from '../helpers/use-get-surroundings';
import { WikidataLoadingError } from '../helpers/wikidata-loading-error';
import { WikidataProperties } from './wikidata-properties';
import { useTranslation } from 'react-i18next';
import { WikidataLoading } from '../helpers/wikidata-loading';

export interface WikidataLoadedAssociationsPropertiesProps {
    selectedWdClassId: WdEntityId;
    wdFilterByInstance: WdFilterByInstance | undefined;
    searchText: string;
    includeInheritedProperties: boolean;
}

export const WikidataLoadedProperties: React.FC<WikidataLoadedAssociationsPropertiesProps> = (props) => {
    const {t} = useTranslation("interpretedSurrounding");
    const {wdClassSurroundings: selectedWdClassSurroundings, isLoading, isError} = useWdGetSurroundings(props.selectedWdClassId);

    return (
        <>
            {isLoading && <WikidataLoading />}
            {isError && <WikidataLoadingError errorMessage={t("no associations no attributes")} />}
            {!isLoading && !isError && <WikidataProperties 
                selectedWdClassSurroundings={selectedWdClassSurroundings}
                wdFilterByInstance={props.wdFilterByInstance}
                searchText={props.searchText}
                includeInheritedProperties={props.includeInheritedProperties}
            />}
        </>
    );
}
