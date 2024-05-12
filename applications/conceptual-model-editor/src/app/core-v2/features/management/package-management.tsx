import { useRouter } from "next/navigation";
import { useBackendConnection } from "../../backend-connection";
import { SavePackageAndLeaveButton, SavePackageButton } from "../../components/management/buttons/save-package-buttons";
import { useModelGraphContext } from "../../context/model-context";
import { usePackageSearch } from "../../util/package-search";

const SAVE_PACKAGE = "save package to backend";
const SAVE_PACKAGE_AND_LEAVE = "save package to backend and leave back to manager";
const YOU_NEED_A_PACKAGE_ON_BACKEND =
    "to be able to save to backend, make sure you are in a package. Start with visiting manager/v2";

export const PackageManagement = () => {
    const { updateSemanticModelPackageModels } = useBackendConnection();
    const { packageId, setPackage } = usePackageSearch();
    const { models, visualModels } = useModelGraphContext();
    const router = useRouter();

    const handleSavePackage = async () => {
        if (!packageId) {
            return;
        }
        updateSemanticModelPackageModels(packageId, [...models.values()], [...visualModels.values()]);
    };

    const handleSavePackageAndLeave = async () => {
        await handleSavePackage();
        router.push("/manager");
    };

    return (
        <div className="my-auto flex flex-row">
            <SavePackageButton
                disabled={!packageId}
                title={packageId ? SAVE_PACKAGE : YOU_NEED_A_PACKAGE_ON_BACKEND}
                onClick={handleSavePackage}
            />
            <SavePackageAndLeaveButton
                disabled={!packageId}
                title={packageId ? SAVE_PACKAGE_AND_LEAVE : YOU_NEED_A_PACKAGE_ON_BACKEND}
                onClick={handleSavePackageAndLeave}
            />
        </div>
    );
};
