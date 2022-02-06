import { CoreOperation, CoreResource } from "../../core";
import * as PSM from "../data-psm-vocabulary";

export class DataPsmSetRoots extends CoreOperation {
  static readonly TYPE = PSM.SET_ROOTS;

  /**
   * New value of the schema roots property.
   */
  dataPsmRoots: string[] = [];

  constructor() {
    super();
    this.types.push(DataPsmSetRoots.TYPE);
  }

  static is(resource: CoreResource | null): resource is DataPsmSetRoots {
    return resource?.types.includes(DataPsmSetRoots.TYPE);
  }
}
