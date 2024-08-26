export const GridBreakPoints = ['mobile', 'tablet', 'laptop', 'small-desktop', 'desktop'] as const;
export type GridBreakPoint = (typeof GridBreakPoints)[number];

// Must be kept in sync with varibles in assets/css/_varibles.css
export type MobileStartColumn = 'mobile-grid-start' | 1;
export type MobileMiddleColumns = 2 | 3 | 4;
export type MobileEndColumn = 'mobile-grid-end' | 5;
export type MobileGridSize = MobileStartColumn | MobileMiddleColumns | MobileEndColumn;

export type TabletStartColumn = 'tablet-grid-start' | 1;
export type TabletMiddleColumns = 2 | 3 | 4 | 5 | 6 | 7;
export type TabletEndColumn = 'tablet-grid-end' | 9;
export type TabletGridSize = TabletStartColumn | TabletMiddleColumns | TabletEndColumn;

export type LaptopStartColumn = 'laptop-grid-start' | 1;
export type LaptopMiddleColumns = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type LaptopEndColumn = 'laptop-grid-end' | 13;
export type LaptopGridSize = LaptopStartColumn | LaptopMiddleColumns | LaptopEndColumn;

export type SmallDesktopStartColumn = 'small-desktop-grid-start' | 1;
export type SmallDesktopMiddleColumns = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type SmallDesktopEndColumn = 'small-desktop-grid-end' | 13;
export type SmallDesktopGridSize = SmallDesktopStartColumn | SmallDesktopMiddleColumns | SmallDesktopEndColumn;

export type DesktopStartColumn = 'desktop-grid-start' | 1;
export type DesktopMiddleColumns = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type DesktopEndColumn = 'desktop-grid-end' | 13;
export type DesktopGridSize = DesktopStartColumn | DesktopMiddleColumns | DesktopEndColumn;

export type BaseGridColumnSizes = Partial<{
  mobileStartColumn: MobileGridSize;
  mobileEndColumn: MobileGridSize;
  tabletStartColumn: TabletGridSize;
  tabletEndColumn: TabletGridSize;
  laptopStartColumn: LaptopGridSize;
  laptopEndColumn: LaptopGridSize;
  smallDesktopStartColumn: SmallDesktopGridSize;
  smallDesktopEndColumn: SmallDesktopGridSize;
  desktopStartColumn: DesktopGridSize;
  desktopEndColumn: DesktopGridSize;
}>;
