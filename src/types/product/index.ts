export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
}

export interface StartupDetail {
  id: string;
  name: string;
  category: string;
  description: string;
  bannerImage: string;
  profileImage: string;
  team: TeamMember[];
}