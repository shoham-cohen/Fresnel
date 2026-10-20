// One row in the mobile "מקורות מידע" tab.
export interface SourceItem {
  itemId: string;
  platform: string;
  url: string | null;
  title: string | null;
  contentText: string | null;
  authorName: string | null;
  sourceId: string | null;
  publishedAt: string;
}

export interface SourceItemPage {
  items: SourceItem[]; // newest first; an item the Data Lake does not find is left out
  total: number; // the length of the narrative's item id list
  page: number;
  pageSize: number;
}
