export type GithubUser = {
  name: string;
  websiteUrl: string | null;
  bio: string | null;
  avatarUrl: string | null;
  pinnedRepositories: PinnedRepository[];
  additionalDesc: string | null;
};

export type PinnedRepository = {
  name: string;
  description: string | null;
  url: string;
  readme: string | null;
  additionalDesc: string | null;
  enableReadme: boolean | false;
};
