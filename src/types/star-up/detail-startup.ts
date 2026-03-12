export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
}

export interface StartupInfo {
  id: string;
  name: string;
  category: string;
  bannerImage: string;
  profileImage: string;
  description: string;
  team: TeamMember[];
}
