import { ImportRelativePath, TemplateDescription } from "../../../engine/eta-template-renderer";
import { AllowedTransition } from "../../../engine/transitions/transitions-generator";

export interface ListTableTemplate extends TemplateDescription {
    placeholders: {
        aggregate_name: string;
        presentation_layer_component_name: string;
        list_capability_app_layer: string;
        list_app_layer_path: ImportRelativePath;
        instance_capability_options: string;
        instance_capability_options_path: ImportRelativePath;
        //supported_out_list_transitions: AllowedTransition[];
    };
}
