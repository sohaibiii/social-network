export interface SliderItem {
  key: string;
  title: string;
  text: string;
  icon: string;
  renderSlide?: () => JSX.Element;
}

export interface SliderItemType {
  item: SliderItem;
}
