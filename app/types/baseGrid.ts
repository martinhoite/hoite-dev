export type MobileGridSize = 1 | 2 | 3 | 4;
export type TabletGridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type LaptopGridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type SmallDesktopGridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type DesktopGridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

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
