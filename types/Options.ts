export type Options = {
    method: string;
    headers: header;
    body: string;
  
  }
  
  type header = {
    accept: string,
    "Notion-Version": string,
    "content-type": string
  }