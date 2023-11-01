import { Tooltip, TooltipView } from "@bokehjs/models/ui/tooltip";
import { IterViews } from "@bokehjs/core/build_views";
import * as p from "@bokehjs/core/properties";
import { Button as BkButton, ButtonView as BkButtonView } from "@bokehjs/models/widgets/button";
export declare class ButtonView extends BkButtonView {
    model: Button;
    protected tooltip: TooltipView | null;
    children(): IterViews;
    lazy_initialize(): Promise<void>;
    remove(): void;
    render(): void;
}
export declare namespace Button {
    type Attrs = p.AttrsOf<Props>;
    type Props = BkButton.Props & {
        tooltip: p.Property<Tooltip | null>;
    };
}
export interface Button extends Button.Attrs {
}
export declare class Button extends BkButton {
    properties: Button.Props;
    __view_type__: ButtonView;
    static __module__: string;
    constructor(attrs?: Partial<Button.Attrs>);
}
