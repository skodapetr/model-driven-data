import { CoreResource, CoreOperation } from "../../core";
import * as PSM from "../data-psm-vocabulary";

export class DataPsmDeleteAssociationEnd extends CoreOperation {
  static readonly TYPE = PSM.DELETE_ASSOCIATION_END;

  dataPsmOwner: string | null = null;

  dataPsmAssociationEnd: string | null = null;

  constructor() {
    super();
    this.types.push(DataPsmDeleteAssociationEnd.TYPE);
  }

  static is(
    resource: CoreResource | null
  ): resource is DataPsmDeleteAssociationEnd {
    return resource.types.includes(DataPsmDeleteAssociationEnd.TYPE);
  }
}
