import { SemanticModelClassUsage, isSemanticModelClassUsage } from "@dataspecer/core-v2/semantic-model/usage/concepts";
import { useClassesContext } from "../../context/classes-context";
import { OverrideFieldCheckbox } from "./override-field-checkbox";
import { SemanticModelClass } from "@dataspecer/core-v2/semantic-model/concepts";
import { EntityProxy } from "../../util/detail-utils";

const OptionRow = (props: { resource: SemanticModelClass | SemanticModelClassUsage }) => {
    const { resource } = props;
    const displayName = EntityProxy(resource).name;

    return <option value={resource.id}>{displayName}</option>;
};

export const SelectDomainOrRange = (props: {
    concept: string | null;
    setConcept: (resourceId: string) => void;
    onChange?: () => void;
    disabled?: boolean;
    withOverride?: boolean;
    withNullValueEnabled?: boolean;
}) => {
    const { concept, setConcept, onChange, disabled, withOverride, withNullValueEnabled } = props;
    const { classes2, profiles } = useClassesContext();

    const classesOrProfiles = [...classes2, ...profiles.filter(isSemanticModelClassUsage)];

    let value: string;
    if (concept == null) {
        value = "null";
    } else if (concept == "") {
        value = "null";
    } else {
        value = concept;
    }

    return (
        <div className="flex flex-row">
            <select
                className="flex-grow"
                disabled={disabled}
                onChange={(e) => {
                    if (e.target.value == "null") {
                        // @ts-ignore
                        setConcept(undefined);
                    } else {
                        setConcept(e.target.value);
                    }
                    onChange?.();
                }}
                value={value}
            >
                <option value="null" disabled={!withNullValueEnabled} selected={concept == "" || concept == null}>
                    ---
                </option>
                {classesOrProfiles.map((v) => (
                    <OptionRow key={v.id} resource={v} />
                ))}
            </select>
            {withOverride && (
                <div className="ml-2">
                    <OverrideFieldCheckbox
                        forElement="domain-range-component-domain"
                        disabled={!disabled}
                        onChecked={onChange}
                    />
                </div>
            )}
        </div>
    );
};
