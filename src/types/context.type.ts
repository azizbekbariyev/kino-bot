export interface ContextUpdate {
  update_id: number;
  chat_join_request: {
    chat: {
      id: number;
      title: string;
      type: string;
    };
    from: {
      id: number;
      first_name: string;
      username: string;
      language_code: string;
    };
    user_chat_id: number;
    date: number;
    invite_link: {
      invite_link: string;
      name: string;
      creator: {
        id: number;
        is_bot: boolean;
        first_name: string;
        username: string;
        language_code: string;
      };
      pending_join_request_count: number;
      creates_join_request: boolean;
      is_primary: boolean;
      is_revoked: boolean;
    };
  };
}
