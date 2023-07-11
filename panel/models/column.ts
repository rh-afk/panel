import { Column as BkColumn, ColumnView as BkColumnView } from "@bokehjs/models/layouts/column";
import * as DOM from "@bokehjs/core/dom"
import * as p from "@bokehjs/core/properties";

export class ColumnView extends BkColumnView {
  model: Column;
  scroll_down_arrow_el: HTMLElement;

  scroll_to_latest(): void {
    this.el.scrollTop = this.el.scrollHeight;
  }

  toggle_scroll_arrow(): void {
    const scrollThreshold = this.model.properties.scroll_arrow_threshold;

    const scrollDistanceFromBottom = this.el.scrollHeight - this.el.scrollTop - this.el.clientHeight;
    this.scroll_down_arrow_el.classList.toggle(
      "visible", scrollDistanceFromBottom >= scrollThreshold.get_value()
    )
  }

  connect_signals(): void {
    super.connect_signals();

    const { auto_scroll, scroll_arrow_threshold } = this.model.properties;

    if (scroll_arrow_threshold.get_value() > 0) {
      this.on_change(scroll_arrow_threshold, () => {
        this.toggle_scroll_arrow();
      });
    }

    if (auto_scroll.get_value()) {
      console.log(auto_scroll.get_value())
      this.on_change(this.model.properties.children, () => {
        this.scroll_to_latest();
      });
    }
  }

  render(): void {
    super.render()
    this.empty()
    this._update_stylesheets()
    this._update_css_classes()
    this._apply_styles()
    this._apply_visible()

    this.class_list.add(...this.css_classes())

    const scrollThreshold = this.model.properties.scroll_arrow_threshold;
    if (scrollThreshold.get_value() > 0) {
      this.scroll_down_arrow_el = DOM.createElement('div', { class: 'scroll-down-arrow' });
      this.shadow_el.appendChild(this.scroll_down_arrow_el);

      this.el.addEventListener("scroll", () => {
        this.toggle_scroll_arrow();
      });

      this.scroll_down_arrow_el.addEventListener("click", () => {
        this.scroll_to_latest();
      });
    }

    for (const child_view of this.child_views.slice(1)) {
      this.shadow_el.appendChild(child_view.el)
      child_view.render()
      child_view.after_render()
    }
  }
}

export namespace Column {
  export type Attrs = p.AttrsOf<Props>;

  export type Props = BkColumn.Props & {
    auto_scroll: p.Property<boolean>;
    scroll_arrow_threshold: p.Property<number>;
  };
}

export interface Column extends BkColumn.Attrs { }

export class Column extends BkColumn {
  properties: Column.Props;

  constructor(attrs?: Partial<Column.Attrs>) {
    super(attrs);
  }

  static __module__ = "panel.models.layout";

  static {
    this.prototype.default_view = ColumnView;

    this.define<Column.Props>(({ Boolean, Int }) => ({
      auto_scroll: [Boolean, false],
      scroll_arrow_threshold: [Int, 0],
    }));
  }
}