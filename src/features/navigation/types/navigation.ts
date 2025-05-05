export interface NavigationItem {
  title: string;
  url: string;
}

export interface NavigationMain {
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;

  items: NavigationItem[];
}
