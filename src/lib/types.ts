export type Visibility = "private" | "family";
export type FamilyRole = "owner" | "member";
export type InviteStatus = "pending" | "accepted" | "expired";

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface Family {
  id: string;
  name: string;
  created_by: string;
}

export interface FamilyMember {
  family_id: string;
  user_id: string;
  role: FamilyRole;
  joined_at: string;
  profile: Profile;
}

export interface FamilyInvite {
  id: string;
  family_id: string;
  invited_email: string;
  token: string;
  status: InviteStatus;
  created_at: string;
  family?: Family;
}

export interface Category {
  id: number;
  name: string;
  emoji: string;
  sort_order: number;
  owner_id?: string | null;
}

export interface List {
  id: string;
  name: string;
  owner_id: string;
  family_id: string | null;
  visibility: Visibility;
  icon: string | null;
  created_at: string;
  updated_at: string;
  family?: Family;
  item_count?: number;
}

export interface ListItem {
  id: string;
  list_id: string;
  name: string;
  category_id: number | null;
  quantity: string | null;
  unit: string | null;
  notes: string | null;
  sort_order: number;
  category?: Category;
}

export interface ShoppingSession {
  id: string;
  list_id: string;
  started_at: string;
  completed_at: string | null;
  created_by: string;
  supermarket: string | null;
  list?: List;
}

export interface SessionEntry {
  id: string;
  session_id: string;
  list_item_id: string;
  checked: boolean;
  checked_at: string | null;
  checked_by: string | null;
  list_item?: ListItem;
}
