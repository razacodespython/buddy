const { Client } = require('@notionhq/client');
import type { InitialMessage } from "../../types/initialmessage";
//boiler plate notion doc
//load environment variable
const notion:any = new Client({ auth: process.env.NOTION_API_KEY });

//make the api call
export default async function handler(req: any, res: any): Promise<void> {
    //take the conversation
        const body:InitialMessage[] = req.body.messages;

    //format the conversation to a journal format
    const output:string = body
    .map(item => `${item.role.charAt(0).toUpperCase()}${item.role.slice(1)}: ${item.content}`)
    .join('\n');


    //boiler plate format
    //pass json with the data
  const response:any = await notion.pages.create({
    "cover": {
        "type": "external",
        "external": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg"
        }
    },
    "icon": {
        "type": "emoji",
        "emoji": "🥬"
    },
    "parent": {
        "type": "database_id",
        "database_id": "fa9e11bcb895499c8e96b866d39f6a8f"
    },
    "properties": {
        "Name": {
            "title": [
                {
                    "text": {
                        "content": "Tuscan kale"
                    }
                }
            ]
        },
        "Description": {
            "rich_text": [
                {
                    "text": {
                        "content": "A dark green leafy vegetable"
                    }
                }
            ]
        }
    },
    "children": [
        {
            "object": "block",
            "heading_2": {
                "rich_text": [
                    {
                        "text": {
                            "content": "Lacinato kale"
                        }
                    }
                ]
            }
        },
        {
            "object": "block",
            "paragraph": {
                "rich_text": [
                    {
                        "text": {
                            //pass the output, the formatted conversation
                            "content": output,
                            "link": {
                                "url": "https://en.wikipedia.org/wiki/Lacinato_kale"
                            }
                        },
                        "href": "https://en.wikipedia.org/wiki/Lacinato_kale"
                    }
                ],
                "color": "default"
            }
        }
    ]
});
  res.send(response)
}

// "content": JSON.stringify(conversation),