import { useState } from "react";

import { EntityRepresentative, Specialization } from "../../utilities/dialog-utilities";
import { configuration, t } from "../../../application";
import { languageStringToString } from "../../../utilities/string";
import { SelectEntity } from "./select-entity";

export const SpecializationSelect = (props: {
  language: string,
  items: EntityRepresentative[],
  specializations: Specialization[],
  addSpecialization: (specialized: string) => void,
  removeSpecialization: (value: Specialization) => void,
}) => {
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<EntityRepresentative>(props.items[0]);

  const candidatesToAdd: EntityRepresentative[] = [];
  const active: [EntityRepresentative, Specialization][] = [];
  for (const item of props.items) {
    const specialization = props.specializations.find(
      specialization => specialization.specialized === item.identifier);
    if (specialization === undefined) {
      candidatesToAdd.push(item);
    } else {
      active.push([item, specialization]);
    }
  }

  const addSpecialization = () => {
    props.addSpecialization(selected.identifier);
    setAdding(!adding);
  };

  const openAdd = () => {
    // Select default value.
    setSelected(candidatesToAdd[0]);
    setAdding(true);
  };

  return (
    <div className="flex w-full flex-col">
      <div>
        {active.map(([item, specialization]) => (
          <RemovableSpecialization
            key={item.identifier}
            language={props.language}
            item={item}
            specialization={specialization}
            removeSpecialization={props.removeSpecialization}
          />
        ))}
        {/* If there is nothing to add we do not offer that to the user. */}
        {candidatesToAdd.length === 0 ? null : (adding
          ? (
            <div className="flex w-full flex-row gap-1">
              <button onClick={addSpecialization}>
                Add
              </button>
              <button onClick={() => setAdding(!adding)}>
                Cancel
              </button>
              <SelectEntity
                language={props.language}
                items={candidatesToAdd}
                value={selected}
                onChange={setSelected}
              />
            </div>
          ) : (
            <button
              className="px-2 py-1 hover:shadow-sm"
              onClick={openAdd}
              title={t("create-class-dialog.add-specialization")}
            >
              ➕
            </button>
          ))}
      </div>
    </div>
  );
};

const RemovableSpecialization = (props: {
  language: string,
  item: EntityRepresentative,
  specialization: Specialization,
  removeSpecialization: (value: Specialization) => void,
}) => {
  const languagePreferences = configuration().languagePreferences;
  return (
    <div>
      <button onClick={() => props.removeSpecialization(props.specialization)}>
        🗑
      </button>
      &nbsp;
      {languageStringToString(
        languagePreferences,
        props.language, props.item.label)}
    </div>
  )
}
