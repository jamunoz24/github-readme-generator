export type GithubUser = {
  name: string;
  websiteUrl: string | null;
  bio: string | null;
  avatarUrl: string | null;
  pinnedRepositories: PinnedRepository[];
};

export type PinnedRepository = {
  name: string;
  description: string | null;
  url: string;
  readme: string | null;
};
