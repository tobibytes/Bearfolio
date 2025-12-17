const defaultApi = typeof window !== 'undefined' ? `${window.location.origin}/graphql` : 'http://localhost:5180/graphql';
const API_URL = import.meta.env.VITE_API_URL || defaultApi;
export const API_BASE = API_URL.replace(/\/graphql$/, '');

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

async function fetchGraphQL<T>(query: string, variables?: Record<string, unknown>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });
    const json = (await res.json()) as GraphQLResponse<T>;
    if (!res.ok || json.errors) throw new Error(json.errors?.[0]?.message || 'GraphQL error');
    return json.data as T;
  } finally {
    clearTimeout(timeout);
  }
}

export type RemoteOpportunity = {
  id: string;
  title: string;
  org: string;
  category: string;
  fields: string[];
  tags: string[];
  desiredFormats: string[];
  updatedAt: string;
  status: string;
  summary?: string;
};

export type RemotePortfolioItem = {
  id: string;
  title: string;
  summary: string;
  type: string;
  format: string;
  tags: string[];
  heroImageUrl: string;
  updatedAt: string;
  state?: string;
  contentJson?: string;
  detailTemplate?: string;
  linksJson?: string;
  profile?: { id: string; name: string; headline?: string; avatarUrl?: string };
};

export type RemoteStudent = {
  id: string;
  name: string;
  headline?: string;
  bio: string;
  location?: string;
  year?: number;
  linksJson?: string;
  skillsJson?: string;
  fields: string[];
  interests: string[];
  strengths: string[];
  avatarUrl: string;
  portfolioItems: RemotePortfolioItem[];
  onboarded?: boolean;
};

export type RemoteProfile = RemoteStudent;

export type ProfileInput = {
  name: string;
  headline: string;
  bio: string;
  location: string;
  year: number;
  fields: string[];
  interests: string[];
  strengths: string[];
  avatarUrl: string;
  linksJson: string;
  skillsJson: string;
  onboarded: boolean;
};

export async function fetchRemoteOpportunities(): Promise<RemoteOpportunity[]> {
  const data = await fetchGraphQL<{ opportunities: { nodes: RemoteOpportunity[] } }>(`
    query GetOpportunities {
      opportunities {
        nodes {
          id
          title
          org
          category
          fields
          tags
          desiredFormats
          updatedAt
          status
        }
      }
    }
  `);
  return data?.opportunities?.nodes ?? [];
}

export async function fetchRemoteOpportunity(id: string): Promise<RemoteOpportunity | null> {
  const data = await fetchGraphQL<{ opportunities: { nodes: RemoteOpportunity[] } }>(
    `
    query GetOpportunity($id: UUID!) {
      opportunities(where: { id: { eq: $id } }) {
        nodes {
          id
          title
          org
          category
          fields
          tags
          desiredFormats
          updatedAt
          status
        }
      }
    }
  `,
    { id }
  );
  return data?.opportunities?.nodes?.[0] ?? null;
}

export async function fetchRemotePortfolioItems(): Promise<RemotePortfolioItem[]> {
  const data = await fetchGraphQL<{ portfolioItems: { nodes: RemotePortfolioItem[] } }>(`
    query GetPortfolioItems {
      portfolioItems {
        nodes {
          id
          title
          summary
          type
          format
          tags
          heroImageUrl
          updatedAt
          state
          contentJson
          detailTemplate
          linksJson
          profile { id name headline avatarUrl }
        }
      }
    }
  `);
  return data?.portfolioItems?.nodes ?? [];
}

export async function fetchRemotePortfolioItem(id: string): Promise<RemotePortfolioItem | null> {
  const data = await fetchGraphQL<{ portfolioItem: RemotePortfolioItem | null }>(
    `
    query GetPortfolioItem($id: UUID!) {
      portfolioItem(id: $id) {
        id
        title
        summary
        type
        format
        tags
        heroImageUrl
        updatedAt
        state
        contentJson
        detailTemplate
        linksJson
        profile { id name headline avatarUrl }
      }
    }
  `,
    { id }
  );
  return data?.portfolioItem ?? null;
}

export async function fetchRemoteStudents(): Promise<RemoteStudent[]> {
  const data = await fetchGraphQL<{ students: { nodes: RemoteStudent[] } }>(`
    query GetStudents {
      students {
        nodes {
          id
          name
          headline
          bio
          location
          year
          linksJson
          skillsJson
          fields
          interests
          strengths
          avatarUrl
          onboarded
          portfolioItems {
            id
            title
            summary
            type
            format
            tags
            heroImageUrl
            updatedAt
          }
        }
      }
    }
  `);
  return data?.students?.nodes ?? [];
}

export async function fetchRemoteStudent(id: string): Promise<RemoteStudent | null> {
  const data = await fetchGraphQL<{ students: { nodes: RemoteStudent[] } }>(
    `
    query GetStudent($id: UUID!) {
      students(where: { id: { eq: $id } }) {
        nodes {
          id
          name
          headline
          bio
          location
          year
          linksJson
          skillsJson
          fields
          interests
          strengths
          avatarUrl
          onboarded
          portfolioItems {
            id
            title
            summary
            type
            format
            tags
            heroImageUrl
            updatedAt
          }
        }
      }
    }
  `,
    { id }
  );
  return data?.students?.nodes?.[0] ?? null;
}

export async function fetchMyProfile(): Promise<RemoteProfile | null> {
  const data = await fetchGraphQL<{ me: RemoteProfile | null }>(`
    query GetMe {
      me {
        id
        name
        headline
        bio
        location
        year
        linksJson
        skillsJson
        fields
        interests
        strengths
        avatarUrl
        onboarded
        portfolioItems {
          id
          title
          summary
          type
          format
          tags
          heroImageUrl
          updatedAt
          state
          contentJson
          detailTemplate
          linksJson
        }
      }
    }
  `);
  return data?.me ?? null;
}

export async function createProfile(input: ProfileInput): Promise<RemoteProfile> {
  const data = await fetchGraphQL<{ createProfile: RemoteProfile }>(
    `
    mutation CreateProfile($input: ProfileInput!) {
      createProfile(input: $input) {
        id
        name
        headline
        bio
        location
        year
        linksJson
        skillsJson
        fields
        interests
        strengths
        avatarUrl
        onboarded
        portfolioItems { id title summary type format tags heroImageUrl updatedAt state }
      }
    }
  `,
    { input }
  );
  return data.createProfile;
}

export async function updateProfile(id: string, input: ProfileInput): Promise<RemoteProfile> {
  const data = await fetchGraphQL<{ updateProfile: RemoteProfile }>(
    `
    mutation UpdateProfile($id: UUID!, $input: ProfileInput!) {
      updateProfile(id: $id, input: $input) {
        id
        name
        headline
        bio
        location
        year
        linksJson
        skillsJson
        fields
        interests
        strengths
        avatarUrl
        onboarded
        portfolioItems { id title summary type format tags heroImageUrl updatedAt state }
      }
    }
  `,
    { id, input }
  );
  return data.updateProfile;
}

export async function submitPortfolioItem(input: {
  profileId: string;
  type: string;
  format: string;
  title: string;
  summary: string;
  tags: string[];
  contentJson: string;
  detailTemplate: string;
  heroImageUrl: string;
  linksJson: string;
}) {
  const data = await fetchGraphQL<{ submitPortfolioItem: RemotePortfolioItem }>(
    `
    mutation SubmitPortfolio($input: PortfolioItemInput!) {
      submitPortfolioItem(input: $input) {
        id
        title
        summary
        type
        format
        tags
        heroImageUrl
        updatedAt
        state
        contentJson
        detailTemplate
        linksJson
        profile { id name headline avatarUrl }
      }
    }
  `,
    { input }
  );
  return data.submitPortfolioItem;
}

export async function updatePortfolioItem(id: string, input: {
  profileId: string;
  type: string;
  format: string;
  title: string;
  summary: string;
  tags: string[];
  contentJson: string;
  detailTemplate: string;
  heroImageUrl: string;
  linksJson: string;
}) {
  const data = await fetchGraphQL<{ updatePortfolioItem: RemotePortfolioItem }>(
    `
    mutation UpdatePortfolio($id: UUID!, $input: PortfolioItemInput!) {
      updatePortfolioItem(id: $id, input: $input) {
        id
        title
        summary
        type
        format
        tags
        heroImageUrl
        updatedAt
        state
        contentJson
        detailTemplate
        linksJson
        profile { id name headline avatarUrl }
      }
    }
  `,
    { id, input }
  );
  return data.updatePortfolioItem;
}

export async function deletePortfolioItem(id: string) {
  const data = await fetchGraphQL<{ deletePortfolioItem: boolean }>(
    `
    mutation DeletePortfolio($id: UUID!) {
      deletePortfolioItem(id: $id)
    }
  `,
    { id }
  );
  return data.deletePortfolioItem;
}

export async function publishPortfolioItem(id: string) {
  const data = await fetchGraphQL<{ publishPortfolioItem: RemotePortfolioItem }>(
    `
    mutation PublishPortfolio($id: UUID!) {
      publishPortfolioItem(id: $id) {
        id
        title
        state
      }
    }
  `,
    { id }
  );
  return data.publishPortfolioItem;
}

export async function createOpportunity(input: {
  title: string;
  org: string;
  category: string;
  fields: string[];
  tags: string[];
  desiredFormats: string[];
}) {
  const data = await fetchGraphQL<{ createOpportunity: RemoteOpportunity }>(
    `
    mutation CreateOpp($input: OpportunityInput!) {
      createOpportunity(input: $input) {
        id title org category fields tags desiredFormats updatedAt status
      }
    }
  `,
    { input }
  );
  return data.createOpportunity;
}

export async function requestUploadUrl(kind: string, fileType: string, fileSize: number) {
  const data = await fetchGraphQL<{ requestUploadUrl: { url: string; key: string } }>(
    `
    mutation UploadUrl($input: UploadRequest!) {
      requestUploadUrl(input: $input) { url key }
    }
  `,
    { input: { kind, fileType, fileSize } }
  );
  return data.requestUploadUrl;
}

export async function uploadFile(file: File, kind: string, onProgress?: (progress: number) => void): Promise<string> {
  const signed = await requestUploadUrl(kind, file.type, file.size);
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const fileUrl = signed.url.split('?')[0] || signed.key;
        resolve(fileUrl);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });
    
    xhr.open('PUT', signed.url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}
