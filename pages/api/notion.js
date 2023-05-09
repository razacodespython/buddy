const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
export default async function handler(req, res) {
    const body = req.body.messages
    const output = body
    .map(item => `${item.role.charAt(0).toUpperCase()}${item.role.slice(1)}: ${item.content}`)
    .join('\n');
    // const myObject = JSON.parse(JSON.stringify(body));
    // console.log('this is body')
    // console.log(myObject)
    // let output = '';
    // for (const item of body) {
    //     output += `${item.role.charAt(0).toUpperCase()}${item.role.slice(1)}: ${item.content}\n`;
    //   }
    // let conversation = output.replace(/\n/g, "\n")
      
  const response = await notion.pages.create({
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
        // "Food group": {
        //     "select": {
        //         "name": "🥬 Vegetable"
        //     }
        // }
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
  console.log(response);

}

// "content": JSON.stringify(conversation),