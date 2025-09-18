export interface PostCreateRequest { topicId: number; title: string; content: string; }
export interface PostDto {
  id: number; authorId: number; topicId: number;
  title: string; content: string; createdAt: string;
}
